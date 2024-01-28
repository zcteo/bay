# CMake 安装动态库并生成 XxxConfig.cmake 文件

[toc]

## 引言

之前说了一下[《使用 CMake 生成动态库/静态库》](005_CmakeGenerateLib.md)，既然写了动态库，那肯定是要提供给别人调用的，我们就来看看要怎么调用

写过 cmake 的都应该知道，cmake 通过 find_package 去找动态库，find_package 会去调用 XxxConfig.cmake 或 xxx-config.cmake 或 FindXxx.cmake 文件去找动态库，上述文件出现的顺序就是调用的优先级，前两个文件一般是库作者提供的，后一个主要用于库作者没提供前两个文件的时候我们自己编写一个给 find_package 调用。



## 展示

直接上 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.16)

project(FooLibrary VERSION 1.0.0)

set(CMAKE_CXX_STANDARD 11)

add_library(${PROJECT_NAME} SHARED library.cpp)

# 这个使用了生成器表达式，其他项目引入包的时候就可以同时引入头文件包含路径
target_include_directories(${PROJECT_NAME} INTERFACE
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:include>)

set(CONFIG_FILE_PATH share/cmake/${PROJECT_NAME})

include(GNUInstallDirs)

include(CMakePackageConfigHelpers)

configure_package_config_file(FooLibraryConfig.cmake.in
        ${CMAKE_BINARY_DIR}/FooLibraryConfig.cmake
        INSTALL_DESTINATION ${CONFIG_FILE_PATH}
        PATH_VARS CMAKE_INSTALL_INCLUDEDIR)

write_basic_package_version_file(
        ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}ConfigVersion.cmake
        VERSION ${CMAKE_PROJECT_VERSION}
        COMPATIBILITY SameMajorVersion)

install(TARGETS ${PROJECT_NAME}
        EXPORT ${PROJECT_NAME}Targets)

install(EXPORT ${PROJECT_NAME}Targets
        DESTINATION ${CONFIG_FILE_PATH})

install(FILES
        ${CMAKE_BINARY_DIR}/FooLibraryConfig.cmake
        ${CMAKE_BINARY_DIR}/${PROJECT_NAME}ConfigVersion.cmake
        DESTINATION ${CONFIG_FILE_PATH})
```

FooLibraryConfig.cmake.in

```cmake
@PACKAGE_INIT@

include("${CMAKE_CURRENT_LIST_DIR}/@PROJECT_NAME@Targets.cmake")
```



~~FooLibraryConfig.cmake.in~~

下面这几句主要是为了设置 `<PackageName>_NCLUDE_DIR`  `<PackageName>_NCLUDES` `<PackageName>_LIBRARY`   `<PackageName>_LIBRARIES`   `<PackageName>_LIBS` 等变量，但是这些变量 CMake 没有要求且各个库提供的都不一样，所以也可以不设置。

```cmake
@PACKAGE_INIT@

include("${CMAKE_CURRENT_LIST_DIR}/@PROJECT_NAME@Targets.cmake")

get_target_property(@PROJECT_NAME@_LIBRARY @PROJECT_NAME@ LOCATION)
set_and_check(@PROJECT_NAME@_INCLUDE_DIR "@PACKAGE_CMAKE_INSTALL_INCLUDEDIR@")
```



然后就可以使用了

```cmake
find_package(FooLibrary)
target_link_libraries(${PROJECT_NAME} FooLibrary)
```



## 简单解释CMakeLists.txt

### set_target_properties 

<https://cmake.org/cmake/help/latest/command/set_target_properties.html>

```cmake
set_target_properties(target1 target2 ...
                      PROPERTIES prop1 value1
                      prop2 value2 ...)
```

安装的时候会将 `PUBLIC_HEADER` 后面指定的头文件安装到指定的路径，默认为 include



### target_include_directories 

<https://cmake.org/cmake/help/latest/command/target_include_directories.html>

```cmake
target_include_directories(<target> [SYSTEM] [AFTER|BEFORE]
  <INTERFACE|PUBLIC|PRIVATE> [items1...]
  [<INTERFACE|PUBLIC|PRIVATE> [items2...] ...])
```

上面的写法是可重定位的，`PRIVATE` 和 `PUBLIC` 会设置 targe t的 `INCLUDE_DIRECTORIES` 属性；`PUBLIC ` 和 `INTERFACE` 会设置给 target 的 `INTERFACE_INCLUDE_DIRECTORIES` 属性；里面有的那两个参数叫做什么生成表达式，也不知这个翻译对不对，官网传送门[cmake-generator-expressions](https://cmake.org/cmake/help/latest/manual/cmake-generator-expressions.7.html)



### configure_package_config_file

<https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html>

```cmake
configure_package_config_file(<input> <output>
  INSTALL_DESTINATION <path>
  [PATH_VARS <var1> <var2> ... <varN>]
  [NO_SET_AND_CHECK_MACRO]
  [NO_CHECK_REQUIRED_COMPONENTS_MACRO]
  [INSTALL_PREFIX <path>]
  )
