## MySQL安装

### Windows

```bash
#解压，添加bin目录到path

#根目录新建my.ini

#管理员CMD到bin目录

#初始化
mysqld –-initialize

#安装
mysqld install

#启动
net start mysql

#登录，密码在data目录*.err文件里面
mysql -uroot -p

#修改密码
set password for root@localhost = password('123');
```
my.ini

```ini
[client]

default-character-set = utf8
port = 3306

[mysql]

default-character-set = utf8

[mysqld]

port = 3306

basedir = D:/App/MySQL Server 5.7/

datadir = D:/App/MySQL Server 5.7/Data

character-set-server = utf8

default-storage-engine = INNODB

sql-mode = "STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"

max_connections = 151

```

### Linux

```bash
#安装
sudo apt install mysql-server
#卸载
sudo apt purge mysql-*
#登录，用户名密码在/etc/mysql/debian.cnf
mysql -u  -p
#修改root密码
use mysql;
update user set authentication_string=PASSWORD("123") where user='root';
update user set plugin="mysql_native_password";
flush privileges;
```

/etc/mysql/my.cnf

```ini
[client]

default-character-set=utf8

[mysql]

default-character-set=utf8

[mysqld]

character-set-server=utf8
```

