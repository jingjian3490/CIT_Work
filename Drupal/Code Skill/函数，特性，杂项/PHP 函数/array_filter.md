`array_filter` 用于过滤数组中的元素。它==通过回调函数对每个元素进行测试，并返回一个包含所有通过测试的元素的新数组==。
### 函数定义

```php
array_filter(array $array, ?callable $callback = null, int $mode = 0): array
```
### 参数

1. **`$array`**：
   - 输入的数组，需要被过滤的数组。

2. **`$callback`**（可选）：
   - 一个回调函数，用于测试数组的每个元素。回调函数应该返回 `true` 或 `false`。
   - 如果没有提供回调函数，`array_filter` 将移除数组中所有等值为 `false` 的元素（例如 `false`、`0`、空字符串 `""`、`null` 等）。

3. **`$mode`**（可选）：
   - 决定传递给回调函数的参数是键还是值。默认是 `0`，==表示传递值==。
   - `ARRAY_FILTER_USE_KEY`：传递键。
   - `ARRAY_FILTER_USE_BOTH`：同时传递键和值。
### 返回值
- 返回一个包含所有通过回调函数测试的元素的新数组。==键名会被保留==。
### 示例

#### 示例 1：使用回调函数

```php
$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 过滤出所有偶数
$even_numbers = array_filter($numbers, function($number) {
    return $number % 2 === 0;
});

print_r($even_numbers);
```

输出：

```php
Array
(
    [1] => 2
    [3] => 4
    [5] => 6
    [7] => 8
    [9] => 10
)
```

#### 示例 2：==没有回调函数==

```php
$values = [0, 1, false, 2, '', 3, null, 4, '0', 5];

// 移除所有等值为 false 的元素
$filtered_values = array_filter($values);

print_r($filtered_values);
```

输出：

```php
Array
(
    [1] => 1
    [3] => 2
    [5] => 3
    [7] => 4
    [9] => 5
)
```

#### 示例 3：使用 `ARRAY_FILTER_USE_KEY`

```php
$users = [
    'alice' => 25,
    'bob' => 30,
    'charlie' => 35,
    'dave' => 40
];

// 过滤出键名长度大于 3 的元素
$filtered_users = array_filter($users, function($key) {
    return strlen($key) > 3;
}, ARRAY_FILTER_USE_KEY);

print_r($filtered_users);
```

输出：

```php
Array
(
    [alice] => 25
    [charlie] => 35
)
```

#### 示例 4：使用 `ARRAY_FILTER_USE_BOTH`

```php
$users = [
    'alice' => 25,
    'bob' => 30,
    'charlie' => 35,
    'dave' => 40
];

// 过滤出键名长度大于 3 且值大于 30 的元素
$filtered_users = array_filter($users, function($value, $key) {
    return strlen($key) > 3 && $value > 30;
}, ARRAY_FILTER_USE_BOTH);

print_r($filtered_users);
```

输出：

```php
Array
(
    [charlie] => 35
)
```

### 总结

`array_filter` 是一个非常灵活和强大的函数，可以用来根据各种条件过滤数组。它可以使用回调函数来测试每个元素，并根据测试结果返回一个新的数组。通过使用 `ARRAY_FILTER_USE_KEY` 和 `ARRAY_FILTER_USE_BOTH` 常量，还可以根据键或键值对进行过滤。