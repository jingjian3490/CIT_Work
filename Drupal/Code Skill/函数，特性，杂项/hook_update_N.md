#### 用代码创建Drupal用户账号
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
==drush updatedb==

#### 更新自定义实体字段

1. 编写 Hook
```PHP
/**
 * Implements hook_update_N().
 */
function pfrpsg_hospital_update_10003(&$sandbox) {
  $update_info_field_storage_definition = BaseFieldDefinition::create('boolean')
    ->setLabel('Update info')
    ->setDescription('Update clinic info form google map api when save.')
    ->setDefaultValue(FALSE)
    ->setRequired(TRUE);
  \Drupal::entityDefinitionUpdateManager()
    ->installFieldStorageDefinition('update_info', 'hospital', 'hospital', $update_info_field_storage_definition);
}
```
2. ==在定义实体的类添加对应字段定义==
```PHP
    $fields['update_info'] = BaseFieldDefinition::create('boolean')
      ->setLabel('Update info')
      ->setDescription('Update clinic info form google map api when save.')
      ->setDefaultValue(FALSE)
      ->setRequired(TRUE);
```