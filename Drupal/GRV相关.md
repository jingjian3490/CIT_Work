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
