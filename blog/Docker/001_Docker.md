# Docker 安装与使用

[TOC]

## 国内镜像加速配置

1. [DaoCloud](https://www.daocloud.io/mirror)

   *目前好像不太行了 - 2020年8月2日*

2. 创建或修改 /etc/docker/daemon.json 文件

   ```json
   {
       "registry-mirrors": ["https://registry.docker-cn.com"]
   }
   ```

   > 可直接使用的镜像链接：
   >
   > docker中国：https://registry.docker-cn.com
   >
   > 网易：http://hub-mirror.c.163.com
   >
   > 中科大：https://docker.mirrors.ustc.edu.cn
   >
   > ----
   >
   > 阿里云容器服务
   > <https://cr.console.aliyun.com/>
   > 首页点击”创建我的容器镜像“，得到一个专属的镜像加速地址



## 基本命令

```bash
# 安装
sudo apt install docker.io
sudo docker images    #列出所有的本地镜像
sudo docker ps -a     #列出所有的本地容器
sudo docker run       #运行容器
    # -it 互动模式
    # -d 离线模式
    # --name  指定名称
    # --net  netname 指定net
    # --restart=always  服务器重启跟随启动
    # -e  ename 指定环境变量
    # -p  指定端口映射
    # -P  随机端口映射
sudo docker start   #启动已经存在的容器
sudo docker stop     #停止指定的容器
sudo docker pull     #拉取镜像
sudo docker rmi      #删除镜像
sudo docker image prune -af #删除所有未使用镜像
sudo docker rm       #删除容器 参数为容器名字或容器ID
    # $(sudo docker ps -aq) 删除所有容器
sudo docker search   #查找镜像
sudo docker exec -it #以互动模式进入容器
sudo docker logs -f  #查看指定容器的日志
sudo docker build -t name:latest . #在当前目录根据Dockerfile创建名为name的镜像
sudo docker container update --restart always #更改restart策略
```



## 网络相关

```bash
# 默认为bridge模式
sudo docker network create
sudo docker network connect
sudo docker network disconnect
sudo docker network ls
sudo docker network rm
sudo docker network inspect
```



## Docker save/export

docker save 用来将一个或多个image打包保存。

docker save 也可以打包container，保存的是容器背后的image.

如：将本地镜像库中的image1和image2打包到images.tar中

```bash
docker save -o images.tar  image1:v1 image2:v1
# 保存的时候压缩
docker save image1:v1 image2:v1 | gzip > images.tar.gz
```

docker load用于将打包的tar中包含的镜像load到本地镜像库，但不能重命名其中的镜像名。

```bash
docker load -i images.tar
# load压缩镜像
gzip -c images.tar.gz | docker load 
```

docker export 打包 container 文件系统

```bash
docker export -o thecontainer.tar container_name
```

使用 docker import 载入，可以为新镜像指定name和tag

```bash
docker import thecontainer.tar newimagename:tag
```



## Docker部署常用应用命令

```bash
# 新建net
sudo docker network create mynet
# 部署MySQL
# 创建MySQL容器
sudo docker run --name mysql --net mynet -e MYSQL_ROOT_PASSWORD=123 -p 3307:3306 -d mysql:5.7
# 进入MySQL容器
sudo docker exec -it mysql bash
# 赋权
grant all on *.* to 'root'@'%' identified by '123';
# 刷新权限
flush privileges;
# 部署zookeeper
sudo docker run -d --name zookeeper --net mynet -p2181:2181 -p2888:2888 -p3888:3888 zookeeper
# 部署dubboadmin
# 一定注意加反斜杠
sudo docker run -d --name dubbo-admin --net mynet -p9600:8080 -e DUBBO_REGISTRY="zookeeper:\/\/zookeeper:2181" -e DUBBO_ROOT_PASSWORD=root riveryang/dubbo-admin
# 部署sbjar
sudo docker run -d --name core -p8081:8081 --net mynet core
sudo docker run -d --name store -p8080:8080 --net mynet store
```



## Dockerfile

``` dockerfile
# 基础镜像
FROM openjdk:8-jdk-alpine

# 设置工作目录
WORKDIR /tmp

# 将当前目录jar文件拷贝到镜像中名为app.jar
ADD *.jar app.jar

# springboot使用的配置文件
ENV spring.profiles.active=docker

# 进入时执行的命令，jvm设置为东八区
ENTRYPOINT ["java","-Duser.timezone=GMT+8","-jar","/tmp/app.jar"]
```
