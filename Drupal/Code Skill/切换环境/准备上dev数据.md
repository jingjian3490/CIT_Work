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
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer node --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer block_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer media --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer menu_link_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer user --folder=profiles/edisonknowpneumoniasg_profile/content
drush dcer file --folder=profiles/edisonknowpneumoniasg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/edisonknowpneumoniasg_profile/content
```
- ==测试==
```shell
drush site:install -y
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
- ==完善settings.prod.php文件==
```php
// Uncomment and update the base URL with the production domain.  
$settings['pfizer_base_url'] = "https://www.pfizer-genotropin-shizai-info.jp";  
  
// Set XML sitemap base hostname.  
$config['simple_sitemap.settings']['base_url'] = $settings['pfizer_base_url'];  
  
// Adobe analysis.  
$config['adobe_analytics'] = [  
  'mode' => 'prod'  
];  

// 一般有两个一个用于私网登录CMS，一个用于公网，www是特殊
$settings['trusted_host_patterns'] = [  
  '^www\.pfizer-genotropin-shizai-info\.jp$',  
  '^pfizergenotropinshizaiin\.pfizersite\.io$',  
  '^pfizer-genotropin-shizai-info\.jp$',  
];
```



----------------------------------
## Pfkpsg 项目 MTD 问题

```
drush dcer block_content --folder=profiles/eventspfizerprocomvn_profile/content 
```