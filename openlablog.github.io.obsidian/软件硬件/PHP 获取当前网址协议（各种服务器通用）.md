---
created: 2026-01-08 16:24:28
updated: 2026-01-18 00:00:24
---

PHP 获取当前网址协议 (HTTP/HTTPS)

```php
if(isset($_SERVER['HTTP_X_CLIENT_SCHEME'])){
    $scheme = $_SERVER['HTTP_X_CLIENT_SCHEME'] . '://';
}elseif(isset($_SERVER['REQUEST_SCHEME'])){
    $scheme = $_SERVER['REQUEST_SCHEME'] . '://';
}else{
    $scheme = 'http://';
}
echo $scheme; // http:// or https://
```
