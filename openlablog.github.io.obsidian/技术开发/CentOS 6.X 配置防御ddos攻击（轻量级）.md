---
created: 2026-01-08 15:33:21
modified: 2026-01-16 20:44:55
---

我们可以使用 netstat 命令查看当前系统连接的状态，是否有受到 DDOS 攻击

```
# netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n
```

前面是 IP 地址的请求数 

```
9 183.32.67.179
10 121.35.228.194
```

开始配置防御，版本：DDoS-Deflate version 0.6

第一步：安装命令：

```
# wget http://www.inetbase.com/scripts/ddos/install.sh
# chmod 700 install.sh
# ./install.sh
```

然后会自动进行安装，完成后会有一段版权提示与说明，按 q 键退出即可。

卸载命令：

```
# wget http://www.inetbase.com/scripts/ddos/uninstall.ddos
# chmod 700 uninstall.ddos
# ./uninstall.ddos
```

第二步：修改配置

进入目录/usr/local/ddos/ddos.conf，或者也可以通过命令更改 vi /usr/local/ddos/ddos.conf 编辑完成后：wq 保存退出  
下面介绍一下 ddos.conf 的基本配置#为注释部分不用理会关键配置项有：

```bash
PROGDIR="/usr/local/ddos" #文件存放目录
PROG="/usr/local/ddos/ddos.sh" #主要功能脚本
IGNORE_IP_LIST="/usr/local/ddos/ignore.ip.list" #IP白名单列表
CRON="/etc/cron.d/ddos.cron" #crond定时任务脚本
APF="/etc/apf/apf"          #APF执行文件
IPT="/sbin/iptables"        #iptables执行文件

FREQ=1 #间隔多久检查一次，默认1分钟

NO_OF_CONNECTIONS=150 #最大连接数设置，超过这个数字的IP就会被屏蔽

APF_BAN=0 #1：APF，0：iptables：1，CENTOS 6.X 推荐使用iptables

KILL=1    #是否屏蔽IP 1：屏蔽，0：不屏蔽

EMAIL_TO="root" #发送电子邮件报警的邮箱地址，换成自己使用的邮箱

BAN_PERIOD=600  #禁用IP时间，可根据情况调整，默认单位：秒
```

配置文件/usr/local/ddos/ddos.sh，修改 117 行

```bash
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr > $BAD_IP_LIST
```

修改为以下代码即可！

```bash
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sed -n '/[0-9]/p' | sort | uniq -c | sort -nr > $BAD_IP_LIST
```

第三步：启动防御

先添加定时 crond 执行任务：

```
# crontab /etc/cron.d/ddos.cron
```

然后启动服务：

```
# service iptables restart
# service crond restart
```

最后加入开机任务：

```
# chkconfig crond on
# chkconfig iptables on
```

收工。
