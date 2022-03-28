# 双系统修复 Linux 引导

[TOC]


## 前言

众所周知啊，要装 Windows 和 Linux 双系统的话，是需要先装 Windows 再装 Linux；因为 Windows Boot Manager 不会去引导 Linux 系统，而 Grub 会去引导 Windows 系统，所以后装 Linux 的话，就可以使用 Grub 引导 Windows，而后装 Windows 的话，Windows Boot Manager 就引导不了 Windows。

但是，凡事都有意外；万一我本来就是 Linux，想再装一个 Windows，那犯不着整个 Linux 也重装吧。又或者某些原因需要重装 Windows，那 Grub 引导也会失效，怎么办？安排



## 准备一个启动盘

我这里直接用的 Ubuntu 的 LiveCD 做的 U 盘启动盘，进去之后选择 Try Ubuntu



## 挂载分区

找到当初安装时候的分区方案，挂载起来

1. 切换到root用户

   `sudo -i`

2. 查看分区情况

   `fdisk -l`

   输出如下

   ```bash
   Disk /dev/nvme0n1：953.89 GiB，1024209543168 字节，2000409264 个扇区
   Disk model: SAMSUNG MZVLB1T0HBLR-000L7              
   单元：扇区 / 1 * 512 = 512 字节
   扇区大小(逻辑/物理)：512 字节 / 512 字节
   I/O 大小(最小/最佳)：512 字节 / 512 字节
   磁盘标签类型：gpt
   磁盘标识符：6469C8AC-C57F-43BA-A804-8E17BFF27E93
   
   设备                 起点       末尾      扇区   大小 类型
   /dev/nvme0n1p1       2048     647167    645120   315M EFI 系统
   /dev/nvme0n1p2     647168  839507967 838860800   400G Linux 文件系统
   /dev/nvme0n1p3  839507968 1258938367 419430400   200G Linux 文件系统
   /dev/nvme0n1p4 1258938368 1573511167 314572800   150G Linux 文件系统
   /dev/nvme0n1p5 1573511168 1573543935     32768    16M Microsoft 保留
   /dev/nvme0n1p6 1573543936 2000408575 426864640 203.6G Microsoft 基本数据
   ```

   然后我是 UEFI 启动，所以第一个分区是 EFI 分区，第二个分区是我的根目录

3. 挂载根目录

   `mount /dev/nvme0n1p2 /mnt`

4. 挂载 Boot 分区，如有

   `mount /dev/* /mnt/boot`

   Boot 单独分区的需要挂载，我这里没有单独分区，所以不需要挂载

5. 挂载 EFI 分区，**重要**

   `mount /dev/nvme0n1p1 /mnt/boot/efi`

   之前在某度搜索到的方法都没有这一条，然后一直报错，后转某歌才找使用到解决方案



## 安装 Grub 并重启

1. 挂载相应目录

   ```bash
   mount --bind /dev /mnt/dev
   mount --bind /proc /mnt/proc
   mount --bind /sys /mnt/sys
   mount --bind /run /mnt/run
   ```

2. 安装 grub

   ```bash
   grub-install /dev/nvme0n1
   update-grub
   ```

3. 重启之后就应该能看到熟悉的 Grub了



## 小结

之前一直在某度搜索，结果都是大同小异，但是都不是 UEFI 启动的解决方案，某度的解决方案只适用于 BIOS 启动，或者说根本就是一大堆人复制粘贴，也没验证过的东西。

