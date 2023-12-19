```php
根据 taxonomy 的 item id 获取其 label

$account = $this->currentUser;  
$user = User::load($account->id());  
$user_country_id = $user->field_user_country->target_id; 

$term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($user_country_id);  

$user_country = $term->label();
```

```php
根据 taxonomy 的 label 获取其 item id

$term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');  
$terms = $term_storage->loadByProperties([  
  'vid' => 'country',  
  'name' => $country,  
]);

$term = reset($terms);  
$term_id = $term->id();
```

```php
根据 content type 及其字段获取对应 node 别名
注：field_country 是 taxonomy 映射的，查询时使用 taxonomy item 的 id

$query = \Drupal::entityQuery('node');  
$query->condition('type', 'contact');  
$query->condition('field_country', $term_id);  
$node_ids = $query->execute(); 

if (!empty($node_ids)) {  
  $nodes = \Drupal\node\Entity\Node::loadMultiple($node_ids);  
  foreach ($nodes as $node) {  
    $url = \Drupal\Core\Url::fromRoute('entity.node.canonical', ['node' => $node->id()]);  
    $node_alias = $url->toString();  
    return $node_alias;  
  }
}
  ```
  