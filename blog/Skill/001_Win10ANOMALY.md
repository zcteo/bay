# 升级高版本 Win10 ANOMALY: use of REX.w is meaningless (default operand size is 64)

## 问题描述

在使用IDEA的git的功能的时候，始终提示未安装 git，重新安装也是一样

根据报错提示ANOMALY: use of REX.w is meaningless (default operand size is 64) 搜索得知，是因为某类的安全软件的钩子注入导致的

检测是否被安装监控的方法

> netstat -ano |findstr 8237

因为监控软件不能卸载，如果想卸载的话 [传送门](https://blog.davidz.cn/inspur-ip-guard-uninstallation/)



## 解决方案

### 针对所有程序

注册表中增加项

计算机\HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config 下 新建 [字符串值] hookapi_disins,数值数据: 1

 

### 针对特定程序

注册表中增加项

计算机\HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config 下 新建 [字符串值] hookapi_filterproc_external,数值数据: cmd.exe;powershell.exe;git.exe;idea64.exe



## 注意事项

 **要将相关注册表项设置为只读，不然重启后会恢复**



## 批处理命令

由于每次系统更新都要出现这个问题，我就写成一个批处理，这里是针对所有程序

```bash
@REM 获取管理员权限
@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )
 
:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs" 
    "%temp%\getadmin.vbs"
    exit /B
 
:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
@echo on


@echo off
set inifile=%temp%\regini.ini
@REM 获取注册表权限
echo HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config [1 7 17] > %inifile%
regini %inifile%
@REM 增加注册表项
@reg add "HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config" /v "hookapi_disins" /d "1" /f

@REM 改为只读
echo HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config [2 8 19] > %inifile%
regini %inifile%
@del /q /f %inifile%

@REM 1 - Administrators Full Access
@REM 2 - Administrators Read Access
@REM 3 - Administrators Read and Write Access
@REM 4 - Administrators Read, Write and Delete Access
@REM 5 - Creator Full Access
@REM 6 - Creator Read and Write Access
@REM 7 - World Full Access
@REM 8 - World Read Access
@REM 9 - World Read and Write Access
@REM 10 - World Read, Write and Delete Access
@REM 11 - Power Users Full Access
@REM 12 - Power Users Read and Write Access
@REM 13 - Power Users Read, Write and Delete Access
@REM 14 - System Operators Full Access
@REM 15 - System Operators Read and Write Access
@REM 16 - System Operators Read, Write and Delete Access
@REM 17 - System Full Access
@REM 18 - System Read and Write Access
@REM 19 - System Read Access
@REM 20 - Administrators Read, Write and Execute Access
@REM 21 - Interactive User Full Access
@REM 22 - Interactive User Read and Write Access
@REM 23 - Interactive User Read, Write and Delete Access
```



## 参考文章

<https://www.aix2.com/605.html>
