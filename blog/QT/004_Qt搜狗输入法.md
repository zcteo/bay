# Linux Qt 使用搜狗输入法

[TOC]

## 前言

不出意外的话，Qt 是不能使用搜狗输入法的，状态栏都看不到那种。

主要是搜狗输入法使用的是[小企鹅(fcitx)](https://fcitx-im.org/) 输入框架，Qt 默认没有集成。



## 解决方案

将小企鹅输入法扩展复制到相应的路径下



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

后面的版本号以自己的为准

```bash
cd $QtDir/5.12.7/gcc_64/plugins/platforminputcontexts
sudo cp /usr/lib/x86_64-linux-gnu/qt5/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so .
sudo chmod +x libfcitxplatforminputcontextplugin.so
```

经过上面的简单操作就能愉快的在 Qt 使用搜狗输入法了。






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

