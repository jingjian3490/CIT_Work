```php
1. 继承AbstractExtension类 (Twig\Extension\AbstractExtension)
2. 实现 getFunctions()函数
3. 编写要在twig中使用的自定义函数
4. 注册服务（注意使用tag）
注意类的位置： modulename/src/ExtendTwig
```
```php
<?php  
  
namespace Drupal\pfemasia_callback;  
  
use Twig\Extension\AbstractExtension;  
use Twig\TwigFunction;  
  
class ExtendTwig extends AbstractExtension{  
  
  public function getFunctions(){  
    return [  
      new TwigFunction('test_twig',[$this,'testTwig']),  
    ];  
 } 
  
  public function testTwig(){  
    return 'true';  
  }  
}
```
注册服务，`twig.extension` 标签告诉 Drupal 该服务是一个 Twig 扩展，需要被加载和应用到 Twig 模板中。
```yml
services:  
  pfemasia_callback.twig.ExtendTwig:  
    class: Drupal\pfemasia_callback\ExtendTwig  
    tags:  
      - { name: twig.extension }
```
使用
```twig
{% set test = test_twig() %}  
{{ test }}
```