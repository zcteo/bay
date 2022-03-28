# CLion 使用

[TOC]



## 前言

记录一下 clion 使用过程中遇到的一些小问题



## 大文件不分析

clion 默认静态分析的源文件最大为 500000 字节，大约 500KB，超过这个大小的文件，代码分析和补全就不起作用了

双击 `shift` 按键，弹出的搜索框输入 registry，点击结果中的 `Registry...`，直接输入 `file.len` 应该就能看到了，将默认值 500000 适当调大



## 远程调试

### 远程没有安装 rsync 无法同步代码

clion 远程调试 Linux，默认Linux主机上需要有 rsync

双击 `shift` 按键，弹出的搜索框输入 registry，点击结果中的 `Registry...`，直接输入 rsync，去掉  `clion.remote.use.rsync` 勾选



### 远程主机 tar

之前用的 petalinux 做的系统，tar 打包出来的文件无法解包，clion 远程调试一直报错，所以需要禁用 tar

双击 `shift` 按键，弹出的搜索框输入 registry，点击结果中的 `Registry...`，直接输入 remotetar，去掉  `clion.remote.compress.tar` 勾选



### 远程启动程序无法停止

这个我得多说几句，本来之前用的好好的，突然也不知道自己做了啥操作，导致远程调试的时候，程序无法停下来，点了停止，但是程序无法退出，折腾了两天。clion 全部恢复出厂设置就能恢复，一打开同步设置就又出现这个问题，百思不得其姐，还好机缘巧合之下发现了问题所在，也是写这篇笔记的直接原因。

双击 `shift` 按键，弹出的搜索框输入 registry，点击结果中的 `Registry...`，直接输入 pty，勾选上  `run.pocesses.with.pty` 

又能一点停止程序就直接停掉了，好开心



## 最后一句

发现 jetbrains ide 的好多高级设置都隐藏在了`Registry...` 里面，而且入口还不明显，又 get 到一个新姿势



