可以使用`get()`方法获取字段值：

```php
$field_value = $paragraph->get('field_machine_name')->getValue();
```

此代码会返回一个数组，代表字段的所有值。如果字段只有一个值，您可以使用`$field_value[0]['value']`来直接获取它。


<div class="result-title">
    <p>
        TEST RESULT
    </p>
</div>
```HTML
<div class="result-description">
    <p>
        Based on your MIDAS score, you can help yourself and your doctor understand the severity of your migraine.
    </p>
</div>
```


点击

```php
/**  
 * Implements hook_preprocess_views_view() for the quiz-report view. */function pfrpsg_assess_my_condition_preprocess_views_view(array &$variables) {  
  if ($variables['view']->id() == 'quiz_report' && $variables['view']->current_display == 'page_1') {  
    // 查询 Grade I 的实体。  
    $query = \Drupal::entityQuery('quiz_report')  
      ->condition('grade', 'I')  
      ->accessCheck(FALSE)  
      ->range(0, 1); // 只获取一条记录。  
    $result = $query->execute();  
  
    if (!empty($result)) {  
      $entity_id = reset($result); // 获取实体ID。  
      $grade_I_entity = QuizReport::load($entity_id);  
  
      if ($grade_I_entity) {  
        // 增加 count。  
        $current_count = $grade_I_entity->get('count')->value;  
        $grade_I_entity->set('count', $current_count + 1);  
  
        // 保存实体。  
        $grade_I_entity->save();  
      }    }  }}


  $variables['#cache']['max-age'] = 0;
```

1. adjust 'result' page twig template
2. 'test' 'result' page redirects to 'agree' page logic  
3. save form data to custom entity
4. config export