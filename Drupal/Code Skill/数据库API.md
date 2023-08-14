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

#### 概述

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

#### 动态查询添加字段
==单个字段==
```php
$title_field = $query->addField('n', 'title', 'my_title');
```
查询选择别名为“n”的表的“title”字段，并为其指定别名“my_title”。如果未指定别名，将自动生成一个别名。“n_title”。如果该别名已存在，例如“n_title_2”。

==多个字段==
```php
$query->fields('n', ['nid', 'title', 'created', 'uid']);
```
相当于调用 addField（） 四次，每个字段一次。但是，fields（） 不支持为字段指定别名。使用空的第二个参数调用 fields（） 将导致“SELECT *”查询。不鼓励使用 SELECT *。

==使用 fetchField 仅返回一个字段==
```php
只返回Title字段

$query = $connection->select('node', 'n');
$query->condition('n.nid', 123);
$query->addField('n', 'title');
$result = $query->execute();
return $result->fetchField();
```


#### 连接查询

要连接另一个表，请使用 join（）、innerJoin（）、leftJoin（） 或 addJoin（） 方法，如下所示：
```php
// Example of a SELECT query which joins the {node} table to both the {node_field_data} and {users} tables.
$query = $connection->select('node', 'n', $options);
$query->join('node_field_data', 'nfd', 'n.nid = nfd.nid AND nfd.status = :status', array(':status' => 1));
$table_alias = $query->join('users', 'u', 'n.uid = u.uid AND u.uid = :uid', array(':uid' => 5));
```
上面的指令将针对“user”表添加一个INNER JOIN（默认连接类型），该表将获得别名“u”。连接将在条件 “n.uid = u.uid AND u.uid = ：uid” 时打开，其中 ：uid 的值为 5。请注意使用预准备语句片段。这允许以安全的方式添加变量连接语句。==切勿==将文本值或变量直接放入查询片段中，就像永远不要将文本和变量直接放入静态查询中一样（它们可能导致 SQL 注入漏洞）。

右加入在Drupal 9.0.0中删除

联接方法的返回值是已分配==表的别名==。如果指定了别名，则将使用该别名，除非在极少数情况下别名已被其他表使用。在这种情况下，系统将分配不同的别名。

#### 计数查询
任何查询都可以具有相应的“计数查询”。count 查询返回原始查询中的行数。若要从现有查询（实现 SelectInterface 的选择查询对象）获取计数查询，请使用 countQuery（） 方法。

```php
$count_query = $query->countQuery();
```

$count_query 现在是一个新的动态选择查询，没有排序限制，执行时将返回只有一个值的结果集，即与原始查询匹配的记录数。由于 PHP 支持在返回的对象上链接方法，因此以下习惯用法是一种常用方法：

```php
$num_rows = $query->countQuery()->execute()->fetchField();
```

对于实体查询（实现 QueryInterface），代码略有不同：

```php
$num_rows = $query->count()->execute();
```


#### 过滤重复
某些 SQL 查询可能会产生重复的结果。在这种情况下，可以在静态查询中使用“DISTINCT”**关键字**过滤掉重复的行。在动态查询中，使用 distinct（） **方法**。

```php
// Force filtering of duplicate records in the result set.
$connection = \Drupal::database();
$query = $connection->select('my_table', 'mt');
$query->fields('mt', ['my_fields']);
$query->distinct()->execute()->fetchAll();
```
请注意，DISTINCT 可能会降低性能，因此不要使用它，除非没有其他方法可以限制结果集以避免重复。

#### 分组查询

若要按给定字段分组，请使用 `groupBy()` 该方法。

```php
$query->groupBy('uid');
```

上面的代码将指示查询按 uid 字段分组。请注意，此处的字段名称应是  `addField()` 或者 `addExpression()` 方法创建的别名，因此在大多数情况下，您需要在此处使用这些方法的返回值来确保使用正确的别名。

