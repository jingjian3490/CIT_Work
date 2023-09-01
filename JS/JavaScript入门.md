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

#### JavaScript 错误

```JavaScript
try {
    ...    //异常的抛出
} catch(e) {
    ...    //异常的捕获与处理
} finally {
    ...    //结束处理
}
=====================================================================
var txt=""; 
function message() 
{ 
    try { 
        adddlert("Welcome guest!"); 
    } catch(err) { 
        txt="本页有一个错误。\n\n"; 
        txt+="错误描述：" + err.message + "\n\n"; 
        txt+="点击确定继续。\n\n"; 
        alert(txt); 
    } 
}
```
throw 语句允许我们创建自定义错误。
正确的技术术语是：创建或**抛出异常**（exception）。
如果把 throw 与 try 和 catch 一起使用，那么您能够控制程序流，并生成自定义的错误消息。
```php
function myFunction() {
  var message, x;
  message = document.getElementById("p01");
  message.innerHTML = "";
  x = document.getElementById("demo").value;
  try { 
    if(x == "") throw "值是空的";
    if(isNaN(x)) throw "值不是一个数字";
    x = Number(x);
    if(x > 10) throw "太大";
    if(x < 5) throw "太小";
  }
  catch(err) {
    message.innerHTML = "错误: " + err + ".";
  }
  finally {
    document.getElementById("demo").value = "";
  }
}
```



#### 声明提升

```php
JavaScript 中，变量可以在使用后声明，也就是变量可以先使用再声明。
--------------------------------------
x = 5; // 变量 x 设置为 5

elem = document.getElementById("demo"); // 查找元素 
elem.innerHTML = x;                     
// 在元素中显示 xvar x; // 声明 x
--------------------------------------
声明提升：函数声明和变量声明总是会被解释器悄悄地被"提升"到方法体的最顶部。
```

```php
JavaScript 只有声明的变量会提升，初始化的不会。
以下两个实例结果结果不相同：
-------------------------------------------
var x = 5; // 初始化 x
var y = 7; // 初始化 y
elem = document.getElementById("demo"); // 查找元素 
elem.innerHTML = x + " " + y;           // 显示 x 和 y
-------------------------------------------
var x = 5; // 初始化 x

elem = document.getElementById("demo"); // 查找元素 
elem.innerHTML = x + " " + y;           // 显示 x 和 y

var y = 7; // 初始化 y
-------------------------------------------
JavaScript 严格模式(strict mode)不允许使用未声明的变量
```


#### 注意

```php
switch 语句会使用恒等计算符(===)进行比较:

var x = 10;switch(x) {    
  case "10": alert("Hello");//没有弹窗
}
-------------------------------------------
加法是两个数字相加。
连接是两个字符串连接。
JavaScript 的加法和连接都使用 + 运算符。

var x = 10 + 5;          // x 的结果为 15
var x = 10 + "5";        // x 的结果为 "105"

-------------------------------------------
## 浮点型数据使用注意事项
JavaScript 中的所有数据都是以 64 位**浮点型数据(float)** 来存储。
所有的编程语言，包括 JavaScript，对浮点型数据的精确度都很难确定：

var x = 0.1;
var y = 0.2;
var z = x + y    // z 的结果为 0.30000000000000004
if (z == 0.3)    // 返回 false

为解决以上问题，可以用整数的乘除法来解决：
var x = 0.1;
var y = 0.2;
var z = (x * 10 + y * 10) / 10;       // z 的结果为 0.3

-------------------------------------------
## 数组
使用名字来作为索引的数组称为关联数组(或哈希)。
JavaScript 不支持使用名字来索引数组，只允许使用数字索引。

var person = [];
person[0] = "John";
person[1] = "Doe";
person[2] = 46;
var x = person.length; // person.length 返回 3
var y = person[0];     // person[0] 返回 "John"

var person = [];
person["firstName"] = "John";
person["lastName"] = "Doe";
person["age"] = 46;
var x = person.length;      // person.length 返回 0
var y = person[0];          // person[0] 返回 undefined

定义数组元素，最后不能添加逗号，数组最后一个值的后面添加逗号虽然语法没有问题，但是在不同的浏览器可能得到不同的结果。
var colors = [5, 6, 7,]; //这样数组的长度可能为3 也可能为4。

```



#### 验证表单
```HTML
<script>
function validateForm() {
    var name = document.forms["myForm"]["fname"].value;
	var id = document.getElementById("numb").value;
    if (name == null || name == "") {
        alert("根据name，需要输入名字。");
		if ( name == null || name == "") {
		  alert("根据id，需要输入名字。");
		}
        return false;
    }
}
</script>

<form name="myForm" action="demo_form.php"
onsubmit="return validateForm()" method="post">
名字: <input type="text" name="fname" id = "numb">
<input type="submit" value="提交">
</form>
```

#### this 关键字

