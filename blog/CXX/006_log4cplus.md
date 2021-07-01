# log4cplus 使用

## 前言

log4cplus 是 log4j 的 C++ 实现，提供的接口和使用逻辑与 log4j 基本保持一致；有 log4j 使用经验的人使用 log4cplus 是一件很愉快的事情。



## 下载编译

**下载**

源码仓库地址 <https://github.com/log4cplus/log4cplus>

**编译安装**

依次执行以下语句

```bash
tar xvf log4cplus-2.0.6.tar.xz
cd log4cplus-2.0.6
mkdir build
cd build
cmake ..
make
sudo make install
```



## log4cplus 主要概念

Logger：记录日志的句柄

Appender：用于指定内容的输出位置，如：控制台，文件、远程服务器等；一个 Logger 可添加多个 Appender，从而向多个地方输出日志。
Layout：用于指定日志输出的格式；每个 Appender 需要设置一个 Layout

日志等级：FATAL, ERROR, WARN, INFO, DEBUG, TRACE，由高到低



## 简单使用

**使用步骤**

1. 创建 Layout ，并设置输出格式
2. 创建 Appender，并指定使用的 Layout
3. 获得一个 Logger 实例，并设置其日志输出等级阈值
4. 给 Logger 添加 Appender
5. 使用宏输出日志

**示例**

CMakeLists.txt

```cmake
find_package(log4cplus)
target_link_libraries(${PROJECT_NAME} log4cplus::log4cplus)
```

main.cpp

```cpp
#include <iostream>
#include <log4cplus/log4cplus.h>

void log()
{
    auto logger = log4cplus::Logger::getInstance("test");
    LOG4CPLUS_INFO(logger, LOG4CPLUS_TEXT("fun"));
}

int main()
{
    // 控制台Appender
    log4cplus::SharedAppenderPtr consoleAppender(new log4cplus::ConsoleAppender());
    consoleAppender->setLayout(std::unique_ptr<log4cplus::Layout>(new log4cplus::SimpleLayout));
    // 文件Appender
    log4cplus::SharedAppenderPtr fileAppender(new log4cplus::FileAppender("log.log",std::ios_base::app));
    const char *pattern = "%D{ %Y-%m-%d %H:%M:%S.%q} %5p %c: %m (%l)%n";
    fileAppender->setLayout(std::unique_ptr<log4cplus::Layout>(new log4cplus::PatternLayout(pattern)));
    // 获取实例
    auto logger = log4cplus::Logger::getInstance("test");
    logger.setLogLevel(log4cplus::INFO_LOG_LEVEL);
    // 加上Appender
    logger.addAppender(consoleAppender);
    logger.addAppender(fileAppender);
    // 输出日志
    LOG4CPLUS_INFO(logger, LOG4CPLUS_TEXT("main"));
    LOG4CPLUS_ERROR(logger, LOG4CPLUS_TEXT("main"));
    log();
    return 0;
}
```

运行结果

控制台

```bash
INFO - main
ERROR - main
INFO - fun
```

log.log 文件

```bash
2021-06-24 14:44:47.199  INFO test: main (/mnt/d/Document/Documents/CLion/log4cplusdemo/main.cpp:23)
2021-06-24 14:44:47.200 ERROR test: main (/mnt/d/Document/Documents/CLion/log4cplusdemo/main.cpp:24)
2021-06-24 14:44:47.200  INFO test: fun (/mnt/d/Document/Documents/CLion/log4cplusdemo/main.cpp:7)
```

可以看到，在log函数内获取test实例也是可以使用的，所以一个 Logger 实例被配置后，将一直存在于程序中，在程序的任何地方都可通过实例名称获取到这个Logger，不用重新配置。



## 控制台日志颜色

使用 CLion 开发的话，可以使用插件 `Grep Console` 实现不同的日志级别对应不同的颜色。

我自己的配色如下

```bash
等级    RGB颜色
FATAL  CC666E
ERROR  CC666E
WARN   ABC023
INFO   5394EC
DEBUG  299999
TRACE  999999
```

如果不是 CLion；Linux 终端配色方案可以参考[《ANSI 兼容终端颜色控制》](../Linux/013_LinuxConsoleColor.md)



## 小结

这篇文章提到的都是用代码配置，每次改配置还需要重新编译代码。用过 log4j 的应该都知道使用配置文件配置是很灵活的，所以 lo4cplus 也是提供了通过配置文件配置的。具体使用方式请参考[《log4cplus配置文件》](007_log4cplusPropertyConfigurator.md)







***

*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*
