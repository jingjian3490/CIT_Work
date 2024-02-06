## 表单状态构建信息
表单状态对象（`FormStateInterface $form_state`）在Drupal表单API中扮演着核心角色。它存储了表单的状态，数据和方法，并在整个表单构建和处理过程中提供了必要的信息。
#### 构建信息的定义和设置
构建信息是`$form_state`对象的一个==数组属性==，包含了用于构建表单的相关数据。这些信息可以包括：
- 表单构建时传递的==参数==。
- 处理表单提交和验证的回调函数。
- 表单构建过程中计算出的值或需要共享的数据。
构建信息通常在表单相关的钩子函数（如`hook_form()`或`hook_form_alter()`）或自定义表单类的`buildForm`方法中被设置。
#### 示例：设置和获取构建信息
构建信息可通过控制器设置并在表单类中获取：
```php
// 在控制器中设置构建信息
return \Drupal::formBuilder()->getForm(AttendForm::class, [
  'event' => $event
]);

// 在AttendForm类的buildForm方法中获取构建信息
$args = $form_state->getBuildInfo()['args'];
$event = $args[0]['event'] ?? NULL;

```
## 在form中使用内联模板  [[inline_template 内联模板]]
#### 示例：内联模板在表单构建中的使用
```php
$form['header'] = [
  '#type' => 'inline_template',
  '#template' => '<div class="form-header">{% if logged_in == false %} ... {% endif %}</div>',
  '#context' => [
    'logged_in' => \Drupal::currentUser()->isAuthenticated(),
    // 其他上下文变量...
  ],
];
```
