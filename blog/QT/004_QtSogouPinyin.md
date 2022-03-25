# Linux Qt 使用搜狗输入法

[TOC]

## 前言

不出意外的话，Qt 是不能使用搜狗输入法的，状态栏都看不到那种。

主要是搜狗输入法使用的是[小企鹅(fcitx)](https://fcitx-im.org/) 输入框架，Qt 默认没有集成。



## 解决方案

将小企鹅输入法扩展复制到相应的路径下，如果自己系统内没有并没有 `libfcitxplatforminputcontextplugin.so` 那就请看[获取小企鹅输入法扩展](#获取小企鹅输入法扩展)



### Qt Creator 使用搜狗输入法

复制小企鹅扩展到 Qt Creator 相应路径下

```$QtDir``` 为自己 Qt 的安装路径

```bash
cd $QtDir/Tools/QtCreator/lib/Qt/plugins/platforminputcontexts
sudo cp /usr/lib/x86_64-linux-gnu/qt5/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so .
sudo chmod +x libfcitxplatforminputcontextplugin.so
```



### Qt 生成的应用使用搜狗输入法

复制小企鹅扩展到 Qt 相应路径下

```$QtDir``` 为自己 Qt 的安装路径

`$QtVersion` 为自己 Qt 的版本号

```bash
cd $QtDir/$QtVersion/gcc_64/plugins/platforminputcontexts
sudo cp /usr/lib/x86_64-linux-gnu/qt5/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so .
sudo chmod +x libfcitxplatforminputcontextplugin.so
```

经过上面的简单操作就能愉快的在 Qt 使用搜狗输入法了。



## 获取小企鹅输入法扩展

### 直接 apt 安装

```bash
sudo apt install fcitx-frontend-qt5
```

但是不出意外的话，这里要下载安装几百兆文件，万一我那是嵌入式系统，完全遭不住好吗



### 源码编译

**获取源码** 

<https://github.com/fcitx/fcitx-qt5>

**安装编译需要的库**

这里默认认为早已经安装 C++ 编译环境了哈

```bash
sudo apt install extra-cmake-modules
sudo apt install libxkbcommon-dev
sudo apt install fcitx-libs-dev
```

**编译**

```bash
cd $fcitx-qt5-dir
mkdir build && cd build
# 指定qt库的路径，我不需要其他库，所以-DENABLE_LIBRARY=OFF
cmake .. -DCMAKE_PREFIX_PATH=$QtDir/$QtVersion/gcc_64/lib/cmake/ -DENABLE_LIBRARY=OFF
make
sudo make install
```

然后就能在 `$QtDir/$QtVersion/gcc_64/plugins/platforminputcontexts` 下面看到我们需要的库了



## 附件

预编译的 x86_64 的 libfcitxplatforminputcontextplugin.so [下载](/pages-assitant/QT/004/x86_64/libfcitxplatforminputcontextplugin.so)

预编译的 aarch64 的 libfcitxplatforminputcontextplugin.so [下载](/pages-assitant/QT/004/aarch64/libfcitxplatforminputcontextplugin.so)

