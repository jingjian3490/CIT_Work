##### 创建表
一般在你的自定义模块中创建一个新文件，比如 `my_module.install`，用于在模块安装时创建数据库表。
```php
/**  
 * Implements hook_schema(). */
function pfizergo_personalization_schema() {  
  $schema['personalization_config'] = get_config_table_schema();  
  return $schema;  
}  
  
/**  
 * Implements hook_install(). */
function pfizergo_personalization_install() {  
  // Seed module config table.  
  $connection = Database::getConnection();  
  seed_config_table($connection);  
}  
  
/**  
 * Returns table schema. */
function get_config_table_schema() {  
  return [  
    'description' => 'Tracking the videos resume for users.',  
    'fields' => [  
      'key' => [  
        'description' => 'personalization config key name.',  
        'type' => 'varchar',  
        'length' => '50',  
        'not null' => TRUE,  
      ],      'value' => [  
        'description' => 'personalization config value.',  
        'type' => 'int',  
        'unsigned' => TRUE,  
        'not null' => TRUE,  
      ],    ],    'primary key' => [  
      'key',  
    ],  ];}  
  
/**  
 * Seeds config table. */
function seed_config_table($connection) {  
  $query = $connection->insert('personalization_config')  
    ->fields(['key', 'value']);  
  $values = [  
      ["key" => "know_about", "value" => 1],  
      ["key" => "interested_topcis", "value" => 1],  
      ["key" => "video_length", "value" => 1],  
      ["key" => "patient_type", "value" => 1],  
      ["key" => "theraputic_area", "value" => 1],  
      ["key" => "video_type", "value" => 1],  
      ["key" => "audio_type", "value" => 1],  
      ["key" => "document_type", "value" => 1],  
      ["key" => "here_for", "value" => 1],  
      ["key" => "hcp_journey", "value" => 1],  
      ["key" => "rep_mindset", "value" => 1],  
      ["key" => "speciality", "value" => 1],  
      ["key" => "department", "value" => 1],  
  ];  foreach ($values as $record) {  
    $query->values($record);  
  }  $query->execute();  
}
```




#### 操作表
```php
/**  
 * Load config file. * 使用 $this->connection 访问数据库连接对象。  
 * 通过 select 方法创建一个数据库查询，从名为 personalization_config 的表中选择数据。  
 * 通过 fields 方法指定需要选择的字段，这里选择了 key 和 value 字段。  
 * 使用 execute 方法执行查询，得到结果集。  
 * 使用 fetchAllKeyed(0, 1) 将结果集转换为关联数组，将第 0 列的值作为键，第 1 列的值作为值。  
 */  
public function loadConfig() {  
  $config = $this->connection->select('personalization_config', 'pc')  
    ->fields('pc', ['key', 'value'])  
    ->execute()->fetchAllKeyed(0, 1);  
  return $config;  
}  
  
/**  
 * Save config file. */
public function saveConfig(array $config) {  
  try {  
    // 遍历配置数组（关联数组）  
    foreach ($config as $key => $value) {  
      /*  
       * 创建了 Merge 查询对象，即用于执行数据库合并操作的对象。  
       * Merge 查询可以执行插入或更新，它会根据指定的条件决定是插入新数据还是更新已有数据。  
       * 在这里，我们要向名为 personalization_config 的表中插入或更新数据。  
       * */      
    $query = $this->connection->merge('personalization_config');  
      /*  
       * key 方法用于设置合并操作的  主键条件。  
       * 在这个情况下，我们使用配置项的 key 作为主键条件。  
       * $key 是当前配置项的键，通过 $query->key(['key' => $key,]) 来指定合并操作的主键条件，  
       * 这意味着数据库会根据这个条件来决定是插入新数据还是更新已有数据。  
       *       * 如果数据库中存在具有相同主键条件的记录，则更新该记录。  
       * 如果数据库中不存在具有相同主键条件的记录，则插入一条新记录。  
       *       * key就是主键字段，查询主键字段里面是否有传递的 $key ,只是这里碰巧关联数组也对应有个key  
       * */      
    $query->key(['key' => $key,])  
        /*  
         * fields 方法用于设置要插入或更新的字段及其对应的值  
         * */        
        ->fields(['value' => $value,]);  
      $query->execute();  
    }  }  catch (\Throwable $th) {  
    // var_dump($th);  
    \Drupal::messenger()->addError(t('Personalization config not saved successfully.'));  
  }  \Drupal::messenger()->addStatus(t('Personalization config saved successfully.'));  
}
```

