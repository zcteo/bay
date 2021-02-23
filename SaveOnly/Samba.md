##### Samba服务器（多用户组、多用户有不同的访问权限）

1。首先服务器采用用户验证的方式，每个用户可以访问自己的宿主目录，并且只有该用户能访问宿主目录，并具有完全的权限，而其他人不能看到你的宿主目录。

2。建立一个caiwu的文件夹，希望caiwu组和lingdao组的人能看到，network02也可以访问，但只有caiwu01有写的权限。

3。建立一个lindao的目录，只有领导组的人可以访问并读写，还有network02也可以访问，但外人看不到那个目录

4。建立一个文件交换目录exchange，所有人都能读写，包括guest用户，但每个人不能删除别人的文件。

5。建立一个公共的只读文件夹public，所有人只读这个文件夹的内容。

好，我们先来前期的工作

建立3个组：

#groupadd caiwu

#groupadd network

#groupadd lingdao


添加用户并加入相关的组当中：
#useradd caiwu01 -g caiwu

#useradd caiwu02 -g caiwu

#useradd network01 -g network

#useradd network02 -g network

#useradd lingdao01 -g lingdao

#useradd lingdao02 -g lingdao

然后我们使用smbpasswd -a caiwu01的命令为6个帐户分别添加到samba用户中

#mkdir /home/samba

#mkdir /home/samba/caiwu

#mkdir /home/samba/lingdao

#mkdir /home/samba/exchange

#mkdir /home/samba/public

我们为了避免麻烦可以在这里把上面所有的文件夹的权限都设置成777，我们通过samba灵活的权限管理来设置上面的5点要求。

以下是我的smb.conf的配置文件

[global]

workgroup = bmit

#我的网络工作组

server string = Frank's Samba File Server

#我的服务器名描述

security = user

#使用用户验证机制

encrypt passwords = yes
smb passwd file = /etc/samba/smbpasswd
#使用加密密码机制，在win95和winnt使用的是明文

其他的基本上可以按照默认的来。

[homes]
comment = Home Directories
browseable = no
writable = yes
valid users = %S
create mode = 0664
directory mode = 0775

\#homes段满足第1条件

[caiwu]
comment = caiwu
path = /home/samba/caiwu
public = no
valid users = @caiwu,@lingdao,network02
write list = caiwu01
printable = no

\#caiwu段满足我们的第2要求

[lingdao]
comment = lingdao
path = /home/samba/lingdao
public = no
browseable = no
valid users = @lingdao,network02
printable = no

\#lingdao段能满足我们的第3要求

[exchage]
comment = Exchange File Directory
path = /home/samba/exchange
public = yes
writable = yes

\#exchange段基本能满足我们的第4要求，但不能满足每个人不能删除别人的文件这个条件，即使里设置了mask也是没用，其实这个条件只要unix设置一个粘着位就行

chmod -R 1777 /home/samba/exchange

注意这里权限是1777，类似的系统目录/tmp也具有相同的权限，这个权限能实现每个人能自由写文件，但不能删除别人的文件这个要求

[public]
comment = Read Only Public
path = /home/samba/public
public = yes
read only = yes

\#这个public段能满足我们的第5要求。

到此为止我们的设置已经能实现我们的共享文件要求，记得重启服务哦