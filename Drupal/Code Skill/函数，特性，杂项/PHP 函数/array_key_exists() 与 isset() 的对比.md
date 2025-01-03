==array_key_exists — 检查数组里是否有指定的键名或索引==
==isset — 检测变量是否已声明并且其值不为 null==

`isset()` 对于数组中为 null 的值不会返回 true，`而 array_key_exists()` 会。

```PHP
<?php
$search_array = array('first' => null, 'second' => 4);

// 返回 false
isset($search_array['first']);

// 返回 true
array_key_exists('first', $search_array);
?>
```