---
created: 2026-01-08 17:46:25
modified: 2026-01-14 14:02:34
---

## 先决条件

要从 IIS 使用和设置 SMTP 服务器服务，请确保安装了所需的功能和角色服务。

SMTP 服务仅适用于 Windows 服务器操作系统（例如 Windows Server 2012 和 2008）。

SMTP 服务器功能的安装是通过服务器管理选项完成的：

![](site-lib/media/up-c580d9b81e9633ffab326181c5d784cf729.jpg)

这需要 IIS Web 服务器的附加服务器角色（例如 IIS 6 管理控制台和远程服务器管理工​​具）：

![](site-lib/media/up-e30b67d517a3fba3cb5f77f48040d98c8a4.png)

安装此功能后，请确保 SMTP 服务正在运行，并设置为以自动模式启动：

![](site-lib/media/up-f13019afd711eced900c6757cc2944b113b.jpg)

## 接着需要做什么

安装 SMTP 服务后，请执行以下步骤来设置 SMTP 服务器：

1. 为 SMTP 服务器创建域
2. 在 IIS 中配置 SMTP 服务器

请按照下述步骤操作。

### **1\. 为 SMTP 服务器创建域**

**1.1 创建新域**

首先，右键单击“域”并选择“新建”->“域”。

![](site-lib/media/up-27963d608d623d3372e19f80b9568c21bd6.png)

**1.2 指定是远程域**

选择远程作为域类型，然后单击下一步。

![](site-lib/media/up-b93b79bfa299f6d900731e9bc798ee599c9.png)

**1.3 相应地命名域**

将此域命名为与您发送的通知的域相匹配，然后单击完成。

![](site-lib/media/up-52f86174c0b5c1c6dd2626ad0ca302c1ec2.png)

**1.4 为域设置更多选项**

右键单击新创建的域并选择“属性”。

![](site-lib/media/up-93fa6bb49cec7b146e6658dd06af5d4a1d7.png)

此 SMTP 服务器应该是有权发送电子邮件通知的服务器（确保启用“允许将传入邮件中继到此域”）。

需要支持中继。

在属性窗口的“路由域”框中，选择“使用 DNS 路由到此域”。

![](site-lib/media/up-d2b82df47f6e0a3d353a82eee0bc1fdafd8.png)

根据需要向 SMTP 服务器提供的凭据，根据需要配置出站安全性。（此设置请看文章底部补充）

![](site-lib/media/up-8ab77d380b84d311dc4e0f1d72090beaa11.png)

单击“确定”。

### 2.在 IIS 中配置 SMTP 服务器

**2.1. 启动 IIS 管理器 6.0**

通过 IIS 6 管理控制台配置 SMTP 服务（即使您有较新版本的 IIS）。

您可以使用“开始”->“管理工具”->“Internet Information Services 6.0”选项启动它，或使用“服务器管理”选项。

![](site-lib/media/up-36da3acf7af789e1f6cf7055b54d6ee1d57.png)

**2.2. 配置 SMTP 服务器属性**

要验证设置，请右键单击并选择属性：

![](site-lib/media/up-1180eace2d60563348cb5fcb00947ffea83.png)

检查以下配置：

- 身份验证应该是匿名访问：

![](site-lib/media/up-c4318ed483f83bdf74a564b86be39411b87.png)

- 应仅允许来自本地服务器的连接（在本例中它是本地服务器，称为 localhost）（使用邮件客户端连接无须设置此项）

![](site-lib/media/up-4593ac92d1c8710f70ff7d74118a44471df.png)

- 应仅允许来自本地服务器 (localhost) 的中继（使用邮件客户端连接无须设置此项）

![](site-lib/media/up-1f14d6b3c8ed4dd4041629022117ab7b956.png)

- 对于“消息”选项，调整要配置的参数：允许限制消息大小（根据电子邮件附件放置的文件大小的允许和预期增量）、允许限制会话大小（与上一个参数类似，但用于对多封电子邮件进行分组）在同一活动中），将每个连接的消息数量限制为（与上一个参数类似，但在对多个电子邮件进行分组时限制消息数量，而不是使用文件大小作为标准），并限制每个连接的收件人数量消息至（设置同一电子邮件中的最大收件人数量）。

![](site-lib/media/up-70d204661a13a409682f99b379bda460e5c.png)

- 在传送设置下，指定具有匿名访问和 TLS 加密的出站安全选项：

![](site-lib/media/up-58a3cadca4e357eef7629a45a9d142d197d.png)

![](site-lib/media/up-ad7b8efb80e3071e74cec0f8996e23b3c66.png)

- 使用高级选项指定在 SMTP 服务器中创建的域。将智能主机留空。

![](site-lib/media/up-7e17c9e3a4ab4caeee4bc4ea86b7caa86b0.png)

最后，确保完成更改后服务仍处于启动模式：

![](site-lib/media/up-4c998e886d6befa8e9f9959a65562f0188f.png)

**现在可以通过邮件客户端或者本地 localhost 连接 SMTP 服务器啦！**

### 最后补充一下

**域名设置中的出站安全性是什么？**

出站安全是意思是当邮件客户端连接 SMTP 域名时的使用凭证，通常时用基本身份验证（用户名 + 密码）。

**TLS 加密是什么？**

选中表示连接 SMTP 域名使用 465 端口，而非使用 25 端口。
