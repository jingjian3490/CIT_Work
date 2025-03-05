## Summary

前后端交互API确实主要用的就是路由，前端通过访问特定路由请求数据，后端通过特定路由返回数据。而特定路由的确定就是API了。

## 通过路由传递node==实体==
在 `pfevtsg` 项目 `Drupal\eventhub_attend\Form` 中的案例：

```yml
eventhub_attend.import_attendee:  
  path: '/admin/attendee/reports/{node}/import'  
  defaults:  
    _form: 'Drupal\eventhub_attend\Form\ImportAttendeeForm'  
  requirements:  
    _access: 'TRUE'  
  options:  
    parameters:  
      node:  
        type: entity:node
```

```php
public function buildForm(array $form, FormStateInterface $form_state, NodeInterface $node = NULL) {
  // Form 的路由中传递了node实体，构建form 时就可以直接使用 node 实体.
  $this->event = $node;  
  $form['#title'] = $this->t('Import attendee data - ') . $this->event->getTitle();
}
```