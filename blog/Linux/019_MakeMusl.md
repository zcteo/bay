# 构建 musl 交叉编译工具链

[TOC]

## 前言

由于家里使用了 openwrt 软路由，默认使用的是 musl，但是有些自己想用的软件却没有预先编译的，那就自己动手，丰衣足食



## musl 交叉编译工具链

下载预先编译的 <https://musl.cc/>，好了，本文就此结束



### 编译环境准备

现在最新的 ubuntu 是 22.04，考虑到兼容性，我使用 docker 在 ubuntu:18.04 上面构建

```bash
sudo apt install gcc g++ make wget  # 这个几个是必须要的哈
sudo apt install git vim # 自己用的工具
```



### 获取工具链

打开 [musl](https://musl.libc.org/) 官网里面有链接可以跳转到一键构建交叉编译链的仓库 [musl-cross-make](https://github.com/richfelker/musl-cross-make)

下载源码，切换到最新的 tag，此时最新的是 v0.9.9

```bash
git clone https://github.com/richfelker/musl-cross-make.git -b v0.9.9
cd musl-cross-make
```



## 编译

**配置**

因为我的软路由是 arm64 的，在工具链根目录下创建如下文件 config.mak，所有支持的 TARGET 在 github 页面上有说

```ini
TARGET=aarch64-linux-musl
```



**开始编译**

这一步会下载一些需要的源码，所以耗时跟网络环境及主机性能有关哈，反正等着就完事

```bash
make -j 
```



**安装**

默认安装在当前目录 output 下面

```bash
make install
```



**strip 一些东西，减小体积**

`bin` 目录下所有工具

`libexec/gcc/aarch64-linux-musl/9.2.0` 目录下工具

## 验证一把

来个 hello world

main.c

```c
#include <stdio.h>
int main(){
    printf("hello world c\n");
    return 0;
}
```

main.cpp

```cpp
#include <iostream>
int main(){
    std::cout << "hello world c++\n";
    return 0;
}
```

编译

```bash
aarch64-linux-musl-gcc main.c -o hello-c
aarch64-linux-musl-g++ main.cpp -o hello-cpp
```

经验证，拷到板子上是可以运行的，收工



## 附件

[gcc-9.2.0-x86_64_aarch64-linux-musl.tar.xz](/pages-assitant/Linux/019/gcc-9.2.0-x86_64_aarch64-linux-musl.tar.xz)



