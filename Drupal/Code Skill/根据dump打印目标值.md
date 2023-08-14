**view的row**
```php
在view-view-unformat.html.twig文件 先打印 row 
{{ dump（row）}}

打印结果如下：
```
![[Pasted image 20230811175836.png]]
```php
我们要取的数据是 article 和 13，则取值方法为

row.content['#row'].node_field_data_type_1
row.content['#row'].node_field_data_type

```

**view的result**
```php
在 .module文件 先打印view的result

$result = views_get_view_result('dashboard_total_content', 'content');  
dump($result);
```
![[Pasted image 20230814171116.png]]
```php
因为 这里是一个标准（0~n）的关联数组 or 这里在 .module 文件，不在twig文件 ？

foreach ($result as $value) {  
  $node_field_data_type = $value->node_field_data_type;  
  $node_field_data_type_1 = ucfirst($value->node_field_data_type_1);  
  $settings[] = [$node_field_data_type_1 , $node_field_data_type];  
}

所以这里不能用 $value 不能用.node_field_data_type，而使用 ->node_field_data_type

ucfirst() 函数，PHP内置，将字符串的第一个字母大写。

遍历关联数组用 foreach

```