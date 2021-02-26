## 安卓 NDK native 方法 crash 定位分析

### addr2line工具

在 ndk/toolchains/aarch64-linux-android-4.9/prebuilt/windows-x86_64/bin 目录下

#### 用法

```bash
addr2line [OPTIONS] addr [addr ...]
```

#### OPTIONS

```bash
-a --addresses：在函数名、文件和行号信息之前，显示地址，以十六进制形式
-b --target=<bfdname>：指定目标文件的格式为 bfdname
-e --exe=<executable>：指定需要转换地址的可执行文件名
-i --inlines ： 如果需要转换的地址是一个内联函数，则输出的信息包括其最近范围内的一个非内联函数的信息
-j --section=<name>：给出的地址代表指定 section 的偏移，而非绝对地址
-p --pretty-print：使得该函数的输出信息更加人性化：每一个地址的信息占一行
-s --basenames：仅仅显示每个文件名的基址（即不显示文件的具体路径，只显示文件名）
-f --functions：在显示文件名、行号输出信息的同时显示函数名信息
-C --demangle[=style]：将低级别的符号名解码为用户级别的名字
-h --help：输出帮助信息
-v --version：输出版本号
```



### 定位 crash 代码行号

#### Jni crash log 分析

Jni crash 会在 DEBUG Tag 输出信息

```bash
09-08 14:35:53.853 F/DEBUG   ( 6893): Build fingerprint: 'Android/sdk_google_phone_arm64/generic_arm64:7.1.1/NYC/4252396:userdebug/test-keys'
09-08 14:35:53.853 F/DEBUG   ( 6893): Revision: '0'
09-08 14:35:53.853 F/DEBUG   ( 6893): ABI: 'arm64'
09-08 14:35:53.854 F/DEBUG   ( 6893): pid: 6867, tid: 6867, name: hxiong.neondemo  >>> com.hxiong.neondemo <<<
09-08 14:35:53.854 F/DEBUG   ( 6893): signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x0
09-08 14:35:53.855 F/DEBUG   ( 6893):     x0   0000000000000003  x1   0000000000000000  x2   0000000000000004  x3   0000007ffb9e6980
09-08 14:35:53.855 F/DEBUG   ( 6893):     x4   0000007329c01ad3  x5   0000007ffb9e7360  x6   0000007337196000  x7   fffffffffffffffd
09-08 14:35:53.855 F/DEBUG   ( 6893):     x8   0000000000000003  x9   0000007335738c79  x10  0000000000000058  x11  0101010101010101
09-08 14:35:53.855 F/DEBUG   ( 6893):     x12  000000000ccccccc  x13  000000008000002f  x14  00000073357429e8  x15  000000733574268c
09-08 14:35:53.855 F/DEBUG   ( 6893):     x16  000000733575e2c0  x17  00000073356b8368  x18  00000000ffffffff  x19  ffffffffffffffff
09-08 14:35:53.855 F/DEBUG   ( 6893):     x20  000000000000000e  x21  00000000ffffffff  x22  0000007ffb9e6b60  x23  0000000000000001
09-08 14:35:53.855 F/DEBUG   ( 6893):     x24  0000007329c01ae3  x25  0000000000000003  x26  0000000000000073  x27  0000007ffb9e70b0
09-08 14:35:53.856 F/DEBUG   ( 6893):     x28  6cd7b2dd5dd0d059  x29  0000007ffb9e67a0  x30  0000007335710f64
09-08 14:35:53.856 F/DEBUG   ( 6893):     sp   0000007ffb9e6790  pc   00000073356b83c8  pstate 0000000080000000
09-08 14:35:54.233 F/DEBUG   ( 6893): 
09-08 14:35:54.233 F/DEBUG   ( 6893): backtrace:
09-08 14:35:54.234 F/DEBUG   ( 6893):     #00 pc 000000000001b3c8  /system/lib64/libc.so (strlen+96)
09-08 14:35:54.234 F/DEBUG   ( 6893):     #01 pc 0000000000073f60  /system/lib64/libc.so (__strlen_chk+16)
09-08 14:35:54.234 F/DEBUG   ( 6893):     #02 pc 000000000005ba18  /system/lib64/libc.so (__vfprintf+6356)
09-08 14:35:54.234 F/DEBUG   ( 6893):     #03 pc 0000000000064be4  /system/lib64/libc.so (vsnprintf+228)
09-08 14:35:54.235 F/DEBUG   ( 6893):     #04 pc 00000000000741a0  /system/lib64/libc.so (__vsnprintf_chk+64)
09-08 14:35:54.235 F/DEBUG   ( 6893):     #05 pc 00000000000057c8  /system/lib64/liblog.so (__android_log_print+148)
09-08 14:35:54.235 F/DEBUG   ( 6893):     #06 pc 00000000000009a4  /data/app/com.hxiong.neondemo-1/lib/arm64/libneondemo.so
```

第 5 行 fault addr 0x0 可以看出是空指针异常，寄存器 X1 的值为 0 也可以进一步确认是空指针

第 17-23 行是引起 crash 的调用堆栈，“+” 后面的数字不是行号，是偏移量

第 23 行表示开始 crash，address 为  00000000000009a4

#### 使用 addr2line 定位行号

```bash
addr2line -e libneondemo.so -f -C  00000000000009a4
```



### 参考文章

1. [ndk addr2line工具的使用](https://www.jianshu.com/p/c2e2b8f8ea0d)

2. [addr2line](https://blog.csdn.net/xiongtiancheng/article/details/77899891)





