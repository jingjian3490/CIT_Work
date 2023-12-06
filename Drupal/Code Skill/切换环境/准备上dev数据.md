## 1. 导出配置和内容

- ==同步代码==
```shell
git pull origin develop
```
- ==同步数据库==
```shell
docker cp filename.sql mysql-container:/filename.sql
docker exec -it mysql-container bash
mysql -u root -p
use databaseName;
source /filename.sql;
```
- ==同步文件==
```shell
cd /var/www/projectKey
scp -r caneg@172.21.2.211:/var/www/pfkpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出配置==
```shell
drush cex
```
- ==导出内容==
```shell
drush dcer shortcut --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer node --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer block_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer media --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer menu_link_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer user --folder=profiles/edisonknowpneumoniasg_profile/content
drush dcer file --folder=profiles/edisonknowpneumoniasg_profile/content
  注意文件名不能有空格，肉运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/edisonknowpneumoniasg_profile/content
```
- ==导出数据库==
```shell
在 sub_prosile文件夹下创建 database.sanitize.yml
drush dbsg --machine-name="edisonknowpneumoniasg_profile"
or
drush dbsg + 回车 + 回车
or
drush dbsa --list  （卸载 dblog 模块）
--------------------------------
将打印出的配置复制到 database.sanitize.yml 文件，最后修改保持格式如下
sanitize:  
  edisonknowpneumoniasg_profile:  
    block_content__field_banner: FALSE  
    block_content__field_brightcove: FALSE  
    block_content__field_ckeditor: FALSE
--------------------------------
dblog 这个模块被 pfizer 忽略了，还有 views，导出来了也没用.
```