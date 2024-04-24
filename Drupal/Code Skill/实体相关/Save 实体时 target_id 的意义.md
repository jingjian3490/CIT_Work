## Case
```php
public function submitForm(array &$form, FormStateInterface $form_state): void {  
  try {  
    // Start a new transaction.  
    $transaction = $this->database->startTransaction();  
  
    $data = $form_state->getValues();  
  
    $patient = $this->createUser(ROLE_PATIENT, [  
      'email' => $data['email'],  
      'pass' => $data['pass'],  
      'status' => 0,  
    ]);  
    $date_of_birth = $this->patientService->parseDate($data['date_of_birth']);  
  
    $profile_data = [  
      'field_first_name' => trim($data['field_first_name']),  
      'field_last_name' => trim($data['field_last_name']),  
      'field_mobile_number' => $data['field_mobile_number'], 
      // 注意 
      'field_state' => ['target_id' => $data['field_state']], 
    ];    
   $profile = $this->patientService->saveProfile($patient, $profile_data);
}
```

`'field_state' => ['target_id' => $data['field_state']]`这行代码展示了如何在Drupal实体中设置引用字段的值。

在Drupal中，有一些字段类型是用来==存储对其他实体的引用==的，比如实体引用字段（Entity Reference fields）。这些字段不仅仅保存一个简单的值，而是保存对另一个实体的引用。在数据库层面，这通常通过保存被引用实体的==ID==来实现。在Drupal的实体API中，==这种引用通常通过一个包含`target_id`键的数组来表示，该键对应于被引用实体的ID。==

因此，当您看到如下代码：

```php
'field_state' => ['target_id' => $data['field_state']],
```

==这意味着`field_state`字段是一个实体引用字段==，它==引用了一个ID为`$data['field_state']`的实体==。在这种情况下，`$data['field_state']`应该包含被引用实体（可能是一个术语、用户、内容等）的ID。
