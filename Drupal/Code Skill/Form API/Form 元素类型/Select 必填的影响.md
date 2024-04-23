在Drupal表单API中，如果你的选择字段（select field）设置为必填（`#required => TRUE`），Drupal会自动添加一个 `- Select -` 选项作为默认选项。这是为了强制用户从下拉菜单中选择一个值，因为必填字段不能留空。这个默认选项通常没有值（或者有一个空的值），用来提示用户需要进行选择。

### 解决办法

如果你不希望在选择列表中看到额外的 `- Select -` 选项，并且已经有一个默认的提示选项（例如你的 `EMPTY_VALUE` 选项），你可以通过以下几种方法调整：

1. **允许非必填但使用表单验证**:
   修改字段为非必填，然后通过表单验证确保用户选择了一个有效的选项。这样你就可以完全控制选项列表，包括默认的提示选项。

   ```php
   $form['profile']['gender-container']['field_gender'] = [
     '#type' => 'select',
     '#title' => $this->t('Select your gender:'),
     '#options' => [
       EMPTY_VALUE => $this->t('- Select a value -'),
       '1' => $this->t('Male'),
       '2' => $this->t('Female'),
       '3' => $this->t('Prefer not to say'),
     ],
     '#required' => FALSE,
     '#weight' => ++$weight,
   ];
   ```

   然后在表单提交验证函数中添加检查：

   ```php
   public function validateForm(array &$form, FormStateInterface $form_state) {
       $gender = $form_state->getValue(['profile', 'gender-container', 'field_gender']);
       if ($gender === EMPTY_VALUE) {
           $form_state->setErrorByName('field_gender', $this->t('Please select your gender.'));
       }
   }
   ```

2. **设置默认值**:
```php
$form['profile']['gender-container']['field_gender'] = [  
  '#type' => 'select',  
  '#title' => $this->t('Select your gender:'),  
  '#options' => [  
    EMPTY_VALUE => $this->t('- Select a value -'),  
    1 => $this->t('Male'),  
    2 => $this->t('Female'),  
    3 => $this->t('Prefer not to say'),  
  ],  '#default_value' => '',  
  '#required' => TRUE,  
  '#weight' => ++$weight,  
];
```
设置一个默认值后就不显示 - Select - 了。