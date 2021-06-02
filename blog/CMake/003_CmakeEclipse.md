# Eclipse 使用 CMake 构建项目

## 下载

Eclipse IDE for C/C++ Developers

<https://www.eclipse.org/downloads/packages/>

2021-03 R 以前的版本会有各种问题



## 使用

新建 C++ 项目选择 CMake Project

![01](img/003/01.png)



## 问题

**可以编译；但代码标红**

> 右键项目 -> index -> rebuild

**选了 Debug 还是无法调试**

> 手动在 CMakeLists.txt 加上 ```set(CMAKE_BUILD_TYPE Debug)```；暂时没找到其他更好的解决方案






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

