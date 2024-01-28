# 获取电信光猫超级密码

特别说明，我的光猫型号是 PT926E，方法都是亲测有效



## Telnet

### 打开 telnet 登录功能

访问以下网址，页面出现 success 表示成功

<http://192.168.1.1:8080/cgi-bin/abcdidfope94e0934jiewru8ew414.cgi>

### Telnet 登录光猫后台

输入以下命令，注意输入密码的时候控制台不会显示，且

```bash
telnet 192.168.1.1
Login:admin
Password:       # 密码 TeleCom_1234或普通用户登录密码
su
Password:       # 密码 TeleCom_XXXXXX，6个X为你的Mac地址最后6位，字母要小写
cd /var/config
cat lastgood.xml
```

在文本中查找 SUSER_PASSWORD 就会看到超级密码

如果无法登录或者 su 密码不正确，请看下一章

## U 盘

顾名思义，需要一个 U 盘 

先正常登录光猫后台，打开以下网址

<http://192.168.1.1/cgi-bin/luci/admin/storage/settings>

F12 打开浏览器调试界面，切换到Console选项卡，输入

`get_path_files("/mnt/usb1_2/../..")`

切换到根目录，将 `/var/config/lastgood.xm` 复制到 U 盘

然后就可以愉快的找超级密码了
