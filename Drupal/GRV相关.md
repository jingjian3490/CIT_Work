#### 在表单除处理函数中
==判断GRV是否可用，Drupal账号是否是GRV账号==
```php
/** @var \Drupal\pfizer_grv_nextgen\ConfigManager $config_manager */  
$config_manager = \Drupal::service('pfizer_grv_nextgen.config_manager');  
/** @var \Drupal\pfizer_grv_nextgen\AccountManagerInterface $account_manager */  
$account_manager = \Drupal::service('pfizer_grv_nextgen.account_manager');  
$username = $user->getDisplayName();  
if (!$config_manager->isGrvDisabled() && $account_manager->isGrvAccount($account)) {  

}
```

#### Drupal 中的配置关联的实际数据是以 UUID 为准的 
开发流程： 
1. 在CI上创建内容（content, block, menu, taxonomy, media 等），每一种数据都有唯一的 UUID 
2. 在CI上做配置或者下载数据库到本地，然后在本地环境做配置，配置的信息都是固定的除了UUID 
3. 不管是在CI上做的配置或者是在本地做的配置，都需要将其从数据库导出到项目中，加入版本控制 
4. 提交PR到 CI 环境，build 成功后到 configuration 中同步配置信息，保证 CI 环境为最新

也就是说如果本身是从CI同步的数据库到本地，然后再导出配置--->加入版本控制-->pr--->build的就不用 只有在本地修改了配置才需要在CI导入配置