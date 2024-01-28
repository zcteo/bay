# 创建桌面快捷方式

## 快捷方式简介

### 快捷方式常用内容

```ini
[Desktop Entry]
Version=1.0                 # 版本号
Encoding=UTF-8              # 编码格式
Type=                       # 快捷方式对应目标的类型 Application Link Directory
Name=                       # 快捷方式的名称
Icon=                       # 快捷方式图标的绝对路径
Exec=                       # 快捷方式对应的目标程序的绝对路径
Comment=                    # 目标程序的简短说明
Categories=                 # 目标程序的分类信息，多个类别之间以分号(;)进行分隔
MimeType=                   # 关联的MIME类型，多个类型之间以分号(;)进行分隔
Terminal= [true|false]      # 设置软件启动是否打开终端
StartupNotify= [true|false] # 设置软件启动是否通知
StartupWMClass=             # 窗口与应用程序的关联属性
```



### 快捷方式必须内容

```ini
[Desktop Entry]
Type=                       # 快捷方式对应目标的类型
Name=                       # 快捷方式的名称
Icon=                       # 快捷方式图标的绝对路径
Exec=                       # 快捷方式对应的目标程序的绝对路径
```

有以上内容一般就够了，但是有些程序还需要 `StartupWMClass`, 而且没有 `StartupWMClass` 的情况下，右键状态栏图标基本没有任何菜单



## 快捷方式路径

系统快捷方式(为所有用户创建)，需要 sudo 权限 `/usr/share/applications`

用户快捷方式(为当前用户创建)，`~/.local/share/applications`



## 获取程序的 StartupWMClass

1. 启动目标程序
2. 在终端输入 `xprop WM_CLASS`, 然后单击目标程序的窗口。

输出如下

```bash
WM_CLASS(STRING) = "jetbrains-clion", "jetbrains-clion"
```



## CLion 示例

```ini
[Desktop Entry]
Name=CLion
Exec=/data/app/clion/bin/clion.sh %f
Icon=/data/app/clion/bin/clion.svg
Type=Application
StartupWMClass=jetbrains-clion
```



## 相关文档

Desktop Entry 的 key 定义 <https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html>

Categories 定义 <https://specifications.freedesktop.org/menu-spec/latest/apa.html>
