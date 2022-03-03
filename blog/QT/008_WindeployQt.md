# windeployqt 打包程序

## 打包程序

注意编译工具要使用对应的发布工具

`%QT_DIR%` 和 `%QT_VERSION%` 替换为自己的实际路径即可

在自己的可执行文件 `xxx.exe` 路径下打开命令行

执行完之后就会发现多了很多东西，可以愉快的打包了



## MSVC

这个其实没什么说的

```bash
%QT_DIR%\%QT_VERSION%\msvc2017_64\bin\windeployqt.exe xxx.exe
```



## MinGW

需要将 MinGW bin 目录添加到环境变量，不然打包会出问题

```bash
%QT_DIR%\%QT_VERSION%\mingw73_64\bin\windeployqt.exe xxx.exe
```

如果 Release 程序被识别成 Debug，就

```bash
%QT_DIR%\%QT_VERSION%\mingw73_64\bin\windeployqt.exe xxx.exe --release
```



