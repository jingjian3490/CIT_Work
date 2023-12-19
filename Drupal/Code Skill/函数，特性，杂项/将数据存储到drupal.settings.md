###### 起源
![[Pasted image 20230814162828.png]]
```php
function pfemasia_core_preprocess_page(&$variables) {  
  
  $current_path = \Drupal::service('path.current')->getPath();  
  if ($current_path == '/dashboard' || $current_path == '/dashboard/reports') {
    // 知识点，获取view的result的便捷函数，第一个参数是view的machine name
    // 第二个参数是view的display_id,什么是view的display_id ？
    // 一个view可以创建多种形式，ADVANCED-->OTHER-->Machine Name就是view的display_id
    $result = views_get_view_result('dashboard_total_content', 'content');  
    dump($result);  
    $settings[] = ['Content type', 'Total Content Type'];  
    foreach ($result as $value) {  
      $node_field_data_type = $value->node_field_data_type;  
      $node_field_data_type_1 = ucfirst($value->node_field_data_type_1);  
      $settings[] = [$node_field_data_type_1 , $node_field_data_type];  
    }    
    $variables['#attached']['drupalSettings']['dashboardCount'] = $settings;  
  }
}

获取view result的不便捷方法
  $view = \Drupal\views\Views::getView('dashboard_total_content');  
  if ($view && $view->getDisplay()) {  
    $view->setDisplay('content');    
    $view->preExecute();  
    $view->execute();  
    $result = $view->result;  
  }
```


###### 如何访问drupal.settings

```php
在浏览器的控制台输出
```
![[Pasted image 20230814174337.png]]

###### ==Drupal中$variables['#attached']的作用是什么==

在Drupal中，`$variables['#attached']` 是一个非常有用的数组，它用于向页面添加额外的CSS、JavaScript、库和其他资源。这在主题和模块开发中经常会用到。

`$variables['#attached']` 的作用是允许您将相关资源与特定的渲染变量关联起来，以便在页面加载时自动包含这些资源。这通常用于添加样式和脚本，以确保它们在正确的上下文中加载，避免冲突并提高性能。

以下是一个示例，展示如何在 Drupal 9.5 中使用 `$variables['#attached']` 添加 CSS 和 JavaScript 文件：

```php
function mytheme_preprocess_page(&$variables) {
  // 添加自定义CSS文件
  $variables['#attached']['css'][] = array(
    'data' => drupal_get_path('theme', 'mytheme') . '/css/custom.css',
    'type' => 'file',
  );

  // 添加自定义JavaScript文件
  $variables['#attached']['js'][] = array(
    'data' => drupal_get_path('theme', 'mytheme') . '/js/custom.js',
    'type' => 'file',
  );
}

```

###### ==Drupal中$variables['#attached'] \['drupalSettings']的作用是什么==

在Drupal中，`$variables['#attached']['drupalSettings']` 是一个用于在页面上输出JavaScript设置的数组。

具体来说，`$variables['#attached']['drupalSettings']` 可以用来存储各种与页面相关的设置，例如自定义模块的配置选项、动态生成的数据、URL路径等等。这些设置可以在JavaScript代码中通过 `Drupal.settings` 对象来访问。

以下是一个示例，展示如何在 Drupal 9.5 中使用 `$variables['#attached']['drupalSettings']` 传递一些动态数据到JavaScript：

```php
function mymodule_preprocess_page(&$variables) {
  // 从后端获取一些设置
  $custom_settings = array(
    'api_url' => 'https://example.com/api',
    'debug_mode' => TRUE,
  );

  // 将设置传递到页面的JavaScript中
  $variables['#attached']['drupalSettings']['mymodule'] = $custom_settings;
}

```

通过使用 `$variables['#attached']['drupalSettings']`，您可以将从服务器端传递到前端的数据整洁地传递给JavaScript代码，从而实现动态性和交互性。