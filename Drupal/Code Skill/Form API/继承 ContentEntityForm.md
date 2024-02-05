#### Case
```php
<?php  
  
namespace Drupal\eventhub_register\Form;  
  
use Drupal\Core\Entity\ContentEntityForm;  
use Drupal\Core\Form\FormStateInterface;  
  
/**  
 * Form controller for the event hub register entity edit forms. 
 */
class PreRegistrationForm extends ContentEntityForm {  
  
  /**  
   * {@inheritdoc}  
   */  
   public function save(array $form, FormStateInterface $form_state): int {  
    $result = parent::save($form, $form_state);  
    $form_state->setRedirectUrl($this->entity->toUrl());  
    return $result;  
  }  
}
```

  
这个类 `PreRegistrationForm` 是Drupal中一个==自定义内容实体表单的控制器==，它继承了 `ContentEntityForm` 类，这是Drupal核心提供的一个基类，用于处理内容实体的表单操作。具体到这个类，它被用来控制“预注册”实体的编辑表单的行为。

`ContentEntityForm` 是Drupal用于内容实体的标准表单控制器基类。继承这个类意味着 `PreRegistrationForm` 可以使用所有 `ContentEntityForm` 的方法和属性。

**save 方法**：
- `save` 方法覆盖了基类中的 `save` 方法。在这个方法中，首先调用 `parent::save($form, $form_state)` 来执行标准的实体保存操作，然后设置表单提交后的重定向URL，通常是重定向到实体自己的URL（也就是保存实体后应该跳转到的页面）。
- `parent::save($form, $form_state)` 返回的是==保存操作的结果状态==，例如实体是否是新创建的或者已经更新，通常对应 `SAVED_NEW` 或 `SAVED_UPDATED` 这样的常量。
- `$form_state->setRedirectUrl($this->entity->toUrl())` 是设置保存后的重定向。`$this->entity->toUrl()` 方法将实体转换为URL对象，这样用户在保存实体后会被重定向到实体的标准页面上，比如一个节点的查看页面或用户的编辑页面。

`$form_state->setRedirectUrl($this->entity->toUrl())` 这行代码设置了表单提交后的重定向目标，但==并不立即执行重定向==。实际的重定向操作会在表单提交处理完成后发生，通常是在表单构建、验证和提交流程都完成后，Drupal的响应系统会处理 `$form_state` 中的重定向。