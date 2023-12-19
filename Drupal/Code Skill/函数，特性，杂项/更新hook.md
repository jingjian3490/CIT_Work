```
需求：用代码创建Drupal用户账号

实现：在点module的.install文件使用update hook
```
```php
use Drupal\user\Entity\User;  
  
/**  
 * Implements hook_update_N(). 
 */
function pfemasia_user_update_9001(): void {  
  // Create UAT accounts.  
  $uat_accounts = [  
    'CHENJ410' => 'self_service_manager',  
    'SANTOH08' => 'self_service_manager',  
    'YEOK05' => 'self_service_manager',   
  ];  
$user_storage = \Drupal::entityTypeManager()->getStorage('user');  
  foreach ($uat_accounts as $account => $role_id) {  
    $exists_user = $user_storage->loadByProperties(['name' => $account]);  
    if (!$exists_user) {  
      $user = User::create();  
      $user->setUsername($account);  
      $user->setPassword('Pfizer123');  
      $user->addRole($role_id);  
      $user->activate();  
      $user->enforceIsNew();  
      $user->save();  
    }  
  }
}
```

```
更新钩子（update hook）是Drupal中的一个重要概念，用于管理数据库架构的更改和其他模块升级操作。

更新钩子的函数名称通常遵循特定的命名约定，格式为 `hook_update_N()`，其中 `N` 是一个整数，用于标识更新钩子的版本。
```

```
使用 Drush 运行更新
可以使用 Drupal 的命令行工具 Drush 来运行更新钩子，以便在模块升级后手动触发升级操作
```
==drush updb --module=your_module==
