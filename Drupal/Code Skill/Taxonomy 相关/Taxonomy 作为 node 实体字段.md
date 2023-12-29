#### 1. 通过node 实体获取 taxonomy 的值
```php
use Drupal\taxonomy\Entity\Term;

public function getPlatform(NodeInterface $event) {  
  $webinar_platform = $event->hasField('field_webinar_platform') ? $event->get('field_webinar_platform')->target_id : NULL;  
  if ($webinar_platform) {  
    $term = Term::load($webinar_platform);  
    if ($term && $term->hasField('field_key')) {  
      $field_value = $term->get('field_key')->value;  
      return $field_value;  
    }
  }  
  return NULL;  
}
```