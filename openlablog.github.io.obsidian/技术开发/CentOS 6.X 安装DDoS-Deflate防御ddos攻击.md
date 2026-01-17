---
created: 2026-01-08 16:11:22
modified: 2026-01-17 10:18:59
---

DDoS-Deflate 是一款非常小巧的防御和减轻 DDoS 攻击的工具，它可以通过监测 netstat 来跟踪来创建大量互联网连接的 IP 地址信息，通过 IPTABLES 禁止或阻档这些非常 IP 地址。

必须在 root 权限下的终端账户里下载和安装，具体命令如下：

```
$ wget https://github.com/jgmdev/ddos-deflate/archive/master.zip
$ unzip master.zip
$ cd ddos-deflate-master
$ ./install.sh
```

同样是 root 权限账户下执行如下命令来卸载 DDoS Deflate。

```
$ cd ddos-deflate-master
$ ./uninstall.sh
```

## DDoS Deflate 的使用

安装程序会自动检测系统是否支持 init.d 脚本,当支持的话将安装文件和启动脚本的 DDoS appropriate。在初始化的情况。DDoS Deflate 开始作为一个守护进程，它监测间隔设置为 5 秒默认。

查看配置文件

```
$ vim /etc/ddos/ddos.conf
```

```bash
# Paths of the script and other files
PROGDIR="/usr/local/ddos"
SBINDIR="/usr/local/sbin"
PROG="$PROGDIR/ddos.sh"　　# 执行脚本地址
IGNORE_IP_LIST="ignore.ip.list"　　# IP地址白名单列表
IGNORE_HOST_LIST="ignore.host.list"　　# 主机白名单列表
CRON="/etc/cron.d/ddos"　　# 计划任务文件地址
# 防火墙命令地址
APF="/usr/sbin/apf"
CSF="/usr/sbin/csf"
IPF="/sbin/ipfw"
IPT="/sbin/iptables"
IPT6="/sbin/ip6tables"
TC="/sbin/tc"
# 第22行，检查DDos时间间隔，默认1分钟
FREQ=1
# 第25行，作为一个守护进程时，运行的频率，单位秒
DAEMON_FREQ=5
# 第28行，最大连接数，超过该数值后IP就会被禁止，一般默认即可
NO_OF_CONNECTIONS=150
# 第33行，为true时仅统计接入连接，会比统计in/out更慢禁止
ONLY_INCOMING=false
# 第38行，为true时脚本将会使用tcpdump扫描由CloudFlare服务器发送的CF-Connecting-IP头标签，
# 并且禁止使用iptables字符串匹配模块
ENABLE_CLOUDFLARE=false
# 第43行，为true时启用PORT_CONNECTIONS，与ONLY_INCOMING相同，但更慢
ENABLE_PORTS=false
# 第54行，端口连接检测，为每个端口分配监听规则，格式为“端口（或端口端）:最大连接数:禁用时间（单位秒）”
PORT_CONNECTIONS="80:150:600 443:150:600 20-21:150:600"
# 第58行，使用的防火墙，包括：auto, apf, csf, ipfw, and iptables
FIREWALL="auto"
# 第62行，当ip被屏蔽是给指定邮箱发送邮件
EMAIL_TO="root"
# 第65行，IP禁止时间，单位秒
BAN_PERIOD=600
# 第71行，要阻止的连接状态，状态之间使用冒号分隔，例如：established:syn-sent:syn-recv:fin-wait-1:fin-wait-2
# 该例默认情况下，会阻止监听和关闭之外的所有状态，状态详见：man ss
CONN_STATES="connected"
# 第74行，当使用netstat时要阻止的连接状态，状态详见：man netstat。那理论上，上面是使用ss时阻止的连接状态？
CONN_STATES_NS="ESTABLISHED|SYN_SENT|SYN_RECV|FIN_WAIT1|FIN_WAIT2|TIME_WAIT|CLOSE_WAIT|LAST_ACK|CLOSING"
# 第78行，是否监控每个ip使用的带宽，超过时降低速率（需要iftop和tc命令）
BANDWIDTH_CONTROL=false
# 第82行，触发降速的带宽速率，目前支持kbit和mbit
BANDWIDTH_CONTROL_LIMIT="1896kbit"
# 第87行，触发降速时，会在指定时间周期内，速率上限
BANDWIDTH_DROP_RATE="512kbit"
# 第91行，降速的时间周期，单位秒，即600秒内会有速率上限
BANDWIDTH_DROP_PERIOD=600
# 第95行，如果为true时，仅考虑从客户端接收的数据，而不考虑服务器发给客户端的数据
BANDWIDTH_ONLY_INCOMING=true
```

注意：在配置文件中，ENABLE_PORTS（第 43 行）参数开启时，PORT_CONNECTIONS（第 54 行）才能使用；BANDWIDTH_CONTROL（第 78 行）参数开启时，BANDWIDTH_CONTROL_LIMIT（第 82 行）、BANDWIDTH_DROP_RATE（第 87 行）、BANDWIDTH_DROP_PERIOD（第 91 行）、BANDWIDTH_ONLY_INCOMING（第 95 行）才能使用。

查看定时 crond 执行任务：/usr/local/ddos/ddos.sh

```
$ crontab -l
```

加入开机任务：

```
$ chkconfig ddos on
```

DDOS 命令

```
$ ddos
DDoS-Deflate version 1.3
Copyright (C) 2005, Zaf <zaf@vsnl.com>

Usage: ddos [OPTIONS] [N]
N : number of tcp/udp connections (default 50)

OPTIONS:
-h      | --help: Show this help screen
-c      | --cron: Create cron job to run this script regularly (default 1 mins)
-i      | --ignore-list: List whitelisted ip addresses
-b      | --bans-list: List currently banned ip addresses.
-u      | --unban: Unbans a given ip address.
-d      | --start: Initialize a daemon to monitor connections
-s      | --stop: Stop the daemon
-t      | --status: Show status of daemon and pid if currently running
-v[4|6] | --view [4|6]: Display active connections to the server
-y[4|6] | --view-port [4|6]: Display active connections to the server including the port
-f      | --traffic-list: List bandwidth control rules.
-p      | --ports: List port blocking rules.
-k      | --kill: Block all ip addresses making more than N connections
```
