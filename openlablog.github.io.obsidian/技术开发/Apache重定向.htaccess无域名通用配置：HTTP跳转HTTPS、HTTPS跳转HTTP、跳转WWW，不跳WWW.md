---
created: 2026-01-08 17:41:06
modified: 2026-01-17 10:15:59
---

## HTTP 跳转 HTTPS

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]
```

## HTTPS 跳转 HTTP

```apache
RewriteEngine On
RewriteCond %{HTTPS} =on
RewriteRule ^/?(.*) http://%{SERVER_NAME}/$1 [R,L]
```

## 跳转 WWW

```apache
RewriteEngine On

# 设置%{ENV:PROTO}变量，以允许重写自动使用适当的模式重定向（http或者https) 
RewriteCond %{HTTPS} =on
RewriteRule ^ - [E=PROTO:https]
RewriteCond %{HTTPS} !=on
RewriteRule ^ - [E=PROTO:http]

RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^ %{ENV:PROTO}://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

## 不跳 WWW

```apache
RewriteEngine On

# 设置%{ENV:PROTO}变量，以允许重写自动使用适当的模式重定向（http或者https) 
RewriteCond %{HTTPS} =on
RewriteRule ^ - [E=PROTO:https]
RewriteCond %{HTTPS} !=on
RewriteRule ^ - [E=PROTO:http]

RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ %{ENV:PROTO}://%1%{REQUEST_URI} [R=301,L]
```

---

## 常用例子

### HTTP 跳转 HTTPS，且跳转 WWW

```apache
RewriteEngine On

# HTTP跳转HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]

# 跳转WWW
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

### HTTP 跳转 HTTPS，不跳 WWW

```apache
RewriteEngine On

# HTTP跳转HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]

# 不跳WWW
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
```

### 综合写法

```apache
RewriteEngine On

# 设置%{ENV:PROTO}变量，以允许重写自动使用适当的模式重定向（http或者https)
RewriteCond %{HTTPS} =on
RewriteRule ^ - [E=PROTO:https]
RewriteCond %{HTTPS} !=on
RewriteRule ^ - [E=PROTO:https]

# HTTP跳转HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^/?(.*) %{ENV:PROTO}://%{SERVER_NAME}/$1 [R,L]

# 跳转WWW 且排除本机地址
RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteCond %{SERVER_ADDR} !=127.0.0.1
RewriteCond %{SERVER_ADDR} !=::1
RewriteRule ^ %{ENV:PROTO}://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

---

### 指定域名写法，HTTP 跳转 HTTPS，跳转 WWW

```apache
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^baidu.com [NC]
RewriteRule ^(.*)$ https://www.baidu.com/$1 [L,R=301]
```

### 指定域名写法，HTTP 跳转 HTTPS，不跳 WWW

```apache
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www.baidu.com [NC]
RewriteRule ^(.*)$ https://baidu.com/$1 [L,R=301]
```