```

与 configure_file 差不多，但是这个用来写 cmake config 文件会好很多，`INSTALL_DESTINATION` config文件将要安装的位置，`PATH_VARS` 指定的变量，可以在 Config.cmake.in 文件中类似这样 `@PACKAGE_VAR1@` 引用，这种用法可重定位，而不是硬编码



### write_basic_package_version_file

<https://cmake.org/cmake/help/latest/module/CMakePackageConfigHelpers.html>

```cmake
write_basic_package_version_file(<filename>
  [VERSION <major.minor.patch>]
  COMPATIBILITY <AnyNewerVersion|SameMajorVersion|SameMinorVersion|ExactVersion>
  [ARCH_INDEPENDENT] )
```

 `VERSION` 不指定的话就用 `PROJECT_VERSION`，都没有指定的话就会报错；`COMPATIBILITY` 版本兼容，有好几个选项，具体看官网



### install

<https://cmake.org/cmake/help/latest/command/install.html>

```cmake
install(TARGETS <target>... [...])
install({FILES | PROGRAMS} <file>... [...])
install(DIRECTORY <dir>... [...])
install(SCRIPT <file> [...])
install(CODE <code> [...])
install(EXPORT <export-name> [...])
```



#### TARGETS

```
install(TARGETS targets... [EXPORT <export-name>]
       [[ARCHIVE|LIBRARY|RUNTIME|OBJECTS|FRAMEWORK|BUNDLE|
         PRIVATE_HEADER|PUBLIC_HEADER|RESOURCE]
        [DESTINATION <dir>]
        [PERMISSIONS permissions...]
        [CONFIGURATIONS [Debug|Release|...]]
        [COMPONENT <component>]
        [NAMELINK_COMPONENT <component>]
        [OPTIONAL] [EXCLUDE_FROM_ALL]
        [NAMELINK_ONLY|NAMELINK_SKIP]
       ] [...]
       [INCLUDES DESTINATION [<dir> ...]]
       )
```



#### FILES|PROGRAMS

```
install(<FILES|PROGRAMS> files...
        TYPE <type> | DESTINATION <dir>
        [PERMISSIONS permissions...]
        [CONFIGURATIONS [Debug|Release|...]]
        [COMPONENT <component>]
        [RENAME <name>] [OPTIONAL] [EXCLUDE_FROM_ALL])
```

`TYPE` 取值以及默认路径；  `GNUInstallDirs Variable` 需要 `include(GNUInstallDirs)`

|TYPE Argumen|GNUInstallDirs Variable|Built-In Default|
|:--|:--|:--|
|BIN|${CMAKE_INSTALL_BINDIR}|bin|
|SBIN|${CMAKE_INSTALL_SBINDIR}|sbin|
|LIB|${CMAKE_INSTALL_LIBDIR}|lib|
|INCLUDE|${CMAKE_INSTALL_INCLUDEDIR}|include|
|SYSCONF|${CMAKE_INSTALL_SYSCONFDIR}|etc|
|SHAREDSTATE|${CMAKE_INSTALL_SHARESTATEDIR}|com|
|LOCALSTATE|${CMAKE_INSTALL_LOCALSTATEDIR}|var|
|RUNSTATE|${CMAKE_INSTALL_RUNSTATEDIR}|\<LOCALSTATE dir\>/run|
|DATA|${CMAKE_INSTALL_DATADIR}|\<DATAROOT dir\>|
|INFO|${CMAKE_INSTALL_INFODIR}|\<DATAROOT dir\>/info|
|LOCALE|${CMAKE_INSTALL_LOCALEDIR}|\<DATAROOT dir\>/locale|
|MAN|${CMAKE_INSTALL_MANDIR}|\<DATAROOT dir\>/man|
|DOC|${CMAKE_INSTALL_DOCDIR}|\<DATAROOT dir\>/doc|

如果不指定 `PERMISSIONS` ，`FILES` 默认权限为 `OWNER_WRITE, OWNER_READ, GROUP_READ, WORLD_READ`，`PROGRAMS` 额外还有 `OWNER_EXECUTE, GROUP_EXECUTE, WORLD_EXECUTE` 权限



#### EXPORT

需要 install TARGETS 的时候 EXPORT 才行

```
install(EXPORT <export-name> DESTINATION <dir>
        [NAMESPACE <namespace>] [[FILE <name>.cmake]|
        [PERMISSIONS permissions...]
        [CONFIGURATIONS [Debug|Release|...]]
        [EXPORT_LINK_INTERFACE_LIBRARIES]
        [COMPONENT <component>]
        [EXCLUDE_FROM_ALL])
```

