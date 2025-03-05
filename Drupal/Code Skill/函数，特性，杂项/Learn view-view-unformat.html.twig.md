```php
view-view-unformat 操作是是view的一行（row）数据

一行就包括了这个view的所有字段
```
![[Pasted image 20230811175513.png]]

### 如何 view 的打印具体字段([[根据dump打印目标值]])
```php
先打印 row 
{{ dump（row）}}

打印结果如下：
```
![[Pasted image 20230811175836.png]]

```php
我们要取的数据是 article 和 13，则取值方法为

row.content['#row'].node_field_data_type_1
row.content['#row'].node_field_data_type

```


