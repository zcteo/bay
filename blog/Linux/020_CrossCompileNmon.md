# 交叉编译 nmon

[TOC]

## 前言

由于个人实在是喜欢用 nmon，所以自己也编一个试试

这里记录了一次踩坑的过程，赶时间的请先食用 [曲线救国](#曲线救国)



## 环境准备

### 工具链

交叉编译工具链参见 [《构建 musl 交叉编译工具链》](019_MakeMusl.md)

解压，因为我是在 docker 环境内，就解压到 /root 目录，主机的话请自行斟酌一下

设置 PATH 

```bash
export PATH=$PATH:/root/aarch64-linux_x64-musl-cross/bin
```

### 第三方库 ncurses

nmon 依赖 libncurses.so 库

查看板子上是否有 libncurses.so 库，如果有，就下载对应版本的源码交叉编译，编译完成后就不替换原有版本；如果没有，就随便下载一个版本

#### 源码下载

<https://ftp.gnu.org/pub/gnu/ncurses/>

我的板子上有 6.3，我就下载 6.3 的源码

```bash
wget https://ftp.gnu.org/pub/gnu/ncurses/ncurses-6.3.tar.gz
```

#### 编译

```bash
./configure --prefix=/root/ncurses --host=aarch64-linux-musl --with-shared
make -j
make install
```

```bash
--prefix # 指定生成文件的路径
--host # 指定的是交叉编译工具链的前缀
--with-shared # 生成动态库
```



## 编译 nmon

### 源码下载

https://nmon.sourceforge.io/pmwiki.php?n=Site.CompilingNmon

我这就下载目前最新的版本了

```bash
wget https://sourceforge.net/projects/nmon/files/lmon16p.c
```

### 编译

如果赶时间的，请直接跳过这一章，直接到[曲线救国](#曲线救国)；因为这编译有问题没搞定

#### 编译

```bash
aarch64-linux-musl-gcc lmon16p.c -o nmon -I /root/ncurses/include/ncurses -I /root/ncurses/include -L /root/ncurses/lib/ -lncurses -lm
```

不出意外的话，现在就出意外了

报错如下

```bash
lmon16p.c:588:10: fatal error: fstab.h: No such file or directory
```

谷歌了一番之后，发现 musl 压根没有 fstab.h 这个文件，而且在板子上搜了一下，确实也没有这个文件，我能怎么办，很绝望啊，有木有，然后在正常 Linux 主机上打开 fstab.h，发现这里面引入的东西，好像 nmon 源码里面都没有使用耶，那就把这个行代码屏蔽了

#### 再编译

然后也不出意外的出意外了，这次报错更多了

```bash
lmon16p.c: In function 'read_vmstat':
 1502 | #define GETVM(variable) p->vm.variable = get_vm_value(__STRING(variable) );
      |                                                       ^~~~~~~~
lmon16p.c:1512:5: note: in expansion of macro 'GETVM'
 1512 |     GETVM(nr_dirty);
      |     ^~~~~
lmon16p.c:1512:11: error: 'nr_dirty' undeclared (first use in this function)
 1512 |     GETVM(nr_dirty);
      |           ^~~~~~~~
lmon16p.c:1502:64: note: in definition of macro 'GETVM'
 1502 | #define GETVM(variable) p->vm.variable = get_vm_value(__STRING(variable) );
      |                                                                ^~~~~~~~
```

还有很长很长一段报错，后面就不贴出来了；这时候真就很绝望，Google 也搜到相同的报错了，但是都没有解决方案

#### 尝试编译其他架构

**本机编译**

使用本机 gcc 直接编译本机版本

```bash
gcc lmon16p.c -lncurses -lm
```

这完全行得通啊，而且也能运行，拿到是我交叉编译的姿势不对？

那就继续换一个交叉编译工具链试试

## 曲线救国

### 使用 gnu 工具链

工具链，我最相信的还是 linaro，但是他们的最新版本只有7.5，往后的只能在 arm 官网下载

```bash
wget https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz
```

使用新的工具链重新编译 ncurses，编译方法请往前翻一翻

经验证 ARM 官网提供的工具链也是 OK 的

```bash
wget https://developer.arm.com/-/media/Files/downloads/gnu-a/10.3-2021.07/binrel/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu.tar.xz
```

链接：[linaro下载页](https://www.linaro.org/downloads/)  [ARM下载页](https://developer.arm.com/downloads/-/gnu-a)

### 编译

```bash
aarch64-linux-gnu-gcc lmon16p.c -o nmon -I /root/ncurses/include/ncurses -I /root/ncurses/include -L /root/ncurses/lib/ -lncurses -lm
```

这个编译成功了，但是肯定是不能在板子上运行的，我突然想到了 patchelf 工具，结果还真行

### patchelf 

**安装**

```bash
sudo apt install patchelf
```

`patchelf -h` 看到可以改 interpreter，真是天助我也，这机缘巧合之下，不就把事办成了吗？？？还有谁

**打个 patch**

```bash
patchelf --set-interpreter /lib/ld-musl-aarch64.so.1 nmon
```



## 小结

这次这曲线救国我是真没想到，当然也可能是我对 musl 的了解太少

那言外之意就是：根本不需要 musl 工具链，使用正常工具链，然后打个 patch 不就完事了，还折腾这么久



