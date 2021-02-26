# Docker & docker-compose

[TOC]

## Docker

### 国内镜像加速配置

[DaoCloud](https://www.daocloud.io/mirror)

### 基本命令

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
```

### 网络相关

```bash
# 默认为bridge模式
sudo docker network create
sudo docker network connect
sudo docker network disconnect
sudo docker network ls
sudo docker network rm
sudo docker network inspect
```

### Docker部署常用应用命令

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

### Docker打包镜像

```bash
# 打包
sudo docker save -o filename imagename
# 导入
sudo docker load < filename
```



### Dockerfile

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

## docker-compose

###  安装

可以在[Github](https://github.com/docker/compose/releases)查看版本以及安装命令

```bash
# 安装
sudo curl -L https://github.com/docker/compose/releases/download/1.23.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# 赋权
sudo chmod +x /usr/local/bin/docker-compose
```

### docker-compose.yml

```yaml
version: '3.7'
services:
    zookeeper:
        image: zookeeper
        container_name: zookeeper
        ports: 
            - 2181:2181
            - 2888:2888
            - 3888:3888
        networks: 
            - mynet
    dubbo-admin:
        image: riveryang/dubbo-admin
        container_name: dubbo-admin
        environment:
            - DUBBO_REGISTRY=zookeeper:\/\/zookeeper:2181
            - DUBBO_ROOT_PASSWORD=root
        ports:
            - 9600:8080
        networks:
            - mynet
        depends_on:
            - zookeeper
    mysql:
        image: mysql:5.7
        container_name: mysql
        environment:
            - MYSQL_ROOT_PASSWORD=123
        ports: 
            - 3306:3306
        networks: 
            - mynet
    core: 
        build: ./core         #Dockerfile所在目录，相对或绝对路径都可以
        image: core:latest    #构建的镜像名字
        container_name: core
        networks: 
            - mynet
        depends_on:           #依赖容器会先启动
            - zookeeper
            - mysql
    store: 
        build: ./store
        image: store:latest
        container_name: store
        ports: 
            - 80:80
            - 443:443
        networks: 
            - mynet
        depends_on:
            - core
networks: 
    mynet:
        driver: bridge
```

### 启动

```bash
# 命令行需要在docker-compose.yml目录
sudo docker-compose up --build -d
     #-d       后台运行
     #--build  不管镜像是否存在都要重新构建
```

### docker-compose file version和docker version关系

| Compose file format | Docker Engine release |
| :-----------------: | :-------------------: |
|         3.7         |       18.06.0+        |
|         3.6         |       18.02.0+        |
|         3.5         |       17.12.0+        |
|         3.4         |       17.09.0+        |
|         3.3         |       17.06.0+        |
|         3.2         |       17.04.0+        |
|         3.1         |        1.13.1+        |
|         3.0         |        1.13.0+        |
|         2.4         |       17.12.0+        |
|         2.3         |       17.06.0+        |
|         2.2         |        1.13.0+        |
|         2.1         |        1.12.0+        |
|         2.0         |        1.10.0+        |
|         1.0         |        1.9.1.+        |



