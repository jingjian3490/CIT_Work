#### unset 函数
```php
.theme pfemasia_preprocess_node函数

if ($node->bundle() == 'article' && $variables['view_mode'] == 'card_small') {  
  $current_path = \Drupal::service('path.current')->getPath();  
  $alias = \Drupal::service('path_alias.manager')->getAliasByPath($current_path);  
  if (strpos($alias, '/expert/') !== FALSE) {  
    unset($variables['content']['field_content_format']);  
  }}
```
在.theme的预处理函数中使用unset可以配合node模板进行更加灵活的展示效果
```twig
node--article--card-small.html.twig 文件

{% if content.field_content_format %}  
    <div class="tag-duration-container">  
      {{ content.field_content_format }}  
    </div>  
{% endif %}
```
#### URL 变量
再也twig模板文件中直接使用 `url` 变量打印当前页面的 URL