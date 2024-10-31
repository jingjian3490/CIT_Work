#### 1. 在本地修改域名 （dev & stage & prod） 

在 ddev 配置文件修改
```yml
additional_fqdns: ["eventspfizerprocoid-dev.pfizersite.io","eventspfizerprocoid-stage.pfizersite.io","events.pfizerpro.co.id"]
```
#### 2. 在后台 Pfizer GRV Nextgen Settings 中新增一条配置，按照配置文件填写即可，同时删除多余的配置  

删除配置时，要保证删除后有一条，也就是说需要先新建再删除。（Event hub默认有一条之前的，新项目不知道）
如果删除后没有就会导致==报错==。
如何解决报错：1. 将setting.php中的$env改为dev     2. 将`setting.base.php`中读取key file文件目录的相关代码注释代码。

对了，要保证 docroot 目录下有 .pfizer 文件夹，如果没有，去其他项目复制。
#### 3. 加密 GRV 配置中的 client_id 和 client_secret 参数，并将每个环境（dev & stage & prod） 加密后的值替换到 .pfizer/keys 目录下的 pfizer_grv_nextgen_client.key 文件中 

==如何加密==：在 `setting.base.php` 文件中输入下面代码并替换client_id 和 client_secret，然后执行 drush cr 就会输出加密后的密文。
```php
$a = [
  'client_id' => '65df0f679be5d',
  'client_secret' => '52c96bba66a006c0dca9a1fdf7ba3a9a',
];
echo base64_encode(json_encode($a));
```

#### 4. 更新 profiles/xxxx_profile/settings 文件中的 settings.base.php, settings.stage.php, settings.prod.php 中的参数 

主要替换国家缩写和`auth0_client_id`（来自客户提供的GRV配置）
#### 5. 更新 sites/default/settings.php $env 变量为对应的环境进行测试 ，同时需要修改 base.php文件读取key file文件的目录

如果是 dev 环境就不用更新读取key file文件的目录的代码，默认读取的就是
当测试 stage、prod环境时需要修改读取key file文件目录代码

 ==base.php==
```php
// 默认读取dev
$settings['pfizer_env_key_directory'] = DRUPAL_ROOT . '/../.pfizer/keys';
$grv_key_file = $settings['pfizer_env_key_directory'] . '/pfizer_grv_nextgen_client.key';
if (file_exists($grv_key_file)) {
  $grv_client_config = json_decode(base64_decode(file_get_contents($grv_key_file)), TRUE);
  $config['pfizer_grv_nextgen.settings']['countries']['ID']['general']['client_id'] = $grv_client_config['client_id'];
  $config['pfizer_grv_nextgen.settings']['countries']['ID']['general']['client_secret'] = $grv_client_config['client_secret'];
}

// stage
$settings['pfizer_env_key_directory'] = DRUPAL_ROOT . '/../.pfizer/keys/stage';

// prod
$settings['pfizer_env_key_directory'] = DRUPAL_ROOT . '/../.pfizer/keys/production';
```

==settings.php==
```php
// 默认dev
$env = $is_hosting_env ? $_ENV['ENV'] : 'dev';

// stage
$env = $is_hosting_env ? $_ENV['ENV'] : 'stage';

// prod
$env = $is_hosting_env ? $_ENV['ENV'] : 'prod';
```

#### 6. 测试完毕后导出配置手动修改 pfizer_grv_nextgen.settings 中 client_id 和 client_secret 参数
```yml
      client_id: CLIENT_ID
      client_secret: CLIENT_SECRET
```