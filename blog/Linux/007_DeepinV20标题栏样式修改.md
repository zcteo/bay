# Deepin V20 标题栏样式修改
@[toc]
## 引言

deepin v20 即 UOS 社区版，使用国内的常用软件很方便，但是一些第三方软件标题栏会显得很突兀；尤其是 JetBrains 全家桶，全部都有大白边。对于我这样的强迫症来说就很难受了，所以要去掉 deepin 标题栏的大白边，deepin v20社区版亲测可用。



## 新建配置文件路径

```bash
mkdir -p ~/.local/share/deepin/themes/deepin/light
mkdir -p ~/.local/share/deepin/themes/deepin/dark
```



## light 主题的配置文件

风格类似 Ubuntu 的标题栏，使用暗色主题的按钮
```bash
vim ~/.local/share/deepin/themes/deepin/light/titlebar.ini
```

```ini
[Active]
height=30
textColor=#DDDDDD
backgroundColor=#303030

menuIcon.normal=:/deepin/themes/deepin/dark/icons/menu_normal.svg
menuIcon.hover=:/deepin/themes/deepin/dark/icons/menu_hover.svg
menuIcon.press=:/deepin/themes/deepin/dark/icons/menu_press.svg
menuIcon.disabled=:/deepin/themes/deepin/dark/icons/menu_disabled.svg

minimizeIcon.normal=:/deepin/themes/deepin/dark/icons/minimize_normal.svg
minimizeIcon.hover=:/deepin/themes/deepin/dark/icons/minimize_hover.svg
minimizeIcon.press=:/deepin/themes/deepin/dark/icons/minimize_press.svg
minimizeIcon.disabled=:/deepin/themes/deepin/dark/icons/minimize_disabled.svg

maximizeIcon.normal=:/deepin/themes/deepin/dark/icons/maximize_normal.svg
maximizeIcon.hover=:/deepin/themes/deepin/dark/icons/maximize_hover.svg
maximizeIcon.press=:/deepin/themes/deepin/dark/icons/maximize_press.svg
maximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/maximize_disabled.svg

unmaximizeIcon.normal=:/deepin/themes/deepin/dark/icons/unmaximize_normal.svg
unmaximizeIcon.hover=:/deepin/themes/deepin/dark/icons/unmaximize_hover.svg
unmaximizeIcon.press=:/deepin/themes/deepin/dark/icons/unmaximize_press.svg
unmaximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/unmaximize_disabled.svg

closeIcon.normal=:/deepin/themes/deepin/dark/icons/close_normal.svg
closeIcon.hover=:/deepin/themes/deepin/dark/icons/close_hover.svg
closeIcon.press=:/deepin/themes/deepin/dark/icons/close_press.svg
closeIcon.disabled=:/deepin/themes/deepin/dark/icons/close_disabled.svg

[Inactive]
height=30
textColor=#8C8C8C
backgroundColor=#303030

menuIcon.normal=:/deepin/themes/deepin/dark/icons/menu_normal.svg
menuIcon.hover=:/deepin/themes/deepin/dark/icons/menu_hover.svg
menuIcon.press=:/deepin/themes/deepin/dark/icons/menu_press.svg
menuIcon.disabled=:/deepin/themes/deepin/dark/icons/menu_disabled.svg

minimizeIcon.normal=:/deepin/themes/deepin/dark/icons/minimize_normal.svg
minimizeIcon.hover=:/deepin/themes/deepin/dark/icons/minimize_hover.svg
minimizeIcon.press=:/deepin/themes/deepin/dark/icons/minimize_press.svg
minimizeIcon.disabled=:/deepin/themes/deepin/dark/icons/minimize_disabled.svg

maximizeIcon.normal=:/deepin/themes/deepin/dark/icons/maximize_normal.svg
maximizeIcon.hover=:/deepin/themes/deepin/dark/icons/maximize_hover.svg
maximizeIcon.press=:/deepin/themes/deepin/dark/icons/maximize_press.svg
maximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/maximize_disabled.svg

unmaximizeIcon.normal=:/deepin/themes/deepin/dark/icons/unmaximize_normal.svg
unmaximizeIcon.hover=:/deepin/themes/deepin/dark/icons/unmaximize_hover.svg
unmaximizeIcon.press=:/deepin/themes/deepin/dark/icons/unmaximize_press.svg
unmaximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/unmaximize_disabled.svg

closeIcon.normal=:/deepin/themes/deepin/dark/icons/close_normal.svg
closeIcon.hover=:/deepin/themes/deepin/dark/icons/close_hover.svg
closeIcon.press=:/deepin/themes/deepin/dark/icons/close_press.svg
closeIcon.disabled=:/deepin/themes/deepin/dark/icons/close_disabled.svg

[NoAlpha/Active]
height=30
textColor=#DDDDDD
backgroundColor=#303030

menuIcon.normal=:/deepin/themes/deepin/dark/icons/menu_normal.svg
menuIcon.hover=:/deepin/themes/deepin/dark/icons/menu_hover.svg
menuIcon.press=:/deepin/themes/deepin/dark/icons/menu_press.svg
menuIcon.disabled=:/deepin/themes/deepin/dark/icons/menu_disabled.svg

minimizeIcon.normal=:/deepin/themes/deepin/dark/icons/minimize_normal.svg
minimizeIcon.hover=:/deepin/themes/deepin/dark/icons/minimize_hover.svg
minimizeIcon.press=:/deepin/themes/deepin/dark/icons/minimize_press.svg
minimizeIcon.disabled=:/deepin/themes/deepin/dark/icons/minimize_disabled.svg

maximizeIcon.normal=:/deepin/themes/deepin/dark/icons/maximize_normal.svg
maximizeIcon.hover=:/deepin/themes/deepin/dark/icons/maximize_hover.svg
maximizeIcon.press=:/deepin/themes/deepin/dark/icons/maximize_press.svg
maximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/maximize_disabled.svg

unmaximizeIcon.normal=:/deepin/themes/deepin/dark/icons/unmaximize_normal.svg
unmaximizeIcon.hover=:/deepin/themes/deepin/dark/icons/unmaximize_hover.svg
unmaximizeIcon.press=:/deepin/themes/deepin/dark/icons/unmaximize_press.svg
unmaximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/unmaximize_disabled.svg

closeIcon.normal=:/deepin/themes/deepin/dark/icons/close_normal.svg
closeIcon.hover=:/deepin/themes/deepin/dark/icons/close_hover.svg
closeIcon.press=:/deepin/themes/deepin/dark/icons/close_press.svg
closeIcon.disabled=:/deepin/themes/deepin/dark/icons/close_disabled.svg

[NoAlpha/Inactive]
height=30
textColor=#8C8C8C
backgroundColor=#303030

menuIcon.normal=:/deepin/themes/deepin/dark/icons/menu_normal.svg
menuIcon.hover=:/deepin/themes/deepin/dark/icons/menu_hover.svg
menuIcon.press=:/deepin/themes/deepin/dark/icons/menu_press.svg
menuIcon.disabled=:/deepin/themes/deepin/dark/icons/menu_disabled.svg

minimizeIcon.normal=:/deepin/themes/deepin/dark/icons/minimize_normal.svg
minimizeIcon.hover=:/deepin/themes/deepin/dark/icons/minimize_hover.svg
minimizeIcon.press=:/deepin/themes/deepin/dark/icons/minimize_press.svg
minimizeIcon.disabled=:/deepin/themes/deepin/dark/icons/minimize_disabled.svg

maximizeIcon.normal=:/deepin/themes/deepin/dark/icons/maximize_normal.svg
maximizeIcon.hover=:/deepin/themes/deepin/dark/icons/maximize_hover.svg
maximizeIcon.press=:/deepin/themes/deepin/dark/icons/maximize_press.svg
maximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/maximize_disabled.svg

unmaximizeIcon.normal=:/deepin/themes/deepin/dark/icons/unmaximize_normal.svg
unmaximizeIcon.hover=:/deepin/themes/deepin/dark/icons/unmaximize_hover.svg
unmaximizeIcon.press=:/deepin/themes/deepin/dark/icons/unmaximize_press.svg
unmaximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/unmaximize_disabled.svg

closeIcon.normal=:/deepin/themes/deepin/dark/icons/close_normal.svg
closeIcon.hover=:/deepin/themes/deepin/dark/icons/close_hover.svg
closeIcon.press=:/deepin/themes/deepin/dark/icons/close_press.svg
closeIcon.disabled=:/deepin/themes/deepin/dark/icons/close_disabled.svg

[Unmanaged]
height=30
textColor=#DDDDDD
backgroundColor=#303030

menuIcon.normal=:/deepin/themes/deepin/dark/icons/menu_normal.svg
menuIcon.hover=:/deepin/themes/deepin/dark/icons/menu_hover.svg
menuIcon.press=:/deepin/themes/deepin/dark/icons/menu_press.svg
menuIcon.disabled=:/deepin/themes/deepin/dark/icons/menu_disabled.svg

minimizeIcon.normal=:/deepin/themes/deepin/dark/icons/minimize_normal.svg
minimizeIcon.hover=:/deepin/themes/deepin/dark/icons/minimize_hover.svg
minimizeIcon.press=:/deepin/themes/deepin/dark/icons/minimize_press.svg
minimizeIcon.disabled=:/deepin/themes/deepin/dark/icons/minimize_disabled.svg

maximizeIcon.normal=:/deepin/themes/deepin/dark/icons/maximize_normal.svg
maximizeIcon.hover=:/deepin/themes/deepin/dark/icons/maximize_hover.svg
maximizeIcon.press=:/deepin/themes/deepin/dark/icons/maximize_press.svg
maximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/maximize_disabled.svg

unmaximizeIcon.normal=:/deepin/themes/deepin/dark/icons/unmaximize_normal.svg
unmaximizeIcon.hover=:/deepin/themes/deepin/dark/icons/unmaximize_hover.svg
unmaximizeIcon.press=:/deepin/themes/deepin/dark/icons/unmaximize_press.svg
unmaximizeIcon.disabled=:/deepin/themes/deepin/dark/icons/unmaximize_disabled.svg

closeIcon.normal=:/deepin/themes/deepin/dark/icons/close_normal.svg
closeIcon.hover=:/deepin/themes/deepin/dark/icons/close_hover.svg
closeIcon.press=:/deepin/themes/deepin/dark/icons/close_press.svg
closeIcon.disabled=:/deepin/themes/deepin/dark/icons/close_disabled.svg

```

## dark 主题的配置文件

```bash
vim ~/.local/share/deepin/themes/deepin/dark/titlebar.ini
```

```ini
[Active]
height=30

[Inactive]
height=30

[NoAlpha/Active]
height=30

[NoAlpha/Inactive]
height=30

[Unmanaged]
height=30

```



## 配置文件依据

1. github [linuxdeepin issue](https://github.com/linuxdeepin/developer-center/issues/1210)
2. github [linuxdeepin ini文件](https://github.com/linuxdeepin/dde-kwin/tree/master/plugins/kdecoration/deepin)
3. github [linuxdeepin 源码](https://github.com/linuxdeepin/dde-kwin/blob/master/plugins/kdecoration/chameleontheme.cpp)