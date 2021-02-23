## Linux常用命令
```bash
#端口映射(80-->8080)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

#禁止服务自启
sudo update-rc.d xxxxxx disable

#自动DHCP获取IP
sudo dhclient

#开机自动获取
sudo vim /etc/network/interfaces
auto ens33
iface ens33 inet dhcp  
```



#### 更改apt为阿里源

##### ubuntu 18.04

```bash
#备份
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
#编辑/etc/apt/sources.list
sudo vim /etc/apt/sources.list
#/etc/apt/sources.list内容：
#阿里源，src默认注释掉
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
#deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
#deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
#deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
#deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
#deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

#### apt相关

```bash
sudo apt update
sudo apt upgrade
sudo apt install packagename
sudo apt remove packagename
sudo apt purge packagename #卸载同时清空相关配置文件以及数据
sudo apt autoremove #卸载当前系统中的所有孤立的包
sudo apt autoclean  #已经卸载了的软件包的.deb安装文件从硬盘中删除
sudo apt clean #所有软件包的.deb安装文件从硬盘中删除
```

#### chmod赋权

``` bash
sudo chmod -R abc /.../.../
#其中a,b,c各为一个数字，分别表示User、Group、及Other的权限。 
#r=4，w=2，x=1 
#-R:对目录下的所有档案与子目录进行相同的权限变更(即以递回的方式逐个变更) 
sudo chmod +x /.../.../
# +表示增加权限、-表示取消权限、=表示唯一设定权限。 
# r表示可读取，w表示可写入，x表示可执行
```



