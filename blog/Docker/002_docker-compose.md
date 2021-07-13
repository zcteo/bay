# docker-compose 安装与使用

[TOC]

##  安装

可以在 [Github](https://github.com/docker/compose/releases) 查看版本以及安装命令

```bash
# 安装
sudo curl -L https://github.com/docker/compose/releases/download/1.23.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# 赋权
sudo chmod +x /usr/local/bin/docker-compose
```

现在就用 docker-compose 来编排之前文章[《Docker 安装与使用》](001_Docker.md)提到的哪些容器



## docker-compose.yml

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



## 启动

```bash
# 命令行需要在docker-compose.yml目录
sudo docker-compose up --build -d
     #-d       后台运行
     #--build  不管镜像是否存在都要重新构建
```



## docker-compose file version和docker version关系

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






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

