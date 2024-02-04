# Application Scenario `/səˈnɑːriəʊ/`

自定义控制器页面，需要在这个页面渲染某一个 Node 页面的某一个字段。

==渲染整个 Node 实体==，`'full'` 是显示模式，它决定了如何显示节点
```php
$event = Node::load($nid);
$view_builder = \Drupal::entityTypeManager()->getViewBuilder('node'); 
$event_renderable = $view_builder->view($event, 'full');
```
==渲染一个 Node 字段==，使用 `get()` 方法来获取 `body` 字段，然后调用 `view()` 方法来获取其==渲染数组==（结果是数组）。
```php
$event_body = $event->get('body')->view('full');
```
