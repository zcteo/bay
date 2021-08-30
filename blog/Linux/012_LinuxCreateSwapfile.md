# Linux 创建交换文件 swapfile

[TOC]

## 前言

Linux 的 swapfile 或者交换分区和 Windows 的虚拟内存技术是一个意思，当内存不够的时候拿一部分硬盘空间来顶上，当然这个硬盘速率比内存是差了很多的。

Swap 分区是在系统安装的时候就分配的，或者是硬盘还有未分配空间；如果安装系统的时候没有分配 Swap 分区并且硬盘没有未分配空间的时候，就需要用到 Swapfile 了。

至于大小，不管是 Linux 还是 Windows，基本流传的都是物理内存的两倍，但是这个着实没必要，看自己使用场景决定。如我物理内存16GB，我给的是4GB左右，或者不给；而当我物理内存只有 4GB 的时候，我还需要运行 JetBrains 全家桶的时候，我可能会给 12GB 甚至更高。

其实这个东西随便一搜都有大把的说明和教程，这里只是自己做一个记录方便自己需要使用的时候查看



## 创建 Swap 文件

**先看一下内存**

交换分区均为 0

```bash
free
# 输出结果
        total    used    free  shared  buff/cache available
Mem:  3994668  612116  113596    3452     3268956   3090036
Swap:       0       0        0
```



**创建文件**

先用 `dd` 命令整一个文件处理，具体用法就不细说了哈。

```bash
sudo dd if=/dev/zero of=/opt/swapfile bs=4M count=1024
```

**设置交换文件**

```bash
# 会提示权限建议为0600
sudo mkswap /opt/swapfile
# 设置权限为0600
sudo chmod 0600 /opt/swapfile
#重新设置，顺手指定一下label
sudo mkswap --label swapfile /opt/swapfile
```



## 启用交换文件

```bash
sudo swapon /opt/swapfile
```

**查看结果**

可以看到已经有了

```bash
free
# 输出结果
        total    used     free  shared  buff/cache available
Mem:  3994668  612116   113596    3452     3268956   3090036
Swap: 4194300       0  4194300
```



## 开机自动挂载交换文件

编辑 `/etc/fstab` 文件，加入以下行

```bash
/opt/swapfile  none  swap  defaults  0  0
```



## 取消挂载交换文件

```bash
sudo swapoff /opt/swapfile
```



## 设置交换分区

### swappiness

实际上，并不是等所有的物理内存都消耗完毕之后，才去使用swap的空间，而是由swappiness 参数值控制。

该值默认值是60.

swappiness=0 的时候表示最大限度使用物理内存，然后才是 swap 空间，

swappiness＝100 的时候表示积极的使用swap分区，并且把内存上的数据及时的搬运到swap空间里面。

查看值

```bash
cat /proc/sys/vm/swappiness
```

**临时性修改**

```bash
sysctl vm.swappiness=10
```

**永久修改**

在/etc/sysctl.conf 文件里添加如下：

vm.swappiness=10
