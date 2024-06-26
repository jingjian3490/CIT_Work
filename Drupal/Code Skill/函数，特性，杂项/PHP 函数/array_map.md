`array_map` 用于==将一个回调函数应用到一个或多个数组的每个元素上，并返回一个包含所有结果的新数组==。它非常适合用于对数组中的每个元素进行相同的操作。

### 函数定义

```php
array_map(callable $callback, array $array1, array ...$arrays): array
```

### 参数

1. **`$callback`**：
   - 一个回调函数，用于处理数组的每个元素。==回调函数可以是用户自定义函数或内置函数==。
   - 回调函数接受的参数数量应与传递给 `array_map` 的数组数量相同。

2. **`$array1`**：
   - 第一个输入数组。

3. **`$arrays`**（可选）：
   - 可选的其他输入数组。可以传递多个数组。

### 返回值

- 返回一个包含回调函数处理结果的新数组。新数组的长度等于输入数组中最长的那个。

### 示例

#### 示例 1：对单个数组应用回调函数

```php
$numbers = [1, 2, 3, 4, 5];

// 将每个元素平方
$squared_numbers = array_map(function($number) {
    return $number * $number;
}, $numbers);

print_r($squared_numbers);
```

输出：

```php
Array
(
    [0] => 1
    [1] => 4
    [2] => 9
    [3] => 16
    [4] => 25
)
```

#### 示例 2：对多个数组应用回调函数

```php
$array1 = [1, 2, 3];
$array2 = [4, 5, 6];

// 将两个数组的对应元素相加
$sum_array = array_map(function($a, $b) {
    return $a + $b;
}, $array1, $array2);

print_r($sum_array);
```

输出：

```php
Array
(
    [0] => 5
    [1] => 7
    [2] => 9
)
```

#### 示例 3：使用内置函数作为回调

```php
$strings = [' apple ', ' banana ', ' cherry '];

// 去除每个字符串的前后空白
$trimmed_strings = array_map('trim', $strings);

print_r($trimmed_strings);
```

输出：

```php
Array
(
    [0] => apple
    [1] => banana
    [2] => cherry
)
```

### 使用多个数组

当 `array_map` 处理多个数组时，回调函数会接受来自每个数组的对应元素作为参数。如果数组的长度不同，较短的数组会用 `null` 填充。

```php
$array1 = [1, 2, 3];
$array2 = [4, 5];

// 将两个数组的对应元素相加
$sum_array = array_map(function($a, $b) {
    return $a + $b;
}, $array1, $array2);

print_r($sum_array);
```

输出：

```php
Array
(
    [0] => 5
    [1] => 7
    [2] => 3
)
```

在这个例子中，`$array2` 比 `$array1` 短，所以 `array_map` 会用 `null` 填充缺少的值。结果是 `[3 + null]`，即 `3`。

### 总结

`array_map` 是一个非常灵活和强大的函数，可以用于对数组中的每个元素进行统一的操作。它可以处理一个或多个数组，并将回调函数的结果收集到一个新数组中。通过使用 `array_map`，你可以避免显式的循环，使代码更加简洁和易读。