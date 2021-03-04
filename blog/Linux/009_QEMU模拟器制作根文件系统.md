# QEMU 模拟器定制根文件系统

[toc]

## 安装 qemu-user-static

```bash
sudo apt install qemu-user-static
```

 

## 下载 Ubuntu 根文件系统

<http://cdimage.ubuntu.com/ubuntu-base/releases/>

我这里下载的是 [ubuntu-base-20.04.1-base-armhf.tar.gz](http://cdimage.ubuntu.com/ubuntu-base/releases/20.04/release/ubuntu-base-20.04.1-base-armhf.tar.gz)

**注意这里需要使用 root 权限解压**

```bash
mkdir ubuntu20
sudo tar -xvf ubuntu-base-20.04.1-base-armhf.tar.gz -C ubuntu20/
```

**拷贝 qemu-user-static 到 `./usr/bin/`**

```bash
cd ubuntu20
sudo cp /usr/bin/qemu-arm-static ./usr/bin/
```



## 挂载并 chroot

在 ubuntu20 上一级目录创建 m.sh；脚本内容见 [附件1](#附件1 m.sh 脚本)

使用脚本挂载

```bash
./m.sh -m ubuntu20/
```

此时就进入 Arm 系统了



## 配置跟文件系统

设置 root 密码

```bash
passwd root
```

修改主机名

```bash
echo 'ubuntu' > /etc/hostname
```

设置 DNS

```bash
echo 'nameserver 180.76.76.76' > /etc/resolv.conf
```

设置本机解析

```bash
 echo '127.0.0.1 localhost' >>/etc/hosts
 echo "127.0.0.1 $(cat /etc/hostname)" >>/etc/hosts
```

apt 源换为国内镜像

```bash
sed -i 's/ports.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
```

愉快的使用 apt 安装软件

```bash
apt update
apt install iputils-ping sudo ssh ifupdown vim iproute2
```

安装了 ifupdown 之后配置网卡

```bash
vim /etc/network/interfaces
```

> 文件内容：
> 
> ```bash
> # interfaces(5) file used by ifup(8) and ifdown(8)
> # Include files from /etc/network/interfaces.d:
> source-directory /etc/network/interfaces.d
> auto lo inet loopback
> 
> auto eth0
> iface eth0 inet static
>   address 192.168.110.103
>   netmask 255.255.255.0
>   gateway 192.168.110.1
>   dns-nameservers 180.76.76.76 8.8.8.8
> ```

## 退出并清理

退出

```bash
exit
```

取消挂载

```bash
/m.sh -u ubuntu20/
```



***制作文件镜像请参考[将已有 Linux 系统做成 img 镜像](001_将已有Linux系统做成img镜像.md)***



## 附件1 m.sh 脚本

```bash
#!/bin/bash
mnt () 
{
    echo "MOUNTING"
    sudo mount -t proc /proc ${2}proc
    sudo mount -t sysfs /sys ${2}sys
    sudo mount -o bind /dev ${2}dev
    sudo mount -o bind /dev/pts ${2}dev/pts      
    sudo chroot ${2}    
}
umnt ()
{
    echo "UNMOUNTING"
    sudo umount ${2}proc
    sudo umount ${2}sys
    sudo umount ${2}dev/pts
    sudo umount ${2}dev 
}

if [ "$1" = "-m" ] && [ -n "$2" ];
then
    mnt $1 $2
    echo "mnt -m pwd"
elif [ "$1" = "-u" ] && [ -n "$2" ];
then
    umnt $1 $2
    echo "mnt -u pwd"
else
    echo ""
    echo "Either 1'st, 2'nd or bothparameters were missing"
    echo ""
    echo "1'st parameter can be one ofthese: -m(mount) OR -u(umount)"
    echo "2'nd parameter is the full pathof rootfs directory(with trailing '/')"
    echo ""
    echo "For example: ch-mount -m/media/sdcard/"
    echo ""
    echo 1st parameter : ${1}
    echo 2nd parameter : ${2}
fi
```

