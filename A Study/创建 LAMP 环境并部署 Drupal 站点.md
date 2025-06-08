##  LAMP 环境
#### 更新系统+基础工具
```bash
 sudo apt update && sudo apt upgrade -y
```
#### 安装 Apache2
```bash
apt install -y apache2
```
查看Apache版本：
```
apache2 -v
```
设置Apache服务开机自启动
```
systemctl enable apache2
```
安装成功直接访问服务器 IP地址会显示 Apache2 默认页面
#### 安装 MySQL
```
apt install -y mariadb-server mariadb-client
```
查看MariaDB版本：
```
mysql -V
```
设置MariaDB服务开机自启动：
```
systemctl enable mariadb
```
执行MariaDB安全性操作并设置密码：
```
mysql_secure_installation
```
认修改数据库的root密码
移除匿名用户。
禁止root账号远程登录。
删除test库及对test库的访问权限。
重新加载授权表。
#### 安装并配置PHP
###### 添加PHP官方仓库（Ondřej Surý维护的PPA）
```bash
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```
> Ubuntu官方仓库的PHP版本通常较旧，Ondřej的PPA提供最新版本

```bash
apt install -y php php-mysql
```
查看PHP版本。
```bash
php -v
```
> PHP默认开机自启动，无需进行额外配置

安装必要的 PHP 扩展:
```bash
sudo apt install php-cli php-mbstring php-xml php-gd php-curl php-zip php-bcmath php-tokenizer unzip -y
```

安装Apache的PHP模块
```bash
sudo apt install -y libapache2-mod-php8.3
#启用
sudo a2enmod php8.3
# 重启
sudo systemctl restart apache2
```

#### 访问LAMP
创建测试文件。
```
nano /var/www/html/phpinfo.php
```
> /var/www/html/为Apache的网站根目录。

输入以下内容。
```
<?php echo phpinfo(); ?> 
```
保存并退出文件。重启Apache服务。
```
systemctl restart apache2
```
浏览器中输入http://<公网IP地址>/phpinfo.php访问LAMP，回显 PHP版本信息表示安装成功。

## 部署
#### 1. 创建 Drupal 数据库
```bash
mysql -u root -p
```

```SQL
CREATE DATABASE itnowdo;
CREATE USER 'itnowdo'@'%' IDENTIFIED BY 'itnowdo';
GRANT ALL PRIVILEGES ON itnowdo.* TO 'itnowdo'@'%';
FLUSH PRIVILEGES;
EXIT;
```

#### 2. 下载并部署 Drupal 代码
在 Web 目录（如 `/var/www/html`）拉取代码
```bash
cd /var/www/html
sudo git clone https://github.com/your-repo/drupal-site.git drupal
cd drupal
sudo chown -R www-data:www-data .
```
> 这里是在 html 目录下拉取的代码，并且 进入了 drupal 目录

**安装 `composer` 并执行依赖安装**
```bash
sudo apt install composer -y
composer --version  # 注意需要 2.x 版本
composer install
```
#### 3. 配置 Drupal
配置 `settings.php`
```bash
cp sites/default/default.settings.php sites/default/settings.php
chmod 644 sites/default/settings.php
```

编辑 `settings.php`，添加数据库信息
```PHP
$databases['default']['default'] = [
    'database' => 'drupal_db',
    'username' => 'drupal_user',
    'password' => 'your_strong_password',
    'host' => 'localhost',
    'port' => '',
    'driver' => 'mysql',
    'prefix' => '',
];
$settings['hash_salt'] = '粘贴本地记录的hash_salt';
```

配置 `files` 目录权限
```bash
mkdir -p sites/default/files
chmod -R 775 sites/default/files
chown -R www-data:www-data sites/default/files
```
#### 4. 设置 Apache 虚拟主机
创建 Drupal 配置文件：
``` bash
sudo nano /etc/apache2/sites-available/drupal.conf
```
添加以下内容：
```bash
<VirtualHost *:80>
    ServerAdmin admin@example.com
    DocumentRoot /var/www/html/drupal/web  #设置Web根目录
    ServerName yourdomain.com  # 或者是 IP 地址

    <Directory /var/www/html/drupal/web>
        AllowOverride All # 允许.htaccess生效
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

启用 Drupal 站点并重启 Apache：
```
sudo a2ensite drupal
sudo a2enmod rewrite
sudo systemctl restart apache2
```
现在可以访问。

## 杂七杂八

#### 远程无法登录MariaDB数据库

首先，云服务器要放行3306端口
1. 进入ECS实例的**安全组配置**
2. 添加**入方向规则**：
    - 端口范围：3306
    - 授权对象：`0.0.0.0/0`


==默认情况下==MariaDB只监听本地连接(`127.0.0.1`)，需修改配置文件：
```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```
找到`bind-address`并修改为：
```ini
bind-address = 0.0.0.0  # 允许所有IP连接
```
重启服务：
```shell
sudo systemctl restart mariadb
```


或者权限问题： **验证用户权限**
root 登录并查询：
```sql
SELECT host, user FROM mysql.user WHERE user = 'drupallearn';
```
预期输出应为：
```
+------+-------------+
| host | user        |
+------+-------------+
| %    | drupallearn |  # %表示允许所有主机
+------+-------------+
```


```ini
<VirtualHost *:80>
    ServerAdmin admin@example.com
    DocumentRoot /var/www/drupal-learn/web  #设置Web根目录
    ServerName 14.103.233.13  # 或者是 IP 地址

    <Directory /var/www/drupal-learn/web>
        AllowOverride All # 允许.htaccess生效
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

```
$host = "127.0.0.1";
$port = 3306;
$driver = "mysql";

$databases['default']['default']['database'] = "pfrpsg";
$databases['default']['default']['username'] = "pfrpsg";
$databases['default']['default']['password'] = "pfrpsg";
$databases['default']['default']['host'] = $host;
$databases['default']['default']['port'] = $port;
$databases['default']['default']['driver'] = $driver;

$settings['hash_salt'] = '726d8fdcccd244463896a855126c713358a0a04485780b7eb998e3e90b0ab162';
```

```bash
mkdir itnowdo && cd itnowdo
ddev config --project-type=drupal11 --docroot=web
ddev start
ddev composer create drupal/recommended-project:^11
ddev composer require drush/drush
ddev drush site:install --account-name=admin --account-pass=cane -y
ddev launch
# or automatically log in with
ddev launch $(ddev drush uli)
```