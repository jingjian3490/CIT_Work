###### **view的row**
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

嵌套关联数组取值 数组【‘key’】，然后是普通关联数组，使用 .key 获取或 ->key 获取

```

###### **view的result**
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

普通关联数组，使用 .key 获取或 ->key 获取

```


###### 在PHP文件，打印普通关联数组
```php
$response = (array) $response;  
dump($response);  //结果是普通的关联数组
foreach ($response as $obj) {  
//获取普通关联数组的值，直接使用 数组 -> key
  if (isset($obj->container) && $obj->container == 'MP4') {  
    $src = $obj->src;  
  }
}
```
```php
获取普通关联数组的值，直接使用 数组 -> key
```
![[Pasted image 20230822135122.png]]


###### 在PHP文件，打印嵌套数组
```php
$response = (array) $response; 
dump($response);  //结果是嵌套的关联数组
foreach ($response as $obj) {  
//嵌套关联数组取值 数组【‘key’】
  if (isset($obj['container']) && $obj['container'] == 'MP4') {  
    $src = $obj['src'];  
  }
}
```
```php
嵌套关联数组取值 数组【‘key’】
```
![[Pasted image 20230822134548.png]]

### 结果包含实体
要获取实体中的属性，使用get方法，而不能使用数组形式。
![[Pasted image 20230928163731.png]]

![[Pasted image 20230928163711.png]]