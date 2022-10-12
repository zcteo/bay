# 编译 FFmpeg

[toc]

## 前言

最近有使用 FFmpeg 来做视频编解码的工作，目前主要需要的是 h264 h265 相关的编解码工作，所以需要自己编译 FFmpeg 的源码

同时，FFmpeg 编码 h264 的话是需要使用 libx264 来做，所以这里也同时编译 libx264，同理也需要 libx265

由于运行环境的硬盘都挺大的，所以就做裁剪，以后有需求再做裁剪编译吧



## 源码下载

### FFmpeg

下载 release 版本

<http://www.ffmpeg.org/download.html#releases>

### x264

<http://www.videolan.org/developers/x264.html>

### x265

<http://www.videolan.org/developers/x265.html>

他这个网站不能直接下载，需要组 git 仓库克隆

```bash
git clone https://bitbucket.org/multicoreware/x265_git.git
```



## 编译

x264 和 FFmpeg 都可以通过 `./configure --help` 查看编译选项，写得很详细，按需配置

x265 用CMake写的，也没看到有啥说明，就只能手撸



### 本机编译 - x64

#### x264

```bash
./configure --prefix=/home/zzc/x264 --enable-shared --enable-strip --disable-asm
make -j$(nproc)
make install
```



#### x265

```bash
cmake .. -DCMAKE_INSTALL_PREFIX=/home/zzc/x265
make -j$(nproc)
make install
```



#### FFmpeg

需要指定 pkg-config 的搜索路径，不然会搜索到系统的 libx264 和 libx265

```bash
PKG_CONFIG_PATH=/home/zzc/x264/lib/pkgconfig/:/home/zzc/x265/lib/pkgconfig/ ./configure --prefix=/home/zzc/ffmpeg --enable-gpl --enable-version3 --disable-static --disable-doc --enable-shared --enable-libx264 --enable-libx265 --disable-x86asm
make -j$(nproc)
make install
```



### 交叉编译 - aarch64

#### x264

```bash
./configure --prefix=/home/zzc/x264-aarch64 --enable-shared --enable-strip --cross-prefix=/opt/tools/cgtools/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- --host=aarch64-linux
make -j$(nproc)
make install
```

#### x265

交叉编译就不那么简单了，需要自己改交叉编译工具链相关信息，可根据 `build/aarch64-linux/crosscompile.cmake`，将里面的编译器路径改为自己的工具链位置

crosscompile.cmake

```cmake
# CMake toolchain file for cross compiling x265 for aarch64
set(CROSS_COMPILE_ARM 1)
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)

# specify the cross compiler
set(CMAKE_C_COMPILER /opt/tools/cgtools/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu//bin/aarch64-none-linux-gnu-gcc)
set(CMAKE_CXX_COMPILER /opt/tools/cgtools/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu//bin/aarch64-none-linux-gnu-g++)

# specify the target environment
SET(CMAKE_FIND_ROOT_PATH  /opt/tools/cgtools/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu)
```

编译

```bash
cmake .. -DCMAKE_INSTALL_PREFIX=/home/zzc/x265-aarch64 -DCMAKE_TOOLCHAIN_FILE=crosscompile.cmake
make -j$(nproc)
make install
```

注：我这里遇到一个问题，直接master分支编译是不可以的，我切换到 tag 3.5 了，然后还改了 cmake 直接加 libdl 和 librt 的链接



#### FFmpeg

同样需要指定 pkg-config 的路搜索径；而且还因为配置了 cross-prefix，也需要指定 pkg-config 的可执行文件位置

```bash
 PKG_CONFIG_PATH=/home/zzc/x264-aarch64/lib/pkgconfig/:/home/zzc/x265-aarch64/lib/pkgconfig/ ./configure --prefix=/home/zzc/ffmpeg-aarch64 --enable-gpl --enable-version3 --disable-static --disable-doc --enable-shared --enable-libx264 --enable-libx265 --arch=aarch64 --target-os=linux --cross-prefix=/opt/tools/cgtools/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- --pkg-config=pkg-config
make -j$(nproc)
make install
```

