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