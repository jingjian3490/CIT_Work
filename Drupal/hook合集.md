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