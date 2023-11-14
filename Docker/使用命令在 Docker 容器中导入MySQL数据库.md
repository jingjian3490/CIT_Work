```php
1. 从主机复制到容器
docker cp 文件名.sql mysql-container:/文件名.sql 

2. 进入容器
docker exec -it mysql-container bash

3. 登录到 MySQL 服务器
mysql -u root -p
 
4. 选择要更新的数据库：
use 数据库名;

5. 执行以下命令导入 SQL 文件并更新数据：
source /文件名.sql;
```

## SQLyog 连接 MySQL8.0+ 报错：错误号码2058

出现这个问题，是因为 MySQL 从 8.0 版本开始，新增了`caching_sha2_password`授权插件，并且新建用户时默认使用该插件进行加密，而 SQLyog 低版本无法识别该加密方式加密的密码。
#### 解决方案，修改用户的授权插件
```mysql
SELECT user,host,plugin FROM mysql.user;
```
![[Pasted image 20231109141821.png]]
```mysql
ALTER USER 'pfkpsg'@'localhost' IDENTIFIED WITH mysql_native_password BY '3.1415926';
```
![[Pasted image 20231109141920.png]]
