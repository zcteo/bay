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
