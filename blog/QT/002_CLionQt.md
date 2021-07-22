# 配置 Clion Qt 开发环境

[toc]

## 安装

**Qt 下载** 

<http://download.qt.io/archive/qt/>

**安装**

Windows

> 添加Tools需要选择MinGW，添加环境变量

Linux

参考[Linux 安装 QT](001_Linux安装QT.md)

> /usr/lib/x86_64-linux-gnu/qtchooser/default.conf
>
> 第一行Qt bin目录，第二行Qt安装目录

## 配置 Clion

### External Tools

Qt Designer

```
Program: Qt bin目录下uic
Arguments: $FileName$
Working directory: $FileDir$
```

uic

```
Program: Qt bin目录下designer
Arguments: $FileName$ -o ui_$FileNameWithoutExtension$.h
Working directory: $FileDir$
```

### File and Code Templates

**2020.3及其以后版本已经支持QT Class，不用做额外配置**

C++ File Header

```velocity
#set($USER_NAME = "EricTeo")
//
#if($USER_NAME)
// Created by ${USER_NAME} on ${DATE}.
#else
// Created by ${USER} on ${DATE}.
#end
//
```

Qt Class Header

```velocity
#parse("C++ File Header.h")
#[[#ifndef]]# ${PROJECT_NAME}_${NAME}_h
#[[#define]]# ${PROJECT_NAME}_${NAME}_h
#[[#include]]# <${Base_class}>

namespace Ui{ class ${NAME}; }

class ${NAME} : public ${Base_class} {

Q_OBJECT

public:
    ${NAME}(QWidget *parent = nullptr);
    ~${NAME}();

private:
    Ui::${NAME} *ui;
};

#[[#endif]]# //${NAME}_h

```



Qt Class

```velocity
#parse("C++ File Header.h")
#[[#include]]# "${NAME}.h"
#[[#include]]# "ui_${NAME}.h"

${NAME}::${NAME}(QWidget *parent):${Base_class}(parent),ui(new Ui::${NAME}){
    ui->setupUi(this);
}

${NAME}::~${NAME}(){
    delete ui;
}
```



## CMake文件

CmakeList.txt

``` cmake
# 指定CMake最小版本
cmake_minimum_required(VERSION 3.0)
# 项目名 ${PROJECT_NAME}
project(qt_test)

# 指定c++标准的版本
set(CMAKE_CXX_STANDARD 17)

# 自动调用moc，uic，rcc处理qt的扩展部分
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

# 设置Qt5的cmake模块所在目录，如果不设置将使用系统提供的版本
if (WIN32)
    set(CMAKE_PREFIX_PATH D:/App/Qt/Qt5.12.7/5.12.7/mingw73_64/lib/cmake)
elseif (UNIX)
    set(CMAKE_PREFIX_PATH /home/zzc/app/Qt5.12.7/5.12.7/gcc_64/lib/cmake)
endif ()

# 找到对应的qt模块，名字为qmake中QT += <name>中的name首字母大写后加上Qt5前缀
# 例如core为Qt5Core，也可以去${CMAKE_PREFIX_PATH}的目录中找到正确的模块名
# 如果不想使用系统qt，这样写（注意NO_DEFAULT_PATH参数，它会让find_package跳过系统目录的查找）：
find_package(Qt5Widgets REQUIRED)

# 将当前目录的所有源文件添加进变量${srcs}
aux_source_directory(. srcs)
# ui文件
file(GLOB uis ${CMAKE_CURRENT_SOURCE_DIR}/*.ui)
# qrc文件
file(GLOB qrcs ${CMAKE_CURRENT_SOURCE_DIR}/*.qrc)

# 生成可执行文件
add_executable(${PROJECT_NAME} ${srcs} ${uis} ${qrcs})

# 把对应Qt模块的库链接进程序
target_link_libraries(${PROJECT_NAME} Qt5::Widgets)
```

## 打包Qt应用程序

**Windows**

1. 使用Qt自带的程序打包需要的dll
 ```windeployqt  name.exe```

2. 拷贝Qt根目录以下dll到name.exe目录

    > libgcc_s_seh-1.dll
    >
    > libstdc++-6.dll
    >
    > libwinpthread-1.dll
