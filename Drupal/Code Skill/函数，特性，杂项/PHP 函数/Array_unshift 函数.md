`array_unshift` 是 PHP 中的一个内置函数，用于==在数组的开头插入一个或多个元素==。这个函数==直接修改原数组==，而不是返回一个新数组。使用 `array_unshift` 可以很方便地在数组的前面添加元素，同时保持现有元素的顺序。
### 使用方式
```php
int array_unshift(array &$array, mixed $value1, mixed $value2 [, mixed $... ])
```
- **`$array`**：指定要操作的数组，传递的是引用，因此原数组会被修改。
- **`$value1, $value2, ...`**：==一个或多个要添加到数组开头的值==。可以添加任意数量的值，每个值都将按照函数调用中出现的顺序添加到数组的开头。
### 返回值
`array_unshift` 函数执行后，返回数组中==元素的总数==。
### 使用示例
```php
$queue = ["orange", "banana"];
array_unshift($queue, "apple", "raspberry");
print_r($queue);
```
上述代码会输出：
```csharp
Array
(
    [0] => apple
    [1] => raspberry
    [2] => orange
    [3] => banana
)
```
这说明 "apple" 和 "raspberry" 被成功添加到了数组 `$queue` 的开头，原来的元素 "orange" 和 "banana" 被顺次推后。
### 注意事项
- **性能考虑**：对于非常大的数组，使用 `array_unshift` 可能会影响性能，因为它需要移动数组中已有的每个元素。如果性能是关键考虑因素，可能需要寻找其他解决方案。
- **操作原数组**：由于 `array_unshift` 是直接修改原数组（因为数组是通过引用传递的），所以不需要将结果赋值给原数组。
- **多类型值**：可以向数组开头添加任意类型的值，包括字符串、整数、浮点数、对象或其他数组。

`array_unshift` 是处理数组时非常有用的工具，尤其是在需要维护元素顺序的情况下添加新元素时。
