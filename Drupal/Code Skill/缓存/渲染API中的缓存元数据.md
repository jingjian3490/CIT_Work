
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
在Drupal的渲染API中，缓存元数据支持以下主要参数：
1. **keys**：唯一标识缓存条目的键数组。如果提供了这个键，它将确保此元素的缓存条目是唯一的。
2. **contexts**：缓存上下文是一组条件，它们描述了缓存条目==何时会变得无效或者说何时应该切换==。例如，`user.roles`是一个缓存上下文，如果用户的角色改变，任何有这个上下文的缓存都会失效。
3. **tags**：缓存标签允许你指定当某些事件发生时，应该==清除==哪些缓存。例如，如果一个缓存条目有一个`node:1`标签，当节点1被更新时，此缓存条目将被清除。
4. **max-age**：缓存最大有效期限（以秒为单位）。特殊值`Cache::PERMANENT`表示缓存条目应该永久存储，直到显示失效，而`0`表示禁用缓存。

除了这些主要参数，还有一些其他的缓存相关参数：
- **bin**：指定缓存条目应该存储在哪个缓存容器中。
- **immutable**：如果设置为`TRUE`，则表示缓存条目永远不会更改，并且永远不会失效。这仅应用于极端情况。
这些是最常用的缓存元数据参数。在实际应用中，通常会使用`keys`、`contexts`、`tags`和`max-age`这些参数来精确控制缓存行为，以优化网站性能并确保内容的正确性。