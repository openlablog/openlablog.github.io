---
created: 2026-01-08 15:42:08
modified: 2026-01-13 15:27:01
---

由于网站几次被人以搞并发弄跨了，所以百度了一堆方法。其中有一篇针对 apache 的能限制 ip 访问量。不允许同一 ip 大并发访问。

安装模块

```
# yum install mod_limitipconn.x86_64 -y
```

配置文件

```
# ll /etc/httpd/conf.d/
total 16
-rw-r--r-- 1 root root 475 Dec 11  2008 limitipconn.conf
```

可直接在网站内做如下设置

```
# vim /etc/httpd/conf/httpd.conf
```

```bash
......
<VirtualHost 192.168.0.1:80>
DocumentRoot /var/www/html
ServerName www.myweb.com
<ifModule mod_limitipconn.c>
    <Location /> #这里表示限制根目录，即全部限制，可以根据需要修改
       MaxConnPerIP 2 #这里表示最多同时两个线程
       NoLimit html/* #这里表示html目录下不受限制
     </Location>
</ifModule>
......
```
