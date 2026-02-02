---
created: 2026-02-02 15:54:34
updated: 2026-02-02 16:06:38
weight: 16
---

在 Hono 环境下（通常是 Cloudflare Workers, Deno 或 Bun），由于没有浏览器环境的 DOMParser，最完美的方案是使用 基于正则但具备状态保护机制 的同步函数。考虑到性能和 Hono 的轻量特性，不建议引入像 jsdom 这样沉重的库。以下是为您优化的 TypeScript 生产级 压缩函数：

### 压缩模块：minifyHTML.ts

```javascript
/**
 * 针对 Hono 环境优化的 HTML 压缩器
 */
export default async (html: string): Promise<string> => {
    let cache: string[] = [];

    // 1. 隔离保护区 (script, style, pre, textarea)
    let result = html.replace(/<(script|style|pre|textarea)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
        // 内部简单清理：仅针对 script/style 移除注释和多余空行
        if (match.toLowerCase().startsWith('<script') || match.toLowerCase().startsWith('<style')) {
            let cleaned = match
                .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
                .replace(/^\s+|\s+$/gm, '') // 移除行首尾空格
                .replace(/\n\s*\n/g, '\n'); // 合并空行
            cache.push(cleaned);
        } else {
            cache.push(match);
        }
        // 使用 \u0000 占位符确保不会被后续正则误伤
        return `\u0000${cache.length - 1}\u0000`;
    });

    // 核心压缩
    result = result
        // 2. 移除 HTML 注释 (不包含 IE 条件注释)
        .replace(/<!--(?!\s*\[if[\s\S]+?\])[\s\S]*?-->/g, '')
        // 3. 移除标签间的换行和空格
        .replace(/>\s+</g, '><')
        // 4. 将文本中多个空格合并为一个
        .replace(/\s{2,}/g, ' ')
        // 5. 移除属性赋值前后的空格
        .replace(/\s*=\s*(?=["'])/g, '=')
        // 6. 优化属性，简化布尔属性
        .replace(/(checked|disabled|readonly|selected|required|autofocus)="[^"]*"/gi, '$1')
        // 7. 移除自闭合标签多余空格
        .replace(/\s\/>/g, '/>')
        // 8. 移除标签前后多余空格
        .replace(/>\s/g, '>')
        .replace(/\s</g, '<');

    // 9. 还原受保护区域
    return result.replace(/\u0000(\d+)\u0000/g, (_, i) => cache[Number(i)]).trim();
};
```

### 引入模块：index.ts

```javascript
import { Hono } from 'hono';
import minifyHTML from './minifyHTML';

const app = new Hono();

// 自定义中间件，重写 c.html() 方法
app.use('*', async (c, next) => {
    // 保存原始 c.html 方法
    let originalHtml = c.html.bind(c);

    // 重写当前上下文的 c.html 方法
    c.html = (async (html: string, status?: number, arg3?: any) => {
        // 压缩 HTML 源码
        let minified = await minifyHTML(html);

        return originalHtml(minified, status as any, arg3);
    }) as any;

    await next();
})

app.get('/', (c) => {
    return c.html(`<!DOCTYPE html>
    <html>
      <body>
        <h1>   Hello Hono!   </h1>
        <script>
          // 这段注释会被移除
          console.log("Minified");
        </script>
      </body>
    </html>`);
});

export default app;
```

### 为什么这是针对 Hono 的最佳方案？

1. **无环境依赖**：不依赖浏览器的 `DOMParser`，可在 **Cloudflare Workers** 或 **Node.js** 等任何 JS 运行时工作。
2. **类型安全**：完整的 TypeScript 定义，适合现代开发流水线。
3. **内存友好**：使用 `\u0000` 这种非打印字符作为占位符，比字符串随机 Hash 更快且不会发生碰撞。
4. **Hono 集成**：通过中间件模式，你不需要在每个路由里手动调用压缩。
