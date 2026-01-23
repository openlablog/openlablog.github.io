---
created: 2026-01-23 21:38:19
updated: 2026-01-23 22:17:18
---

Smarty 模板压缩 HTML，去除 HTML 中的回车换行空白注释等

## 方法 1

在创建对象时使用 registerFilter 绑定匿名函数

```php
$smarty = new Smarty();
// 压缩HTML
$smarty->registerFilter("output", function ($html) {
	$html = preg_replace(':\s+//.*?\n:', '', $html);
	$html = preg_replace('/<!--\s*[^[][^!][^&lt;].*?-->/s', '', $html);
	$html = preg_replace('/\/\*.*?\*\//s', '', $html);
	$html = preg_replace('/&gt;\s*&lt;/s', '&gt;&lt;', $html);
	$html = preg_replace('/(\s)+/s', ' ', $html);
	return trim($html);
});
```

## 方法 2

修改文件 sysplugins/smarty_template_source.php 中的方法：public function getContent()

```php
public function getContent()
{
	// return isset($this->content) ? $this->content : $this->handler->getContent($this);

	// 压缩HTML
	$html = isset($this->content) ? $this->content : $this->handler->getContent($this);
	$html = preg_replace(':\s+//.*?\n:', '', $html);
	$html = preg_replace('/<!--\s*[^[][^!][^&lt;].*?-->/s', '', $html);
	$html = preg_replace('/\/\*.*?\*\//s', '', $html);
	$html = preg_replace('/&gt;\s*&lt;/s', '&gt;&lt;', $html);
	$html = preg_replace('/(\s)+/s', ' ', $html);
	return trim($html);
}
```

**如果设置了模板缓存，需删除缓存文件后才生效**

![](assets/Smarty%20PHP模板引擎压缩HTML/file-109.4941.jpg)
