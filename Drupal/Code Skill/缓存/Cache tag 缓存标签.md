## Summary
在Drupal中，可以在缓存数据时添加缓存标签，这样就可以在之后根据这些标签来无效化或清除相关的缓存。

在Drupal中，==缓存标签是一种缓存无效化的机制==，它允许你指定某块内容（如一个页面、视图、块或实体）何时需要刷新。当你编辑或更新了内容时，Drupal会检查哪些缓存标签与被编辑的内容相关联，并清除所有带有这些标签的缓存。这样，下次用户访问相应的页面时，他们将看到更新后的内容。
##### 设置带缓存标签的缓存
```php
// 这是您想要缓存的数据。
$cached_data = [
  // ...您的数据数组
];
// 缓存标签数组，您可以根据需要添加多个标签。
$cache_tags = ['attendee_list', 'node:123'];
// 使用Cache API设置缓存。
\Drupal::cache('my_custom_bin')->set('my_cache_key', $cached_data, Cache::PERMANENT, $cache_tags);
```
`my_custom_bin` 是您选择存储缓存的缓存池（也称为缓存bin）。
`my_cache_key` 是您存储数据所使用的键。
`$cached_data` 是您实际想要缓存的数据。
`Cache::PERMANENT` 指定这个缓存条目应该被永久存储，直到它被明确清除。
`$cache_tags` 是与这个缓存条目相关联的缓存标签数组。
##### 无效化缓存标签
当您更新了与缓存数据相关的内容，您可能需要无效化这些缓存，以确保用户看到的是最新的数据。您可以通过调用 `Cache::invalidateTags()` 方法来做到这一点：
```php
// 当您需要无效化缓存时，使用相同的缓存标签。
$invalidation_tags = ['attendee_list'];
// 无效化缓存。
Cache::invalidateTags($invalidation_tags);
```
`Cache::invalidateTags($invalidation_tags)` 是Drupal缓存API的一部分，用于手动无效化（invalidate）指定的缓存标签（cache tags）。当你调用这个方法时，Drupal会标记所有包含这些指定缓存标签的缓存条目为无效，这意味着这些缓存条目虽然仍然存在于缓存中，但不会再被视为有效数据，下次请求需要使用这些缓存数据时，系统会重新生成这些数据而不是使用缓存中的旧数据。

## 主要添加缓存标签的方法
1. 代码中添加
2. 渲染数组
```php
$build['#cache']['tags'][] = 'my_custom_tag';
```
3.  Views的缓存标签，Drupal自动添加配置，在view的配置页面

##### 通过打印视图上下文信息，查看缓存标签
```php
/**
 * Implements hook_views_pre_render().
 */
function mymodule_views_pre_render(ViewExecutable $view) {
  if ($view->storage->id() == 'attendee_report') {
    $cache_tags = $view->getCacheTags();
    // Print the cache tags to the messages area on the website.
    // Please note that this is for debugging purposes only and should
    // not be used on a production site.
    \Drupal::messenger()->addMessage('Cache Tags: ' . implode(', ', $cache_tags));

    // Alternatively, you can log the cache tags to the Drupal log.
    \Drupal::logger('mymodule')->notice('Cache Tags: ' . implode(', ', $cache_tags));
  }
}
```
出现多个缓存标签的情况是正常的，这反映了Drupal缓存系统的复杂性和灵活性。