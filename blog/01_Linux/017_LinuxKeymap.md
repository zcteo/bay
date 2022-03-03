# Linux 快捷键与 JetBrains IDE 快捷键冲突解决方案 



## 终极解决方案

如果不是长期习惯 IDE 的快捷键的话，终极解决方案就是修改 IDE 快捷键 



## 正常解决方案 



### 与银河麒麟操作系统冲突 

银河麒麟操作 V10 SP1 系统界面上无法修改系统快捷键，所以只能命令行修改 


查看系统快捷键

```bash
gsettings list-recursively org.ukui.SettingsDaemon.plugins.media-keys
```

修改被占用的快捷键

```bash
gsettings set org.ukui.SettingsDaemon.plugins.media-keys screensaver ""
```

我这里主要是修改 `ctrl + alt +l ` 格式化代码快捷键，发现是被screensaver占用了



### 与搜狗输入法冲突

`ctrl + shift + f` 被搜狗输入法的简繁体切换占用，但是搜狗输入法界面上又没有地方可以修改，只能通过配置文件修改

修改搜狗输入法配置文件 `~/.config/sogoupinyin/conf/env.ini` ，将其中的 `ShortCutFanJian` 值改为 0

