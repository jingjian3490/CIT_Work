```.
本地存储是一个window的属性，包括localStorage和sessionStorage，从名字应该可以很清楚的辨认二者的区别，前者是一直存在本地的，后者只是伴随着session，窗口一旦关闭就没了。二者用法完全相同。
```

```js
localStorage.a = 3;   //设置a为"3"  
localStorage["a"] = "sfsf";  //设置a为"sfsf"，覆盖上面的值  
localStorage.setItem("b","isaac");  //设置b为"isaac"  

var a1 = localStorage["a"];  //获取a的值  
var a2 = localStorage.a;   //获取a的值  
var b = localStorage.getItem("b");  //获取b的值  
localStorage.removeItem("c");  //清除c的值

这里最推荐使用的自然是getItem()和setItem()，
清除键值对使用removeItem()。
如果希望一次性清除所有的键值对，可以使用clear()。

可以将一个属性的值设置为JSON格式，使用时可便捷转换
(function($, Drupal) {  
  let flag = false;  
  function getProfileInfo() {  
    const grvProfile = localStorage.getItem('pfizerGrvProfile');  
    /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */  
    try {  
      const { givenName, familyName, designationSpecialty } = JSON.parse(grvProfile);  
      flag = true;  
      // 使用localStorage的数据进行一些操作  
    } catch {}  
  }  // 没0.5秒执行一次函数，直到获取到localStorage数据  
  const internalId = setInterval(getProfileInfo, 500);  
  if (flag) {  
    clearInterval(internalId);  
  }
})(jQuery, Drupal);
```
![[Pasted image 20230907154901.png]]


