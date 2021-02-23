# Shadowsocks

### 官网

[Shadowsocks](https://shadowsocks.org/)

/*需要科学上网才可访问*  

### 安装

```bash
# libev版，C语言编写
sudo apt install shadowsocks-libev

# Python版，需要Python2.6或者2.7以及pip
sudo apt install python-pip
# pip直接安装的是2.*，不支持aes-256-gcm
# sudo pip install shadowsocks
# 使用git源安装最新版
sudo pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```

## 配置

/etc/shadowsocks-libev/config.json

```json
// 单用户
{
    "server": "0.0.0.0",
    "server_port": 8888,
    "local_port": 1080,
    "password": "Eric_1996",
    "timeout": 300,
    "method": "aes-256-gcm"
}
// 多用户，按需配置,libev版不支持
{
    "server": "0.0.0.0",
    "local_port": 1080,
    "port_password": {
        "8888": "Eric_1996",
        "8889": "Eric-1996"
    },
    "timeout": 300,
    "method": "aes-256-gcm"
}
```

### 启动

#### Python版

```bash
# 可以查看帮助
ssserver -h
# 指定配置文件启动
sudo ssserver -c ./ssconfig.json -d start
```

#### libev版

##### 单用户

```bash
sudo service start shadowsocks-libev
```

##### 多用户

利用多进程实现，比较占资源

```bash
sudo service start shadowsocks-libev
# 查看启动命令
sudo ps aux | grep shadowsocks
# 命令，修改相应的配置文件，一个用户对应一个配置文件
sudo nohup /usr/bin/ss-server -c /etc/shadowsocks-libev/con.json -u &
```

##### Docker

```bash
sudo docker run --name ss -e PASSWORD=password -e METHOD=aes-256-gcm -p8388:8388 -p8388:8388/udp -d shadowsocks/shadowsocks-libev
```

