[TOC]

## yum 服务介绍

### 什么是 yum

Yum（全称 Yellow Dog Updater）是一个在 Fedora 和 RedHat 以及 CentOS 中的 Shell 前端软件包管理器。基于 RPM 包管理，能够从指定的服务器自动下载RPM包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包.

### 软件包来源

可供Yum下载的软件包包括 Fedora, Centos 和 RedHat 本身的软件包，其中 Fedora 的软件包是由Linux社区维护的，并且基本是自由软件。所有的包都有一个独立的PGP签名。

### 常用命令行命令

#### 安装软件(以foo-x.x.x.rpm为例）：

```
yum install foo-x.x.x.rpm
```

#### 删除软件：

```
yum remove foo-x.x.x.rpm
```

或者

```
yum erase foo-x.x.x.rpm
```

#### 升级软件：

```
yum upgrade foo
```

或者

```
yum update foo
```

#### 查询信息：

```
yum info foo
```

#### 搜索软件（以包含foo字段为例）：

```
yum search foo
```

#### 显示软件包依赖关系：

```
yum deplist foo
```

#### 检查可更新的包:

```
yum check-update
```

#### 清除全部:

```
yum clean all
```

#### 清除临时包文件（/var/cache/yum 下文件):

```
yum clean packages
```

#### 清除rpm头文件:

```
yum clean headers
```

#### 清除旧的rpm头文件:

```
yum clean oldheaders
```

#### 可安装和可更新的rpm包:

```
yum list　
```

#### 已安装的包:

```
yum list installed
```

#### 已安装且不在资源库的包:

```
yum list extras
```

#### 可选项:

```
-e 静默执行  

-t 忽略错误
 
-R [分钟] 设置等待命令执行结束的最大时间
 
-y 自动应答，在执行 yum 操作时不需要用户交互确认
 
--skip-broken 忽略依赖问题
 
--nogpgcheck 忽略 GPG 校验过程
```

## CentOS更换yum源

### 备份

```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

### 下载新的CentOS-Base.repo 到/etc/yum.repos.d/

CentOS 6

```
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
```

或者

```
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
```

CentOS 7

```
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

或者

```
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

### 之后运行yum makecache生成缓存

### 其他

非阿里云ECS用户会出现 Couldn't resolve host 'mirrors.cloud.aliyuncs.com' 信息，不影响使用。用户也可自行修改相关配置: eg:

```
sed -i -e '/mirrors.cloud.aliyuncs.com/d' -e '/mirrors.aliyuncs.com/d' /etc/yum.repos.d/CentOS-Base.repo
```

CentOS-Base.repo

```bash
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
 
[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#released updates 
[updates]
name=CentOS-$releasever - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#contrib - packages by Centos Users
[contrib]
name=CentOS-$releasever - Contrib - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/contrib/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
```

