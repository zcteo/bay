# PulseAudio 踩坑

之前在 graphical.target 能播放声音的 qt 程序放到 multi-user.target 下自启后无法播放声音



## 记录一下

```bash
# 程序自启前加上这个
/usr/bin/pulseaudio -D --system
# 把需要使用的用户加到 pulse-access
adduser root pulse-access
```

就这两行，但是好记性不如烂笔头
