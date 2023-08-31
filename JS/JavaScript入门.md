#### Start

```JavaScript
number
不区分小数和整数
NaN //not a number 
Infiniti //无限大

比较运算符
==   等于（类型不一样，值一样，返回 true）
===  绝对等于（类型不一样，值一样，返回 false）

NaN === NaN  false
isNaN（NaN）  true
（1/3）==（1-1/3） false，精度损失

Math.abs() //取绝对值
null 和 undefined

var arr = [1,'hello',3.2]; //数组不分类型 
new arr(1.2,2); //无下标越界异常，undefined

对象
var person{
 name："cnae",
 age:"3",
 arr:[1,2]             //最后一个不用 ，
}
```

#### 严格检查模式
![[Pasted image 20230831153643.png]]

#### JavaScript 对象是变量的容器
![[Pasted image 20230831171646.png]]
![[Pasted image 20230831171752.png]]
![[Pasted image 20230831171832.png]]
![[Pasted image 20230831171948.png]]


#### 函数
![[Pasted image 20230831172143.png]]

#### 事件
![[Pasted image 20230831172816.png]]
![[Pasted image 20230831173043.png]]
 [JavaScript 参考手册 - HTML DOM 事件](https://www.runoob.com/jsref/dom-obj-event.html)![[Pasted image 20230831173238.png]]
 


#### 字符串

```php
在 JavaScript 中，字符串写在单引号或双引号中。
以下实例 JavaScript 无法解析：
 "We are the so-called "Vikings" from the north."  

字符串 "We are the so-called " 被截断。
可以使用反斜杠 (\) 来转义 "Vikings" 字符串中的双引号，如下:
 "We are the so-called \"Vikings\" from the north."

可以在字符串中使用引号，字符串中的引号不要与字符串的引号相同


|\n|换行|
|\r|回车|
|\t|tab(制表符)|
|\b|退格符|
|\f|换页符|

不要创建 String 对象。它会拖慢执行速度，并可能产生其他副作用
var x = "John";              
var y = new String("John");
(x === y) // 结果为 false，因为 x 是字符串，y 是字符串对象

|split()|把字符串分割为子字符串数组|
|concat()|连接两个或多个字符串，返回连接后的字符串|
|trim()|移除字符串首尾空白|
```
![[Pasted image 20230831174910.png]]


#### 运算符

```php

x+=y 等于 x=x+y

txt1="What a very"; 
txt2="nice day"; 
txt3=txt1+" "+txt2;//字符串可以加

```