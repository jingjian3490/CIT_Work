可以使用`get()`方法获取字段值：

```php
$field_value = $paragraph->get('field_machine_name')->getValue();
```

此代码会返回一个数组，代表字段的所有值。如果字段只有一个值，您可以使用`$field_value[0]['value']`来直接获取它。

