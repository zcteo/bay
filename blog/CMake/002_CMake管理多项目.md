### CMake 管理多项目

项目结构

```
.
├── CMakeLists.txt
└── src
    ├── CMakeLists.txt
    ├── math
    │   ├── CMakeLists.txt
    │   ├── math.cpp
    │   └── math.h
    ├── print
    │   ├── CMakeLists.txt
    │   ├── print.cpp
    │   └── print.h
    └── start
        ├── CMakeLists.txt
        └── main.cpp
```

根目录CMakeLists.txt

```cmake
# 要求最低Cmake版本
cmake_minimum_required(VERSION 3.15)
# 项目名称
project(CMakeDemo)
# C++标准
set(CMAKE_CXX_STANDARD 17)
# 输出目录，${PROJECT_BINARY_DIR}为Cmake命令执行的位置
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)
# 添加子目录，子目录下必须有CMakeLists.txt
add_subdirectory(src)
```

src目录CMakeLists.txt

```cmake
# 包含子目录
add_subdirectory(start)
add_subdirectory(math)
add_subdirectory(print)
```

math目录CMakeLists.txt

```cmake
project(math)
# 将当前目录下所有源码文件添加到变量math_src
aux_source_directory(. math_src)
# 生成动态链接库
add_library(${PROJECT_NAME} SHARED ${math_src})
# 依赖print动态库
target_link_libraries(${PROJECT_NAME} print)
# 头文件搜索的路径
include_directories(${CMAKE_SOURCE_DIR}/src)
```

print目录CMakeLists.txt

```cmake
project(print)
# 将当前目录下所有源码文件添加到变量print_src
aux_source_directory(. print_src)
# 生成动态链接库
add_library(${PROJECT_NAME} SHARED ${print_src})
# 头文件搜索的路径
include_directories(${CMAKE_SOURCE_DIR}/src)
```

start目录CMakeLists.txt

```cmake
project(start_main)
# 将当前目录下所有源码文件添加到变量start_src
aux_source_directory(. start_src)
# 生成可执行文件
add_executable(${PROJECT_NAME} ${start_src})
# 依赖math动态链接库
target_link_libraries(${PROJECT_NAME} math)
# 头文件搜索的路径
include_directories(${CMAKE_SOURCE_DIR}/src)
```

