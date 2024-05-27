使用 `label_attributes` 属性可以为 Form 字段的 Title 添加 class，且 `form-required` 这个 class 是Drupal 自带的，就是代表必填的红色 * 号
```PHP
    $form['date-container']['date'] = [
      '#type' => 'date',
      '#title' => $this->t('Date'),
      '#label_attributes' => [
        'class' => [
          'form-required',
        ],
      ],
      '#default_value' => $now->format('Y-m-d'),
      '#disabled' => TRUE,
    ];
```

但对 Radios 类型的 Form 字段没有用，只能使用字符串拼接将 class 直接添加在 Title 属性中。
```PHP
    $form['fields_wrapper']['switched_from'] = [
      '#type' => 'radios',
      '#title' => $this->t('<p class = "form-required">Have you switched to another treatment?</p>'),
      '#options' => [
        STATUS_YES => $this->t('Yes'),
        STATUS_NO => $this->t('No'),
      ],
    ];
```
