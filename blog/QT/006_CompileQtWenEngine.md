# 编译 QtWenEngine

## 前言

在之前的文章[《Linux 安装 Qt》](001_InstallQt.md)中，我说了一句 QtWenEngine 模块不好编译，暂时用不到就不管，可没想到苍天饶过谁，这么快就需要用 QtWenEngine 了，能怎么办，编呗，接着编……



## 源码下载

之前的 qt 源码里面有 webengine 的源码



## 编译安装

根据官方文档，先安装依赖库；根据官方推荐安装的，咱也不知道对不对，主要是这玩意太难编译了，就宁可多装一千，不能少装一个，全都要（因为没看到有警告，就没装这些，然后编了四个多小时还失败了，难受的一匹）

```bash
# 一条命令版
sudo apt install libssl-dev libxcursor-dev libxcomposite-dev libxdamage-dev \
     libxrandr-dev libfontconfig1-dev libxss-dev libsrtp0-dev libwebp-dev \
     libjsoncpp-dev libopus-dev libminizip-dev libavutil-dev libavformat-dev \
     libavcodec-dev libevent-dev libvpx-dev libsnappy-dev libre2-dev \
     libprotobuf-dev protobuf-compiler bison build-essential gperf flex \
     libasound2-dev libcups2-dev libdrm-dev libegl1-mesa-dev libnss3-dev \
     libpci-dev libpulse-dev libudev-dev nodejs libxtst-dev gyp ninja-build re2c

# 拆分版，跟上面一样的
sudo apt install libssl-dev
sudo apt install libxcursor-dev
sudo apt install libxcomposite-dev
sudo apt install libxdamage-dev
sudo apt install libxrandr-dev
sudo apt install libfontconfig1-dev
sudo apt install libxss-dev
sudo apt install libsrtp0-dev
sudo apt install libwebp-dev
sudo apt install libjsoncpp-dev
sudo apt install libopus-dev
sudo apt install libminizip-dev
sudo apt install libavutil-dev
sudo apt install libavformat-dev
sudo apt install libavcodec-dev
sudo apt install libevent-dev
sudo apt install libvpx-dev
sudo apt install libsnappy-dev
sudo apt install libre2-dev
sudo apt install libprotobuf-dev
sudo apt install protobuf-compiler
sudo apt install bison
sudo apt install build-essential
sudo apt install gperf
sudo apt install flex
sudo apt install libasound2-dev
sudo apt install libcups2-dev
sudo apt install libdrm-dev
sudo apt install libegl1-mesa-dev
sudo apt install libnss3-dev
sudo apt install libpci-dev
sudo apt install libpulse-dev
sudo apt install libudev-dev
sudo apt install nodejs
sudo apt install libxtst-dev
sudo apt install gyp
sudo apt install ninja-build
sudo apt install re2c
```

开始编译

```bash
# 清掉以前的缓存
rm config.cache
# 这次不skip webengine了
./configure -prefix /opt/qt-5.12.10 -qt-xcb -fontconfig -system-freetype \
            -opensource -confirm-license -nomake tests -nomake examples
cd qtwebengine
../qtbase/bin/qmake qtwebengine.pro
make -j$(nproc)
sudo make install
```

我在国产 FT2000/4 处理器上大概花了6个小时的样子吧



## 参考文章

1. [QtDoc - Building Qt Sources](https://doc.qt.io/qt-5/build-sources.html)

2. [QtWiki - QtWebEngine/How_to_Try](https://wiki.qt.io/QtWebEngine/How_to_Try)




***

*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

