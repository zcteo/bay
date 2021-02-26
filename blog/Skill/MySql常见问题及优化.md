# MySQL常见问题及优化

---

[TOC]

---

## MySQL解压版安装

### Windows

```bash
# 解压，添加bin目录到path

# 根目录新建my.ini，内容见下文

# 管理员CMD到bin目录

# 初始化
mysqld --initialize

# 安装
mysqld install

# 启动
net start mysql

# 登录，密码在data目录*.err文件里面
mysql -uroot -p

# 修改密码
set password for root@localhost = password('123');

# 卸载方法
net stop mysql
sc delete mysql
# 手动删除文件夹
```
my.ini

```ini
[client]

# 客户端编码
default-character-set = utf8

# 端口
port = 3306

[mysql]

# 数据传输编码
default-character-set = utf8

[mysqld]

port = 3306

# 安装目录，根据自己实际情况指定
basedir = D:/App/mysql Server 5.7/

# 数据目录，mysql所有数据文件保存目录
datadir = D:/App/mysql Server 5.7/Data

# 服务端编码
character-set-server = utf8

# 默认存储引擎
default-storage-engine = INNODB

# 严格模式，遵循SQL语言标准
sql-mode = "STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"

# 最大连接数
max_connections = 151

```

### Linux

```bash
#安装
sudo apt install mysql-server

#登录，5.7用户名密码在/etc/mysql/debian.cnf
mysql -uroot  -p

#修改root密码
use mysql;
update user set authentication_string=PASSWORD("123") where user='root';
update user set plugin="mysql_native_password";
flush privileges;

#卸载
sudo apt purge mysql-*
```

/etc/mysql/my.cnf

```ini
# 修改默认编码，防止中文乱码
[client]

default-character-set=utf8

[mysql]

default-character-set=utf8

[mysqld]

character-set-server=utf8
```

---

## 常见问题

#### 1：char、varchar的区别是什么？

varchar是变长而char的长度是固定的。如果你的内容是固定大小的，你会得到更好的性能。

#### 2:  TRUNCATE和DELETE的区别是什么？

DELETE命令从一个表中删除某一行，或多行，TRUNCATE命令永久地从表中删除每一行。

#### 3：什么是触发器，mysql中都有哪些触发器？

触发器是指一段代码，当触发某个事件时，自动执行这些代码。在mysql数据库中有如下六种触发器：

1、Before Insert

2、After Insert

3、Before Update

4、After Update

5、Before Delete

6、After Delete

#### 4：FLOAT和DOUBLE的区别是什么？

FLOAT类型数据可以存储至多8位十进制数，并在内存中占4字节。

DOUBLE类型数据可以存储至多18位十进制数，并在内存中占8字节。

#### 5：下面mysql数据类型表达的意义（int(0)、char(16)、varchar(16)、datetime、text）

int(0)表示数据是INT类型，长度是0

char(16)表示固定长度字符串，长度为16

varchar(16)表示可变长度字符串，长度为16

datetime表示时间类型

text表示字符串类型，能存储大字符串，最多存储65535字节数据

#### 6：MySQL常用表引擎

InnoDB、MyISAM、Memory

#### 7：InnoDB和MyISAM的区别

1、InnoDB支持事务，MyISAM不支持；

2、InnoDB数据存储在共享表空间，MyISAM数据存储在文件中；

3、InnoDB支持行级锁，MyISAM只支持表锁；

4、InnoDB支持崩溃后的恢复，MyISAM不支持；

5、InnoDB支持外键，MyISAM不支持；

6、InnoDB不支持全文索引，MyISAM支持全文索引；

#### 8：Innodb引擎的特性

1、插入缓冲（insert buffer)

2、二次写(double write)

3、自适应哈希索引(ahi)

4、预读(read ahead)

#### 9：varchar和text的区别

1、varchar可指定字符数，text不能指定，内部存储varchar是存入的实际字符数+1个字节（n<=255）或2个字节(n>255)，text是实际字符数+2个字节。

2、text类型不能有默认值。

3、varchar可直接创建索引，text创建索引要指定前多少个字符。varchar查询速度快于text，在都创建索引的情况下，text的索引几乎不起作用。

4、查询text需要创建临时表。

#### 10：varchar(50)中50的含义

最多存放50个字符，varchar(50)和(200)存储hello所占空间一样，但后者在排序时会消耗更多内存，因为order by col采用fixed_length计算col长度(memory引擎也一样)。

