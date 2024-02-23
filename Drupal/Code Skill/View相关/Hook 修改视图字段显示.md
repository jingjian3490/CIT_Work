## Case
#### 1. View 
view中有两个字段，第一个status，正常显示，第二个status_1，复写其值，但复写的内容就是 {{status_1__value}}
思考：为什么复写的值就是其本身的值
原因：该字段类型为list_integer，每个值对应一个显示标签，默认输出的值是显示标签，{{status_1__value}}输出的值是整数值。Reference：[[具有 值与显示标签 对应关系的字段]]
![[Pasted image 20240223154928.png]]
![[Pasted image 20240223155203.png]]

#### 2. Hook: hook_preprocess_views_view_field
`hook_preprocess_views_view_field`，允许模块在视图字段被渲染成HTML之前修改字段的变量。
```php
function eventhub_attend_preprocess_views_view_field(&$variables) {  
  /** @var \Drupal\views\ViewExecutable $view */  
  $view = $variables['view'];  
  $view_ids = [  
    'attendee_report',  
    'front_attendee_management',  
  ];  
  $display_ids = [  
    'cms_attendee_report',  
    'attendee_management_block',  
  ];  
  if (in_array($view->id(), $view_ids) && in_array($view->current_display, $display_ids)) { 
// 如果当前视图和显示ID匹配，并且当前字段的ID是 `status_1`，
//则根据字段输出的值修改 `$variables['output']`。
    if (isset($variables['field']->options['id']) && $variables['field']->options['id'] == 'status_1') {  
      switch ($variables['output']->__toString()) {  
        case Attendee::ATTENDANCE_STATUS_PENDING:  
          $is_ajax = $_GET['ajax_form'] ?? FALSE;  
          $id = $variables['row']->id;  
          if ($is_ajax) {  
            $id = \Drupal::request()->request->get('attendee_id');  
          }          $form = \Drupal::formBuilder()->getForm('Drupal\eventhub_attend\Form\OwnerReviewForm', $id);  
          $variables['output'] = $form;  
          break;  
  
        case Attendee::ATTENDANCE_STATUS_CHECKED:  
          $variables['output'] = '-';  
          break;  
  
        case Attendee::ATTENDANCE_STATUS_APPROVED:  
          $variables['output'] = 'Approved';  
          break;  
  
        case Attendee::ATTENDANCE_STATUS_DECLINED:  
          $variables['output'] = 'Declined';  
          break;  
      }  
    }  
  }
}
```

修改 `$variables['output']` 的效果是改变了即将输出到页面上的字段内容。`$variables` 是一个传递给预处理函数的数组，它包含了视图字段模板（通常是 twig 模板）将会使用的变量。在这个数组中，`output` 键对应的值就是字段将要显示的内容。

这里的逻辑是根据不同的参与者状态，修改 `$variables['output']` 来改变显示在视图中的字段输出。这会影响最终渲染到用户浏览器中的HTML。每种case对应的修改如下：
1. **待处理状态（`ATTENDANCE_STATUS_PENDING`）**：
    - 如果当前是AJAX请求，将输出一个动态生成的表单（`OwnerReviewForm`）。
    - 这个表单是使用Drupal表单API构建的，允许用户对某个行为进行审核或者其他操作。
    - 在页面上，这将替换原本字段的文本输出为一个实际的表单HTML，用户可以与之交互。
2. **已检查状态（`ATTENDANCE_STATUS_CHECKED`）**：
    - 输出将被修改为一个破折号`-`，在视图中这通常表示该字段是空的或不适用的状态。
3. **已批准状态（`ATTENDANCE_STATUS_APPROVED`）**：
    - 输出将被修改为文本“Approved”，在视图中显示，表示该参与者已经被批准。
4. **已拒绝状态（`ATTENDANCE_STATUS_DECLINED`）**：
    - 输出将被修改为文本“Declined”，在视图中显示，表示该参与者已经被拒绝。
