所有插入、更新、删除和合并查询都必须是动态的。选择查询可以是静态查询，也可以是动态查询。因此，“动态查询”一般是指动态选择查询。
## 静态查询

###### 直接数据库语言查询，不推荐。
```php
$result = $database->query("SELECT example FROM {mytable} WHERE type = :type", [
  ':type' => 'mytype',
]);
```

###### 占位符
```php
三个result相等

$result = $database->query("SELECT * FROM {mytable} WHERE id IN (:ids[])", [':ids[]' => [13, 42, 144]]);

$result = $database->query("SELECT * FROM {mytable} WHERE id IN (:ids_1, :ids_2, :ids_3)", [
  ':ids_1' => 13, 
  ':ids_2' => 42, 
  ':ids_3' => 144,
]);

$result = $database->query("SELECT * FROM {mytable} WHERE id IN (13, 42, 144)");
```


## 动态查询

假设我们要创建一个动态查询，它大致等同于以下静态查询。

```php
$result = $database->query("SELECT uid, name, status, created, access FROM {users_field_data} u WHERE uid <> 0 LIMIT 50 OFFSET 0");
```

动态查询将使用以下代码。

```php
// Create an object of type Select and directly add extra detail
// to this query object: a condition, fields and a range.
$query = $database->select('users_field_data', 'u')
  ->condition('u.uid', 0, '<>')
  ->fields('u', ['uid', 'name', 'status', 'created', 'access'])
  ->range(0, 50);
```

生成查询后，调用 `execute()` 以编译并运行查询。

```php
$result = $query->execute();
```

该方法 `execute()` 将返回与 返回 `$database->query()` 的结果集/语句对象相同的结果集/语句对象;它可以以完全相同的方式迭代或获取。

```php
$result = $query->execute();
foreach ($result as $record) {
  // Do something with each $record.
  // A field named `field_1` in $record is accessible via `$record->field_1`.
}
```

#### Debugging 调试
若要检查查询对象生成的 SQL 查询，请打印查询对象。要检查参数，请查看 返回 `arguments()` 的数组。

```php
echo $query;
print_r((string) $query);
print_r($query->arguments());
```


