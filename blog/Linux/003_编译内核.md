#  Linux x86-64 内核编译

## 操作系统

Ubuntu20.04 x86_64



## 安装环境

```bash
sudo apt install gcc g++ make pkg-config ncurses-dev flex bison libssl-dev libelf-dev
```



## 编译 x86_64 位内核

```bash
make ARCH=x86 help
make ARCH=x86 x86_64_defconfig
make ARCH=x86 menuconfig
make ARCH=x86 -j4
```



## 等待编译完成

![01](img/003/01.png)



## 安装

```bash
sudo make ARCH=x86 install
```






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

