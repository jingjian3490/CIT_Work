`extract` 是 PHP 中的一个内置函数，它用于从数组中将变量导入到当前的符号表中。这意味着，通过 `extract` 函数，你可以将一个==关联数组==中的键转换成与键名相同名称的变量，并且这些变量的值将会是对应于数组中的值。

#### 使用方法
```php
int extract(array $array, int $flags = EXTR_OVERWRITE, string $prefix = null)
```
#### 参数详解
- **`$array`**: 必须是一个关联数组，`extract` 函数会遍历这个数组，并创建变量，变量名是数组的键，变量值是数组的值。
- **`$flags`**: 控制如何处理提取出的变量，常用的值有：
    - `EXTR_OVERWRITE`: 如果存在同名的变量，则覆盖它们。
    - `EXTR_SKIP`: 如果存在同名的变量，则跳过不覆盖。
    - `EXTR_PREFIX_SAME`: 如果存在同名的变量，则给新的变量加上前缀。
    - `EXTR_PREFIX_ALL`: 给所有的变量名加上前缀。
    - `EXTR_PREFIX_INVALID`: 仅给非法/数字的变量名加上前缀。
    - `EXTR_IF_EXISTS`: 仅覆盖已经存在于当前符号表中的变量。
- **`$prefix`**: 用于在生成的变量名前加上一个前缀，以避免变量名冲突。这个参数只在使用了特定的 `$flags` 时才有效。
#### 返回值
返回成功导入到符号表中的变量个数。可以直接使用，不要返回值 `extract($array)` 。

#### 使用示例
```php
$data = [
  'name' => 'John Doe',
  'email' => 'john.doe@example.com',
  'age' => 30
];

extract($data);

// 现在可以直接访问 $name, $email, 和 $age
echo $name; // 输出 'John Doe'
echo $email; // 输出 'john.doe@example.com'
echo $age; // 输出 30

```