面向对象语言中 this 表示当前对象的一个引用。
但在 JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变。
- 在对象方法中，this 表示该方法所属的对象。
```JavaScript
var person = {
  firstName: "John",
  lastName : "Doe",
  id       : 5566,
  fullName : function() {
    return this.firstName + " " + this.lastName;
  }
};

var name = person.fullName  // Doe John
```
- 如果单独使用，this 表示全局对象。
```php
单独使用 this，则它指向全局(Global)对象。
在浏览器中，window 就是该全局对象为 [**object Window**]:
```
- 在函数中，this 表示全局对象。
- 在函数中，在严格模式下，this 是未定义的(undefined)。
- 在事件中，this 表示接收事件的元素。
```HTML
<button onclick="this.style.display='none'">
点我后我就消失了
</button>
```
- 类似 call() 和 apply() 方法可以将 this 引用到任何对象。
```php
## 显式函数绑定
在 JavaScript 中函数也是对象，对象则有方法，apply 和 call 就是函数对象的方法。这两个方法异常强大，他们允许切换函数执行的上下文环境（context），即 this 绑定的对象。

在下面实例中，当我们使用 person2 作为参数来调用 person1.fullName 方法时, **this** 将指向 person2, 即便它是 person1 的方法：

var person1 = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
var person2 = {
  firstName:"John",
  lastName: "Doe",
}
person1.fullName.call(person2);  // 返回 "John Doe"
```



#### 重置变量
```JavaScript
使用 **var** 关键字声明的变量在任何地方都可以修改：
var x = 2;// x 为 2
var x = 3;// 现在 x 为 3

在相同的作用域或块级作用域中，不能使用 **let** 关键字来重置 **var** 关键字声明的变量、不能使用 **var** 关键字来重置 **let** 关键字声明的变量:
let x = 2;       // 合法
let x = 3;       // 不合法
{
    let x = 4;   // 合法
    var x = 5;   // 不合法
}

-------------------------------------------
const 用于声明一个或多个常量，声明时必须进行初始化，且初始化后值不可再修改
const 的本质: const 定义的变量并非常量，并非不可变，它定义了一个常量引用一个值。使用 const 定义的对象或者数组，其实是可变的。下面的代码并不会报错：
// 创建常量对象
const car = {type:"Fiat", model:"500", color:"white"};
// 修改属性:
car.color = "red"; 
// 添加属性
car.owner = "Johnson";

但是我们不能对常量对象重新赋值：
const car = {type:"Fiat", model:"500", color:"white"};
car = {type:"Volvo", model:"EX60", color:"red"};    // 错误
```




##### JSON

```php
- JSON 英文全称 JavaScript Object Notation

JSON 格式在语法上与创建 JavaScript 对象代码是相同的。
由于它们很相似，所以 JavaScript 程序可以很容易的将 JSON 数据转换为 JavaScript 对象。

**JSON 语法规则**
- 数据为 键/值 对。
- 数据由逗号分隔。
- 大括号保存对象
- 方括号保存数组
```

```JavaScript
JSON 是 JS 对象的字符串表示法。它使用文本表示一个 JS 对象的信息，（JSON）本质是一个字符串。如：

var obj = {a: 'Hello', b: 'World'};   //这是一个js对象，
var json = '{"a": "Hello", "b": "World"}'; //这是一个（JSON） 字符串，

JSON（格式字符串） 和 JS 对象互转（JSON.parse 和 JSON.stringify）。

要实现从JSON字符串转换为JS对象，使用 JSON.parse() 方法：

var obj = JSON.parse('{"a": "Hello", "b": "World"}'); 
//结果是 {a: 'Hello', b: 'World'}  一个对象

要实现从JS对象转换为JSON字符串，使用 JSON.stringify() 方法：

var json = JSON.stringify({a: 'Hello', b: 'World'}); 
//结果是 '{"a": "Hello", "b": "World"}'  一个JSON格式的字符串

说句不严谨的话：JSON.parse() 就是**字符串**转 **js 对象**， JSON.stringify()就是 **js 对象**转**字符串**，它们前提是要 json 格式才有意义。
```




#### 自调用函数

```php
函数表达式可以 "自调用"。
自调用表达式会自动调用。
如果表达式后面紧跟 () ，则会自动调用。
(function () {var x = "Hello!!";}) ();
```

#### 箭头函数

```php
(参数1, 参数2, …, 参数N) => { 函数声明 }

(参数1, 参数2, …, 参数N) => 表达式(单一)
// 相当于：(参数1, 参数2, …, 参数N) =>{ return 表达式; }

当只有一个参数时，圆括号是可选的：
(单一参数) => {函数声明}
单一参数 => {函数声明}

-------------------------------------------
// ES5
var x = function(x, y) {
     return x * y;
}
 
// ES6
const x = (x, y) => x * y;
```

#### 闭包

```php
变量 **add** 指定了函数自我调用的返回字值。
自我调用函数**只执行一次**。设置计数器为 0。**并返回函数表达式。**
 **闭包。**它使得函数拥有私有变量变成可能。

let count = function () {  
  let counter1 = 0;  
  return function () {  
    counter1 += 1;  
    console.log(counter1);  
  };}();  
// console.log(counter1);  
count();  
// console.log(counter1);  
count();  
// console.log(counter1);  
count();  
// console.log(counter1);

```

#### 回调
回调是作为参数传递给另一个函数的函数。

```JavaScript
function displayer(some) {
  document.getElementById("demo").innerHTML = some;
}

function calculator(num1, num2, callback) {
  let sum = num1 + num2;
  callback(sum);
}

calculator(5, 5, displayer);
```

#### 异步的 JavaScript
```php
`setTimeout` 是 JavaScript 中用于设置一个定时器的函数
它允许您在一定的延迟之后执行一段指定的代码。这在实现定时任务、延迟执行以及一些动画效果等方面非常有用。

`setTimeout` 函数的语法如下：
setTimeout(callback, delay, arg1, arg2, ...);

- `callback`：要执行的函数或代码块。
- `delay`：延迟时间，以毫秒为单位，表示从现在开始等待多少毫秒后执行 `callback`。
- `arg1, arg2, ...`：可选的参数，传递给 `callback` 函数
```