#### 11：int(20)中20的含义

是指显示字符的长度，不影响内部存储，只是当定义了ZEROFILL时，前面补多少个 0

#### 12：MySQL中索引、主键、唯一索引、联合索引的区别，对数据库的性能有什么影响？

一个表只能有一个主键索引，但是可以有多个唯一索引。

1、主键索引一定是唯一索引，唯一索引不是主键索引。

2、主键可以与外键构成参照完整性约束，防止数据不一致。

3、联合索引：将多个列组合在一起创建索引，可以覆盖多个列。（也叫复合索引，组合索引）

4、外键索引：只有InnoDB类型的表才可以使用外键索引，保证数据的一致性、完整性、和实现级联操作（基本不用）。

5、全文索引：mysql自带的全文索引只能用于MyISAM，并且只能对英文进行全文检索 （基本不用）

#### 13：创建MySQL联合索引应该注意什么？

需遵循前缀原则

#### 14：列值为NULL时，查询是否会用到索引？

在mysql里NULL值的列也是走索引的。当然，如果计划对列进行索引，就要尽量避免把它设置为可空，mysql难以优化引用了可空列的查询，它会使索引、索引统计和值更加复杂。

#### 15：以下语句是否会应用索引：SELECT FROM users WHERE YEAR(adddate) < 2019;*

不会，因为只要列涉及到运算，mysql就不会使用索引。

#### 16：MyISAM索引实现？

MyISAM存储引擎使用B+Tree作为索引结构，叶节点的data域存放的是数据记录的地址。MyISAM的索引方式也叫做非聚簇索引的，之所以这么称呼是为了与InnoDB的聚簇索引区分。

#### 17：MyISAM索引与InnoDB索引的区别？

1、InnoDB索引是聚簇索引，MyISAM索引是非聚簇索引。

2、InnoDB的主键索引的叶子节点存储着行数据，因此主键索引非常高效。

3、MyISAM索引的叶子节点存储的是行数据地址，需要再寻址一次才能得到数据。

4、InnoDB非主键索引的叶子节点存储的是主键和其他带索引的列数据，因此查询时做到覆盖索引会非常高效。

#### 18：MySQL的常用关联查询语句有哪些？

1、交叉连接（CROSS JOIN）

2、内连接（INNER JOIN）

3、外连接（LEFT JOIN/RIGHT JOIN）

4、联合查询（UNION与UNION ALL）

5、全连接（FULL JOIN）

6、交叉连接（CROSS JOIN）

##### 内连接（INNER JOIN）

1、等值连接：ON A.id=B.id

2、不等值连接：ON A.id > B.id

3、自连接：SELECT * FROM A T1 INNER JOIN A T2 ON T1.id=T2.pid

##### 外连接（LEFT JOIN/RIGHT JOIN）

1、左外连接：LEFT OUTER JOIN， 以左表为主，先查询出左表，按照ON后的关联条件匹配右表，没有匹配到的用NULL填充，可以简写成LEFT JOIN

2、右外连接：RIGHT OUTER JOIN， 以右表为主，先查询出右表，按照ON后的关联条件匹配左表，没有匹配到的用NULL填充，可以简写成RIGHT JOIN

##### 联合查询（UNION与UNION ALL）

1、就是把多个结果集集中在一起，UNION前的结果为基准，需要注意的是联合查询的列数要相等，相同的记录行会合并

2、如果使用UNION ALL，不会合并重复的记录行

3、效率 UNION 高于 UNION ALL

##### 全连接（FULL JOIN）

1、mysql不支持全连接

2、可以使用LEFT JOIN 和UNION和RIGHT JOIN联合使用

##### 嵌套查询

用一条SQL语句得结果作为另外一条SQL语句得条件，效率不好把握

#### 19：UNION与UNION ALL的区别？

1、如果使用UNION ALL，不会合并重复的记录行

2、效率 UNION 高于 UNION ALL

#### 20：如何查找查询速度慢的原因

记录慢查询日志，分析查询日志，不要直接打开慢查询日志进行分析，这样比较浪费时间和精力，可以使用pt-query-digest工具进行分析

使用show profile

使用show status

show status会返回一些计数器，show global status会查看所有服务器级别的所有计数

有时根据这些计数，可以推测出哪些操作代价较高或者消耗时间多

show processlist

