---
created: 2026-01-28 19:51:52
updated: 2026-01-29 08:54:48
weight: 15
---

## Byet 介绍

1. Byet 平台主营网络服务，公司位于英国，向个人和小型企业提供 **免费和付费网络托管服务** 的平台。
2. 市面上有一些免费主机空间大多是 Byet 主机的分销商，例如 **InfinityFree**、**ProFreeHost** 等等。
3. 这些免费主机配置一般是 5GB 空间，无限流量，支持 PHP 和 MySql 和免费的二级域名。

部署在这些主机上的网站，在浏览器首次访问时链接都会跳转到 **中转页面**（如下图），中转页面 是经过加密后的页面，判断是否存在相应的 cookies，如果不存在就跳转到中转页面（原链接 +?i=1）。

![](assets/Byet%20系列免费主机的网站如何删除链接中的-i=1，优化API%20请求、SEO和GEO/file-62.8477.jpg)

主机管理员说这是主机的设定，通过验证 cookies 来防止非法访问。但是对 SEO 和 GEO 来说，搜索引擎蜘蛛是无法爬取到真实页面内容，并且对于一些带 API 接口网站也是不友好的，请求 API 时都无法返回想要的结果。

针对 Byet 系列免费主机的一些限制，有以下两种处理方法：

## 一、删除链接中的?i=1

在页面头部添加以下代码，实现自动删除?i=1，示例网站：[https://how-to-remove-i-1.infinityfree.me](https://how-to-remove-i-1.infinityfree.me)

```html
<head>
    <meta charset="UTF-8" />
    <title>示例网站：自动删除链接中的?i=1</title>
    <script>
        let delete_i = new URL(location.href)
        delete_i.searchParams.delete('i')
        history.pushState({}, '', delete_i.href)
    </script>
</head>
```

方法一只是针对浏览器用户优化，更好的优化选择方法二。

## 二、优化 API 请求、SEO 和 GEO

优化代码在 GitHub 仓库：[https://github.com/openlablog/optimizing-api-seo-geo-for-byet](https://github.com/openlablog/optimizing-api-seo-geo-for-byet)
