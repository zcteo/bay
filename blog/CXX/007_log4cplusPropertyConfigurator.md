# Log4cplus 配置文件

## 前言

之前文章[《log4cplus使用》](006_log4cplus.md)中提到使用代码配置的不灵活，log4cplus 是 log4j 的 c++ 实现，那肯定也是能支持配置文件的。这里就简单来说说 log4cplus 配置文件的使用



## 配置文件

log.properties

```properties
# 日志级别，FATAL, ERROR, WARN, INFO, DEBUG, TRACE，由高到低
log4cplus.rootLogger=TRACE,console,file,errorFile

# 控制台Appender
log4cplus.appender.console=log4cplus::ConsoleAppender
log4cplus.appender.console.layout=log4cplus::PatternLayout
log4cplus.appender.console.layout.ConversionPattern=%D{%Y-%m-%d %H:%M:%S.%q} %5p %c: %m (%l)%n

# 文件Appender
log4cplus.appender.file=log4cplus::TimeBasedRollingFileAppender
log4cplus.appender.file.Threshold=TRACE
log4cplus.appender.file.CreateDirs=true
log4cplus.appender.file.Append=true
log4cplus.appender.file.FilenamePattern=log/%d{yyyy-MM-dd}.log
log4cplus.appender.file.MaxHistory=1
log4cplus.appender.file.CleanHistoryOnStart=true
log4cplus.appender.file.RollOnClose=false
log4cplus.appender.file.layout=log4cplus::PatternLayout
log4cplus.appender.file.layout.ConversionPattern=%D{%Y-%m-%d %H:%M:%S.%q} %5p %c: %m (%l)%n

# 错误文件Appender
log4cplus.appender.errorFile=log4cplus::TimeBasedRollingFileAppender
log4cplus.appender.errorFile.Threshold=ERROR
log4cplus.appender.errorFile.CreateDirs=true
log4cplus.appender.errorFile.Append=true
log4cplus.appender.errorFile.FilenamePattern=log/%d{yyyy-MM-dd}.error
log4cplus.appender.errorFile.MaxHistory=365
log4cplus.appender.errorFile.CleanHistoryOnStart=true
log4cplus.appender.errorFile.RollOnClose=false
log4cplus.appender.errorFile.layout=log4cplus::PatternLayout
log4cplus.appender.errorFile.layout.ConversionPattern=%D{%Y-%m-%d %H:%M:%S.%q} %5p %c: %m (%l)%n
```

每个 FileAppender 具体设置都不一样，需要区别对待；具体参考 fileappender.h 文件里面的注释



## PatternLayout 格式说明

PatternLayout 是一种具有词法分析功能的布局器，优点类似正则表达式。以“%”作为开头的特殊预定义标识符，可以产生特殊的格式信息。PatternLayout 格式有以下选项：

1. "%%"，转义为% 

2. "%c"，输出logger名称，如 logger.sublogger。也可以控制logger名称的显示层次，比如"%c{1}"时输出"logger"，其中数字表示层次

3. "%D"，显示本地时间，比如："2021-06-30 18:55:45"，%d显示标准时间

   可以通过%d{...}定义更详细的时间显示格式，大括号中可显示的预定义标识符如下

   %a -- 表示星期几的英文缩写形式，比如"Fri"

   %A -- 表示星期几的英文全称，比如"Friday"

   %b -- 表示月份的英文缩写形式，比如"Oct"

   %B -- 表示月份的英文全称，"October"

   %c --  标准的日期＋时间格式，如"Fri June 30 18:56:19 2021"

   %d -- 表示日期(1-31)

   %H -- 表示24小时格式的小时(0-23)

   %I -- 表示12小时格式的小时(1-12)

   %p -- 表示现在是上午还是下午，AM or PM

   %j -- 表示一年中的第几天(1-366)

   %m -- 表示月份(1-12)

   %M -- 表示分钟(0-59)

   %S -- 表示当前时刻的多少秒(0-59)，如"32"

   %q -- 表示毫秒(0-999

   %Q -- 表示带小数毫秒(0-999.999)，如 "430.732"

   %U -- 表示是今年的第几周，以周日为第一天开始计算(0-53)

   %W -- 表示是今年的第几周，以周一为第一天开始计算(0-53)

   %w -- 表示星期几，(0-6，星期天为0)

   %x -- 标准的日期格式，如"10/16/04"

   %X -- 标准的时间格式，如"19:02:34"

   %y -- 两位数的年份(0-99)，如"21"表示2021年

   %Y -- 四位数的年份，如"2021"

   %Z -- 时区名，比如"GMT"

4. "%F"，输出当前记录器所在的文件名称，比如"main.cpp"

5. "%L"，输出当前记录器所在的文件行号，比如"51"

6. "%l"，输出当前记录器所在的文件名称和行号，比如"main.cpp:51"

7. "%m"，输出原始信息。

8. "%n"，换行符。

9. "%p"，输出LogLevel，比如"DEBUG"

10. "%t"，输出记录器所在的线程ID，比如 "1075298944"

11. "%x"，嵌套诊断上下文NDC (nested diagnostic context) 输出，从堆栈中弹出上下文信息，NDC可以用对不同源的log信息（同时地）交叉输出进行区分。

12. 格式对齐，比如"%-10m"时表示左对齐，宽度是10，当然其它的控制字符也可以相同的方式来使用，比如"%-12d"，"%-5p"等等。







***

*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*
