如果进行了一些，浏览器会将用户名和密码自动填充。但有时候我们不希望，比如创建新用户，并为新用户创建密码时。
将 `autocomplete` 的值设置为 `new-password` 可以有效解决。
```PHP
    $form['pass-container']['pass'] = [
      '#type' => 'password',
      '#title' => t('Password'),
      '#required' => TRUE,
      '#attributes' => ['autocomplete' => 'new-password'],
    ];
```
Set as  `off` is not take effect。
```PHP
    $form['pass-container']['confirm_password'] = [
      '#type' => 'password',
      '#title' => t('Confirm password'),
      '#required' => TRUE,
      '#attributes' => ['autocomplete' => 'off'],
    ];
```
