# 升级高版本 Win10 ANOMALY: use of REX.w is meaningless (default operand size is 64)

问题描述:

在使用IDEA的git的功能的时候,始终提示未安装git.重新安装也是一样

![img](https://www.aix2.com/wp-content/uploads/2021/03/1614682532-c96a9ad0d396a57.jpg)

根据报错提示ANOMALY: use of REX.w is meaningless (default operand size is 64) 搜索得知,是因为某类的安全软件的钩子注入导致的

检测是否被安装监控的方法(直接cmd运行)

> netstat -ano |findstr 8237

因为监控软件不能卸载,如果想卸载的话 [传送门](https://blog.davidz.cn/inspur-ip-guard-uninstallation/)

尝试的解决方案

1:针对所有程序

注册表中增加项

计算机\HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config 下 新建 [字符串值] hookapi_disins,数值数据: 1

 

2:针对特定程序

注册表中增加项

计算机\HKEY_LOCAL_MACHINE\SOFTWARE\TEC\Ocular.3\agent\config 下 新建 [字符串值] hookapi_filterproc_external,数值数据: cmd.exe;powershell.exe;git.exe;idea64.exe

![img](https://www.aix2.com/wp-content/uploads/2021/03/1614682515-06c6bec53a40304.jpg)

 

 

 

解决

![img](https://www.aix2.com/wp-content/uploads/2021/03/1614738741-d20d55ed6dcc910.jpg)



 **要将相关注册表项设置为只读，不然重启后会恢复**



 转载于<https://www.aix2.com/605.html>

 

