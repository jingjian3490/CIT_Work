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