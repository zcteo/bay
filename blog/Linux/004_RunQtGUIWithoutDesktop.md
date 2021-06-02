# 不带桌面环境运行qt程序

[TOC]

## 安装运行环境

X server 安装 xorg

```bash
sudo apt install xorg
```

Window manager 可选，安装 xfwm4

```bash
sudo apt install xfwm4
```

https://blog.csdn.net/weixin_30787531/article/details/95459026

## 启动 X Server

```bash
# 会启动一个 Terminal 界面
sudo xinit
# 或者启动的时候直接指定程序
sudo xinit $Client
```






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

