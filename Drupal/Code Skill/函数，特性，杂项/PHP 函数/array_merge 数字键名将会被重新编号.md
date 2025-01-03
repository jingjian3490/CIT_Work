## 单一结构的 array_merge() 示例

```php
<?php  
$array1 = array();  
$array2 = array(1 => "data");  
$result = array_merge($array1, $array2);  
?>
```

别忘了==数字键名将会被重新编号==！

```php
Array
(
    [0] => data
)
```

如果你想==完全保留原有数组==并只想==新的数组附加到后面==，可以使用 `+` 运算符：

```php
<?php  
$array1 = array(0 => 'zero_a', 2 => 'two_a', 3 => 'three_a');  
$array2 = array(1 => 'one_b', 3 => 'three_b', 4 => 'four_b');  
$result = $array1 + $array2;  
var_dump($result);  
?>
```

第一个数组的键名将会被保留。在两个数组中存在==相同的键名==时，==第一个==数组中的同键名的==元素将会被保留==，第二个数组中的元素将会被忽略。

```php
array(5) {
  [0]=>
  string(6) "zero_a"
  [2]=>
  string(5) "two_a"
  [3]=>
  string(7) "three_a"
  [1]=>
  string(5) "one_b"
  [4]=>
  string(6) "four_b"
}
```