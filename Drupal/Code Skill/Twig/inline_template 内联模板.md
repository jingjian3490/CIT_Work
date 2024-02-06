内联模板提供了一种在Drupal中直接使用Twig模板代码的方式，而无需创建独立的模板文件。这适用于需要动态生成标记的场合。
#### 使用内联模板的优点
- 灵活性：允许在渲染数组中直接定义小型的Twig模板。
- 轻量级：避免了为简单模板创建单独文件的需求。
- 便捷性：适用于不需要重用的简单逻辑。
#### 示例：内联模板在表单构建中的使用
```php
$form['header'] = [
  '#type' => 'inline_template',
  '#template' => '<div class="form-header">{% if logged_in == false %} ... {% endif %}</div>',
  '#context' => [
    'logged_in' => \Drupal::currentUser()->isAuthenticated(),
    // 其他上下文变量...
  ],
];
```
#### 控制器中的内联模板使用
内联模板也可以在控制器中使用，以返回包含动态内容的渲染数组：
```php
public function myPage() {
  return [
    'my_inline_template' => [
      '#type' => 'inline_template',
      '#template' => '<div>{{ message }}</div>',
      '#context' => [
        'message' => $this->t('Hello, World!'),
      ],
    ],
  ];
}
```

#### Inline_template 中的 Cache 
Inline_template 最后也是渲染数组，可以用 Cache 属性。
```php
$build['my_cached_template'] = [
  '#type' => 'inline_template',
  '#template' => '<div>{{ my_dynamic_content }}</div>',
  '#context' => [
    'my_dynamic_content' => $dynamic_content,
  ],
  '#cache' => [
    'keys' => ['my_unique_cache_key'],
    'contexts' => ['user', 'session', 'url'],
    'tags' => ['my_custom_cache_tag'],
    'max-age' => 3600,
  ],
];
```

## Reference
[[inline_template 内联模板]]
[[渲染API中的缓存元数据]]