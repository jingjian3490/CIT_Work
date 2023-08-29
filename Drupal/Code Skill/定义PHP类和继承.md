源于pfemasia的notification模块

## 类的定义

```php

<?php  
  
namespace Drupal\notification_services;  
  
/**  
 * Notification. 
 * 
 */
 class Notification {  
  
  // Notification type value.  
  const NOTIFICATION_TYPE_EMAIL = 1;  
  
  /**  
   * Notification type.   
   *   
   * @var int  
   */  
   public $type;  
  
  /**  
   * Template key.   
   *   
   * @var string  
   */  
   public $templateKey;  
  
  /**  
   * The target address.   
   *   
   * @var string  
   */  
   public $receiver;  
  
  /**  
   * The data to be fill into the template.   
   *   
   * @var array  
   */  
   public $data;  
  
  /**  
   * Whether to combine the footer.   
   *   
   * @var bool  
   */  
   public $combineFooter;  
  
  /**  
   * Notification constructor..   
   *   
   * @param int $type  
   *   Notification type , should be email or sms.  
   * @param string $templateKey  
   *   Template key.  
   * @param string $receiver  
   *   The target address.  
   * @param array $data  
   *   Data to fill into the template.  
   * @param bool $combineFooter  
   *   Whether to combine the footer.  
   */  
   public function __construct(  
    int $type,  
    string $templateKey,  
    string $receiver,  
    array $data,  
    bool $combineFooter = TRUE) {  
    $this->type = $type;  
    $this->templateKey = $templateKey;  
    $this->receiver = $receiver;  
    $this->data = $data;  
    $this->combineFooter = $combineFooter;  
  }  
}

```
###### 构造函数：
```php
__construct构造函数将接收到的参数赋值给类的属性，以便在类的实例化过程中使用，如

$notification = new \Drupal\notification_services\Notification(
  \Drupal\notification_services\Notification::NOTIFICATION_TYPE_EMAIL,
  'template_key',
  'receiver@example.com',
  ['name' => 'John Doe', 'message' => 'Hello'],
  true
);

```


## 类的继承

```php

<?php  
namespace Drupal\notification_services;  
class UserNotification extends Notification {  
  public $userId;  
  public function __construct(  
    int $userId,  
    int $type,  
    string $templateKey,  
    array $data,  
    string $receiverRole,  
    bool $combineFooter = FALSE) {  
  
    $this->userId = $userId; 
     
    parent::__construct(  
      $type,  
      $templateKey,  
      '',  
      $data,  
      $receiverRole,  
      $combineFooter  
    );  
  }  
}

```
#### NOTE：
```php
在构造方法内部，"userId"属性被赋予传入的参数值。

然后，使用"parent::__construct()"语法 调用 父类的构造方法，传入其余的参数。
"receiver"属性被设置为空字符串，
"combineFooter"属性被设置为传入的参数值。
```
