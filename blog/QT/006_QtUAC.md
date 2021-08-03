# Windows 下 C++ 程序以管理员运行(UAC)

## MSVC 编译器

**qmake**

在 pro 文件中添加一行指令即可，

```cmake
QMAKE_LFLAGS += /MANIFESTUAC:"level='requireAdministrator'uiAccess='false'"
```

 **cmake**

```cmake
set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS 
        "/MANIFESTUAC:\"level='requireAdministrator' uiAccess='false'\"")
```



## MinGW 编译器

先创建一个 *.manifes 文件，如 app.manifest 文件内容如下：

```xml
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<assembly xmlns='urn:schemas-microsoft-com:asm.v1' manifestVersion='1.0'>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level='requireAdministrator' uiAccess='false' />
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
```

然后在exe所在的目录中执行 mt，mt 在 VS “开发人员命令提示”工具中

```bash
mt.exe -manifest "app.manifest" -outputresource:"app.exe";#1
```

注意：exe 和 manifest 文件要在同一目录中。

