# 编译安装 QtCreator

[toc]

## 下载源码

<https://download.qt.io/official_releases/qtcreator/>

源码下载目录说明或者国内镜像可以参考之前的文章[《Linux 安装 QT》](001_InstallQt.md)

因为我自己编译的 qt 是 5.12 版本的，所以我下载的是 4.13 版本的 qt creator

我是下载下来看了 readme 才知道需要的 qt 版本；不知道有没有其他办法



## 使用 qmake

解压源码；在源码同级目录依次执行（官方文档说的是必须同级还不能有子目录）

```bash
mkdir qt-creator-build
cd qt-creator-build
qmake ../qt-creator-opensource-src-*.*.*/qtcreator.pro
make
sudo make install INSTALL_ROOT=PATH
```





## 使用 cmake

解压源码，在源码目录依次执行

```bash
cd qt-creator-opensource-src-*.*.*/
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=PATH
make 
sudo make install
```

我个人很喜欢 cmake，编译过程一目了然；在FT2000/4上面使用CMake编译大概耗时25min



## 说明

如果编译时系统内有 QtWebEngine 模块的话，帮助界面会默认使用 QtWebEngine



## 编译第三方插件

### EditorConfig

源码地址：<https://github.com/editorconfig/editorconfig-qtcreator>

**qmake**

他默认是使用qmake编译的，我不熟悉，就没试，等什么时候有时间再去搞。

**cmake**

截止目前，原仓库暂不支持 cmake 构建，我已经提交 [PR](https://github.com/editorconfig/editorconfig-qtcreator/pull/11) 了

PR 合并之前暂时使用我 fork 的仓库：<https://github.com/zcteo/editorconfig-qtcreator>

编译步骤如下：

1. 将源码下载下来，解压到 `qt-creator-opensource-src-*.*.*/src/plugins` 目录下并重命名为 `editorconfig`

2. 编辑 `plugins` 目录下的 `CMakeLists.txt` ，在 `level 3 ` 下面加上以下语句 `add_subdirectory(editorconfig)`
3. 到 CMake 编译目录下重新执行以下之前编译使用的 cmake 命令
4. 编译完成后 `sudo make install` 安装

因为 `editorconfig` 插件依赖的 `ProjectExplorer` 插件为 `level 2` 的，所以只能加在  `level 3 ` 之后



## 参考文档

1. [QtDoc - Building Qt Creator from Git](https://wiki.qt.io/Building_Qt_Creator_from_Git)

