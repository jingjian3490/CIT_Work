## Case: drupal-learn --> forcontu_forms module --> simple.php

```php
  public function buildForm(array $form, FormStateInterface $form_state): array {

    $form['color'] = [
      '#type' => 'select',
      '#title' => $this->t('Color'),
      '#options' => [
        0 => $this->t('Black'),
        1 => $this->t('Red'),
        2 => $this->t('Blue'),
        3 => $this->t('Green'),
        4 => $this->t('Orange'),
        5 => $this->t('White'),
      ],
      '#default_value' => 5,
      '#description' => $this->t('Choose a color.'),
    ];

    $color = [
      '#type' => 'select',
      '#title' => $this->t('Color'),
      '#options' => [
        0 => $this->t('Black'),
        1 => $this->t('Red'),
        2 => $this->t('Blue'),
        3 => $this->t('Green'),
        4 => $this->t('Orange'),
        5 => $this->t('White'),
      ],
      '#default_value' => 2,
      '#description' => $this->t('Choose a color.'),
    ];

    $form['container'] = [
      '#type' => 'details',
      '#title' => 'Container',
    ];
    $form['container']['color1'] = $color;

    $element = [];
    $element += [
      '#type' => 'details',
      '#title' => 'Element',
    ];

    $element += [
      'color2' => $color,
    ];
    $form['field_color'] = $element;
  }
```
#### 1. `$form['container']['color1'] = $color;`不是二维数组，本质是为当前数组添加一个 color 的 key，对应的 value 是一个数组，他的效果等于
```php
    $element += [
      'color2' => $color,
    ];
    // 即
    $form['container'] += $color;
```

#### 2. 如果 buildForm 中 color1、color2 也都叫 color，最后 `$form_state->getValue('color')` 的值是是最后一个 color 字段的值
```php
  public function submitForm(array &$form, FormStateInterface $form_state): void {

    if ($form_state->getValue('title') != '1') {
      $color = $form_state->getValue('color');
      $color1 = $form_state->getValue('color1');
      $color2 = $form_state->getValue('color2');
      $this->messenger()->addStatus($color . ' 0');
      $this->messenger()->addStatus($color1 . ' 1');
      $this->messenger()->addStatus($color2 . ' 2');
      return;
    }
  }
```