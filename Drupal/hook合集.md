```php
关于paragraph预处理的规则：
themeName_preprocess_

```

#### hook_preprocess_html
```php
function pfrpsg_preprocess_html(&$variables) {  
  $current_path = \Drupal::service('path.current')->getPath();  
  $internal = \Drupal::service('path_alias.manager')->getAliasByPath($current_path);
  // 在这个hook里面添加class 会添加到页面的body上
  $variables['attributes']['class'][] = 'path-55555'  
  if ($internal) {  
    $variables['attributes']['class'][] = 'path-' . substr($internal, 1);  
  }
}
```
![[Pasted image 20230921111313.png]]



#### `hook_views_data_alter` & `hook_views_query_alter`
`hook_views_data_alter` 和 `hook_views_query_alter` 都是 Drupal 的 Views 模块中的钩子，用于修改 Views 查询和数据定义。它们的主要区别在于它们的作用和触发时机：

1. `hook_views_data_alter`：
    - 作用：`hook_views_data_alter` 主要用于修改 Views 模块中的数据定义，通常用于添加、修改或删除与数据库表或其他数据源相关的字段和表。
    - 触发时机：这个钩子在 Views 初始化阶段被触发，通常在视图的信息被加载时执行。这意味着它用于修改 Views 对数据源的认知，但在实际查询执行之前。

2.  `hook_views_query_alter`：
    - 作用：`hook_views_query_alter` 主要用于修改 Views 查询本身，包括修改查询条件、字段、排序方式等。它可以用于更改实际的 SQL 查询，以及在查询执行之前或之后进行自定义处理。
    - 触发时机：这个钩子在 Views 构建查询时被触发，通常在实际查询执行之前。这意味着它用于在查询被执行之前，对查询进行最后的修改和优化。

总结：
- `hook_views_data_alter` 用于修改 Views 对数据源的定义，它影响 Views 如何理解和使用数据。
- `hook_views_query_alter` 用于修改实际的查询，包括条件、字段和排序，它影响最终生成的 SQL 查询。


#### hook_theme_suggestions_HOOK_alter
在Drupal中，`hook_theme_suggestions_HOOK_alter`和`hook_theme_suggestions_alter` 钩子用于动态地添加或更改Twig模板建议。
这些钩子允许您根据某些条件（例如内容类型、角色、路径等）为不同的Drupal实体（如区块、页面、表单等）提供不同的模板文件。
###### 这是一个简单的使用示例：
```php
/**
 * Implements hook_theme_suggestions_HOOK_alter() for node templates.
 */
function mymodule_theme_suggestions_node_alter(array &$suggestions, array $variables) {
  $node = $variables['elements']['#node'];

  if ($node->getType() == 'article') {
    $suggestions[] = 'node__article__' . $node->id();
  }
}
```
在上面的代码中，我们实现了一个针对节点（node）的模板建议钩子。当节点的类型为“文章”（article）时，我们添加一个新的模板建议，该建议将仅适用于具有特定ID的文章节点。这意味着您可以创建一个针对具有特定ID的文章节点的自定义模板，例如：`node--article--1.html.twig`。


```php
/**  
 * Implements hook_theme_suggestions_HOOK_alter() for form. 
 */
function pfrpsg_theme_suggestions_form_alter(array &$suggestions, array $variables) {  
  if (isset($variables['element']['#form_id'])) {  
    $suggestions[] = 'form__' . str_replace('-', '_', $variables['element']['#form_id']);  
  }
}

/**  
 * Implements template_theme_suggestions_alter(). 
 * 
 * Add form suggestions. 
 */
 function adpsg_theme_suggestions_alter(array &$suggestions, array $variables, $hook) {  
  if ($hook == 'form' && !empty($variables['element']['#id'])) {  
    $suggestions[] = 'form__' . str_replace('-', '_', $variables['element']['#id']);  
  }
}
```
使用`str_replace`函数将`#form_id`中的破折号（-）替换为下划线（\_），这是一个很好的做法.
`hook_theme_suggestions_alter`更加通用，可以用于所有类型的实体。这给了更多的灵活性，但也可能需要更复杂的逻辑。