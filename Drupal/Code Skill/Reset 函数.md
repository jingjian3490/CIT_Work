注意关联数组
```php
在 PHP 中，`reset()` 函数用于将数组的内部指针指向数组的第一个元素，并返回该元素的值。这在需要遍历数组时，可以用来重新开始遍历或者获取数组的第一个元素。

- 如果成功将内部指针指向数组的第一个元素，则返回该元素的值。
- 如果数组为空，则返回 `false`。

对于关联数组，`reset()` 函数的使用方法与索引数组基本相同。它会将数组的内部指针指向数组的第一个元素，并返回该元素的值。下面是在关联数组中使用 `reset()` 函数的示例：

$person = array(
    "name" => "John",
    "age" => 30,
    "city" => "New York"
);

// 将内部指针指向第一个元素并返回其值
$firstValue = reset($person);
echo $firstValue;  // 输出: John

使用 `reset()` 函数后，数组的内部指针会指向第一个元素。在遍历关联数组时，你可以使用 `foreach` 循环来逐个获取键和值：

foreach ($person as $key => $value) {
    echo "Key: $key, Value: $value\n";
}

**

- Adverse event : [IDN.AEReporting@pfizer.com](mailto:IDN.AEReporting@pfizer.com) 
- Medical Information : [INDONESIAMI@pfizer.com](mailto:INDONESIAMI@pfizer.com)
- Contact Medical Affairs : [click here](mailto:indonesiami@pfizer.com?subject=Permintaan%20untuk%20dihubungi%20oleh%20Medical%20Affairs%20Scientist&body=Silahkan%20isi%20pertanyaan%20–%20pertanyaan%20di%20bawah%20ini,%20setelah%20tanda%20kurung%0D%0ANama%20dan%20gelar:%0D%0ANomor%20telepon:%0D%0AWaktu%20dan%20jam%20untuk%20dihubungi:%0D%0AEmail:%0D%0ABidang%20Terapeutik:%20(Silakan%20pilih:%20Onkologi/Anti-Infeksi-Anti-Fungi/Vaksin/Internal%20Medicine/Imunologi-Inflamasi/Rare%20Disease/COVID-19)%20%20%0D%0A%0D%0A)  
- General Information :
PT Pfizer Indonesia  
28th Floor World Trade Center 3  
Jl. Jend. Sudirman Kav.29-31,   
Jakarta 12920, Indonesia  
Telp: +62-21-8086 1400**
```
