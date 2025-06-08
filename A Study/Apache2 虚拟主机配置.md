##### 为新站点创建配置文件（也可以多个站点写在同一个文件）
```shell
sudo nano /etc/apache2/sites-available/project1.conf
```

```ini
<VirtualHost *:80>
    # 域名（需在 Windows 的 hosts 文件中配置）
    ServerName project1.test
    # 项目入口目录（Yii 应用的 web 目录）
    DocumentRoot /home/user/projects/project1/web

    # 日志文件
    ErrorLog ${APACHE_LOG_DIR}/project1_error.log
    CustomLog ${APACHE_LOG_DIR}/project1_access.log combined

    # 目录权限
    <Directory "/home/user/projects/project1/web">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        # 开启 mod_rewrite 用于美化 URL 功能的支持，开启这个，下面的才生效
        # 将 `/user/1` 隐藏实际的 `/index.php?route=user&id=1`
        # 在此之前需要先执行：sudo a2enmod rewrite
        RewriteEngine on 
        # 如果请求的是真实存在的文件或目录，直接访问 
        RewriteCond %{REQUEST_FILENAME} !-f 
        RewriteCond %{REQUEST_FILENAME} !-d 
        # 如果请求的不是真实文件或目录，分发请求至 index.php 
        RewriteRule . index.php 
        # 如果 URL 是 index.php/xxx → 返回 404 错误
        RewriteRule ^index.php/ - [L,R=404]
    </Directory>
</VirtualHost>
```

检查 Apache 配置是否有语法错误：
```bash
sudo apachectl configtest
```

查看已加载的虚拟主机列表
```bash
sudo apache2ctl -S
```
##### 启用禁用 Apache 配置文件
```bash
# 启用项目配置
sudo a2ensite project1.conf

# 禁用默认配置
sudo a2dissite 000-default.conf
```
##### 配置多端口（如果使用端口区分项目）
```shell
sudo nano /etc/apache2/ports.conf
```

```ini
Listen 80
Listen 8080  # 项目2的端口
```

```bash
sudo service apache2 restart
```

#####  配置 Windows 的 hosts 文件（域名方式必需）
以管理员身份打开 `C:\Windows\System32\drivers\etc\hosts`
```text
127.0.0.1 project1.test
127.0.0.1 project2.test
```

##### 关于不同虚拟主机配置了相同的端口

**1. 相同端口 + 不同域名（标准做法）**
- 两个虚拟主机都监听 `80` 端口，但使用不同域名（如 `project1.test` 和 `project2.test`）。
```ini
    # 项目1
    <VirtualHost *:80>
        ServerName project1.test
        DocumentRoot /path/to/project1/web
    </VirtualHost>
    
    # 项目2
    <VirtualHost *:80>
        ServerName project2.test
        DocumentRoot /path/to/project2/web
    </VirtualHost>
```
**结果**：
**正常运作**：Apache 会根据 HTTP 请求头中的 `Host` 字段（即用户访问的域名）自动匹配对应的虚拟主机。
- **访问逻辑**：
    - 访问 `http://project1.test` → 指向项目1
    - 访问 `http://project2.test` → 指向项目2
- **必要条件**：
  在客户端（Windows）的 `hosts` 文件中正确配置域名解析：

**2. 相同端口 + 相同域名（冲突）**
**结果**：
- **第一个虚拟主机生效**：Apache 会优先加载配置文件中的第一个 `<VirtualHost>`，后续相同端口的配置被忽略。