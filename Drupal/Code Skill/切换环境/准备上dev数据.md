## 1. Pfkpsg 导出配置和内容

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
## Pfrpsg 
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfrpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```

```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/migrainefreesg_profile/content  
drush dcer node --folder=profiles/migrainefreesg_profile/content  
drush dcer block_content --folder=profiles/migrainefreesg_profile/content  
drush dcer media --folder=profiles/migrainefreesg_profile/content  
drush dcer menu_link_content --folder=profiles/migrainefreesg_profile/content  
drush dcer user --folder=profiles/migrainefreesg_profile/content
drush dcer file --folder=profiles/migrainefreesg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/migrainefreesg_profile/content
```

```php
// 根据 id 导出单个内容
drush dcer file 166 --folder=profiles/migrainefreesg_profile/content
```
## ## Pfevtvn
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomvn_profile/content
drush dcer file --folder=profiles/eventspfizerprocomvn_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomvn_profile/content
```
## Pfevtpk
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtpk/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```

```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer node --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer media --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer user --folder=profiles/eventspfizerprocompk_profile/content
drush dcer file --folder=profiles/eventspfizerprocompk_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocompk_profile/content
```

## Pfevtsg
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomsg_profile/content
drush dcer file --folder=profiles/eventspfizerprocomsg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomsg_profile/content
```

## Pfevtph
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtph/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomph_profile/content
drush dcer file --folder=profiles/eventspfizerprocomph_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomph_profile/content
```

## Pfevttw

- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevttw/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprotw_profile/content  
drush dcer node --folder=profiles/eventspfizerprotw_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprotw_profile/content  
drush dcer media --folder=profiles/eventspfizerprotw_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprotw_profile/content  
drush dcer user --folder=profiles/eventspfizerprotw_profile/content
drush dcer file --folder=profiles/eventspfizerprotw_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprotw_profile/content
```
## Pfplmy
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfplmy/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer node --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer block_content --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer media --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer menu_link_content --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer user --folder=profiles/pfecpreventlahcommy_profile/content
drush dcer file --folder=profiles/pfecpreventlahcommy_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfecpreventlahcommy_profile/content
```

## Pfadpag
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfadpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer node --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer block_content --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer media --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer menu_link_content --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer user --folder=profiles/pfeccovid19oralrxphcomph_profile/content
drush dcer file --folder=profiles/pfeccovid19oralrxphcomph_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfeccovid19oralrxphcomph_profile/content
```

## Pfemasia
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfemasia/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/psiasiadummycom_profile/content  
drush dcer node --folder=profiles/psiasiadummycom_profile/content  
drush dcer block_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer media --folder=profiles/psiasiadummycom_profile/content  
drush dcer menu_link_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer user --folder=profiles/psiasiadummycom_profile/content
drush dcer file --folder=profiles/psiasiadummycom_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/psiasiadummycom_profile/content
```

## fpspau
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfpspau/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/psiasiadummycom_profile/content  
drush dcer node --folder=profiles/psiasiadummycom_profile/content  
drush dcer block_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer media --folder=profiles/psiasiadummycom_profile/content  
drush dcer menu_link_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer user --folder=profiles/psiasiadummycom_profile/content
drush dcer file --folder=profiles/psiasiadummycom_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/psiasiadummycom_profile/content
```
## mastercard
- ==同步文件==
```shell
scp -r caneg@172.21.1.96:/var/www/mastercard/source/docroot/sites/default/files ./source/docroot/sites/default/


scp -r caneg@172.21.1.96:/var/www/mastercard/source/docroot/sites/default/files/2024-03/2023.11-mb.png /var/www/mastercard/source/docroot/sites/default/files/2024-03/2023.11-mb.png 


```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfizerflexau_profile/content  
drush dcer node --folder=profiles/pfizerflexau_profile/content  
drush dcer block_content --folder=profiles/pfizerflexau_profile/content  
drush dcer media --folder=profiles/pfizerflexau_profile/content  
drush dcer menu_link_content --folder=profiles/pfizerflexau_profile/content  
drush dcer user --folder=profiles/pfizerflexau_profile/content
drush dcer file --folder=profiles/pfizerflexau_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfizerflexau_profile/content
```

## Drupal Learn
- ==导出内容==
```shell
drush dcer shortcut --folder=../config/content  
drush dcer node --folder=../config/content  
drush dcer block_content --folder=../config/content  
drush dcer media --folder=../config/content
drush dcer menu_link_content --folder=../config/content 
drush dcer user --folder=../config/content
drush dcer file --folder=../config/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=../config/content
```