观察是否有大量线程处于不正常的状态或特征

最常问的mysql面试题五——每个开发人员都应该知道

使用explain

分析单条SQL语句

---

## MySQL优化

### SQL语句优化的一些方法

1、对查询进行优化，应尽量避免全表扫描，首先应考虑在 where 及 order by 涉及的列上建立索引。

2、应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：

3、应尽量避免在 where 子句中使用!=或<>操作符，否则引擎将放弃使用索引而进行全表扫描。

4、应尽量避免在 where 子句中使用or 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描，如：

5、in 和 not in 也要慎用，否则会导致全表扫描，如：

6、下面的查询也将导致全表扫描：select id from t where name like ‘%李%’若要提高效率，可以考虑全文检索。

7、 如果在 where 子句中使用参数，也会导致全表扫描。因为SQL只有在运行时才会解析局部变量，但优化程序不能将访问计划的选择推迟到运行时；它必须在编译时进行选择。然 而，如果在编译时建立访问计划，变量的值还是未知的，因而无法作为索引选择的输入项。如下面语句将进行全表扫描：

8、应尽量避免在 where 子句中对字段进行表达式操作，这将导致引擎放弃使用索引而进行全表扫描。如：

9、应尽量避免在where子句中对字段进行函数操作，这将导致引擎放弃使用索引而进行全表扫描。如：

10、不要在 where 子句中的“=”左边进行函数、算术运算或其他表达式运算，否则系统将可能无法正确使用索引。

### 查询优化的一些方法

#### 优化查询过程中的数据访问

1、访问数据太多导致查询性能下降

2、确定应用程序是否在检索大量超过需要的数据，可能是太多行或列

3、确认mysql服务器是否在分析大量不必要的数据行

4、避免犯如下SQL语句错误

5、查询不需要的数据。解决办法：使用limit解决

6、多表关联返回全部列。解决办法：指定列名

7、总是返回全部列。解决办法：避免使用SELECT *

8、重复查询相同的数据。解决办法：可以缓存数据，下次直接读取缓存

9、是否在扫描额外的记录。解决办法：

10、使用explain进行分析，如果发现查询需要扫描大量的数据，但只返回少数的行，可以通过如下技巧去优化：

11、使用索引覆盖扫描，把所有的列都放到索引中，这样存储引擎不需要回表获取对应行就可以返回结果。

12、改变数据库和表的结构，修改数据表范式

13、重写SQL语句，让优化器可以以更优的方式执行查询。

#### 优化长难的查询语句

1、一个复杂查询还是多个简单查询

2、mysql内部每秒能扫描内存中上百万行数据，相比之下，响应数据给客户端就要慢得多

3、使用尽可能小的查询是好的，但是有时将一个大的查询分解为多个小的查询是很有必要的。

4、切分查询

5、将一个大的查询分为多个小的相同的查询

6、一次性删除1000万的数据要比一次删除1万，暂停一会的方案更加损耗服务器开销。

7、分解关联查询，让缓存的效率更高。

8、执行单个查询可以减少锁的竞争。

9、在应用层做关联更容易对数据库进行拆分。

10、查询效率会有大幅提升。

11、较少冗余记录的查询。

#### 优化特定类型的查询语句

1、count(*)会忽略所有的列，直接统计所有列数，不要使用count(列名)

2、MyISAM中，没有任何where条件的count(*)非常快。

3、当有where条件时，MyISAM的count统计不一定比其它引擎快。

4、可以使用explain查询近似值，用近似值替代count(*)

5、增加汇总表

6、使用缓存

#### 优化关联查询

1、确定ON或者USING子句中是否有索引。

2、确保GROUP BY和ORDER BY只有一个表中的列，这样mysql才有可能使用索引。

#### 优化子查询

1、用关联查询替代

2、优化GROUP BY和DISTINCT

3、这两种查询据可以使用索引来优化，是最有效的优化方法

4、关联查询中，使用标识列分组的效率更高

5、如果不需要ORDER BY，进行GROUP BY时加ORDER BY NULL，mysql不会再进行文件排序。

6、WITH ROLLUP超级聚合，可以挪到应用程序处理

#### 优化LIMIT分页

1、LIMIT偏移量大的时候，查询效率较低

2、可以记录上次查询的最大ID，下次查询时直接根据该ID来查询

#### 优化UNION查询

UNION ALL的效率高于UNION

优化WHERE子句





