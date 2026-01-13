---
created: 2026-01-08 17:42:38
modified: 2026-01-13 15:30:42
---

## 基础配置

第一步：在手机上安装 ksweb（[https://kslabs.ru/download](https://kslabs.ru/download)）和 termux（[https://termux.dev/cn/](https://termux.dev/cn/)），建议安装最新版 APP

第二步：打开 ksweb 配置本地主机，如：[http://localhost:8080](http://localhost:8080)

第三步：打开 termux 配置软件源命令：termux-change-repo，然后更新软件命令：pkg update && pkg upgrade -y

第四步：在 termux 运行安装 ssh 命令：pkg install openssh -y，输入命令查看当前用户：whoami，修改密码命令：passwd，连输两次密码即可完成

第五步：在 termux 运行 ssh 命令：sshd，然后输入命令查看 ip 地址：ifconfig，在局域网里通过电脑软件连接 ssh 更容易输入和操作

## 隧道配置

第一步：在 termux 安装 Cloudflare Tunnel 命令：pkg install cloudflared -y

第二步：Cloudflare Tunnel 认证：cloudflared tunnel login，打开浏览器窗口并登录 Cloudflare 帐户，登录后选择您的主机名并确认授权

第三步：创建隧道命令：cloudflared tunnel create TUNNEL\_NAME，或者添加已有隧道命令：cloudflared tunnel token --cred-file ~/.cloudflared/TUNNEL\_UUID.json  TUNNEL_NAME，查看隧道命令：cloudflared tunnel list

第四步：接着执行运行隧道命令：cloudflared tunnel run TUNNEL_UUID，正常运行表示当前隧道状态已激活

第五步：至此可通过：[https://one.dash.cloudflare.com/](https://one.dash.cloudflare.com) 迁移隧道并配置主机名，中文配置教程：[https://cloudflared.cn/get-started/create-remote-tunnel/](https://cloudflared.cn/get-started/create-remote-tunnel/)

## 自启动配置

第一步：在 termux 安装 vim 命令：pkg install vim -y，然后输入命令创建启动文件：vim ~/.bashrc，或者使用：nano ~/.bashrc

第二步：在文件中添加下面代码并保存

```bash
#运行ssh
sshd

#运行cloudflared tunnel
nohup cloudflared tunnel run TUNNEL_NAME >/dev/null 2>&1 &
```

第三步：重新打开 termux 后，查看后台进程命令：ps，结果中看到有“cloudflared”代表隧道正常运行

完。
