## 前置情境：
[[可以上传文件的表单]]
## Case
#### ==批处理操作设置==
```php
public function submitForm(array &$form, FormStateInterface $form_state) {  
  $file = $this->entityTypeManager->getStorage('file')  
    ->load($form_state->getValue('csv_file')[0]);  
  $full_path = $file->get('uri')->value;  
  $file_directory = 'temporary://pre_registration_csv/';  
  $this->fileSystem->prepareDirectory($file_directory, FileSystemInterface::CREATE_DIRECTORY);  
  // Get sheet data.  
  $reader = Reader::createFromPath($full_path);  
  $reader->setHeaderOffset(0);  
  // Get all exists pre-registration.  
  $pre_registrations = $this->getEventPreRegistrations($form_state->getValue('event'));  
  foreach ($reader->getRecords() as $record) {  
    // 对于CSV文件中的每条记录，创建一个包含必要信息的数组`$item`
    $item = [  
      'event' => $form_state->getValue('event'),  
      'email' => trim($record['Email'] ?? ''),  
      'pforcerx_id' => trim($record['PforceRx ID'] ?? ''),  
      'go_status' => trim($record['GO Status'] ?? ''),  
      'status' => 'add',  
    ]; 
    // 判断是新增预注册还是更新预注册   
    if (isset($pre_registrations[$item['email']])) {  
      $item['status'] = 'update';
      // 逐渐删除，最后剩下的是第一次包含但第二次不包含的
      unset($pre_registrations[$item['email']]);  
    }    
    // 将每个`$item`添加到批处理操作数组`$operations`中，
    // 每个操作指定了要执行的函数`'batchCreateTerm'`及其参数（即当前的`$item`）
    $operations[] = [  
      [$this, 'batchCreateTerm'],  
      [        
        $item  
      ],  
    ];  
  }
  // 处理第一次包含但第二次不包含的
  foreach ($pre_registrations as $pre_registration) {  
    $operations[] = [  
      [$this, 'batchCreateTerm'],  
      [        
      $pre_registration  
      ],  
    ];  
  }  
  // 设置并执行批处理
  // 如果`$operations`数组不为空，调用`batch_set`函数设置整个批处理操作，
  // 包括要执行的操作、批处理完成后的回调函数`'batchFinished'`、以及相关的消息。
  // 这个批处理任务将异步执行，以处理大量数据导入或更新，避免页面超时。
  if (!empty($operations)) {  
    batch_set([  
      'operations' => $operations,  
      'finished' => [$this, 'batchFinished'],  
      'title' => $this->t('Processing batch'),  
      'init_message' => $this->t('Batch is starting.'),  
      'error_message' => $this->t('Batch has encountered an error.'),  
    ]);  
  }  else {  
    \Drupal::messenger()->addError($this->t('No records found, please upload again.'));  
  }
}
```
`batch_set`方法中$operations 中有多条数据，每个数据会被逐一执行，即逐一调用`批处理操作执行函数`，最后执行一次`批处理操作完成回调函数`。

从代码片段本身看，并不直接体现出每个操作会被逐一执行的逻辑。这是因为在Drupal的批处理系统中，逐一执行每个操作的逻辑是由批处理框架本身内部处理的，而不需要开发者在设置批处理任务时显式指定。

当使用 `batch_set` 函数设置批处理任务时，定义一个包含所有操作的数组（`'operations' => $operations`），以及批处理完成后的回调函数（`'finished' => [$this, 'batchFinished']`）。这个配置告诉Drupal批处理系统有哪些操作需要执行，以及如何执行它们，但是具体的执行流程（如何逐一执行这些操作）是由Drupal批处理框架自动管理的。

所以在本案例中批处理操作执行函数 `batchCreateTerm` 的 `$data` 参数就只是 `$item` 数组。
#### ==批处理操作执行==
```php
public function batchCreateTerm($data, &$context) {  
  $service = \Drupal::service('eventhub_register.import_csv_services');  
  if (!isset($context['results']['current_line'])) {  
    $context['results']['current_line'] = 0;  
    $context['results']['event'] = $data['event'];  
  }  
  $service->preRegistrationImport($data, $context);  
}
```
`batchCreateTerm` 函数是批处理每个操作的具体实现。这个函数接收两个参数：`$data` 和 `&$context`。
###### `$data` 参数
- **定义**：`$data` 是传递给批处理操作的数据。这些数据通常是你需要在批处理操作中处理的信息，比如要导入的用户数据、文件路径或者任何其他你的批处理任务需要的数据。
- **用途**：在你的场景中，`$data` 包含了从CSV文件中读取的一条记录的数据，如事件ID、电子邮件、PforceRx ID、GO状态等。这些数据会被用于创建或更新预注册记录。
###### `&$context` 参数
- **定义**：`$context` 是一个==引用传递的数组==，用于存储批处理过程中的上下文信息。这个数组在整个批处理过程中保持可用，允许你存储和检索在批处理操作之间共享的数据。
- **用途**：`$context` 用于存储批处理的状态信息，比如已处理的记录数、成功或失败的操作数等。你可以在批处理操作开始时==初始化==一些值，比如`$context['results']['current_line'] = 0;`，然后在处理过程中更新这些值。Drupal批处理系统会在==批处理完成后==，通过`$context['results']`==传递给完成回调函数==（`batchFinished`），以便你可以总结批处理操作的结果。
- `$context` 参数==一开始是一个空数组==，你可以根据需要在批处理操作中向其中添加任意数据。`$context` 数组主要用于在整个批处理过程中传递和存储状态信息、结果和其他任何需要在操作之间共享的数据。
###### 引用传递（`&` 符号）
- **`&$context`** 中的 `&` 符号表示参数是以引用传递的，这意味着如果你在批处理操作函数内部对`$context`数组做任何修改，这些修改会反映到批处理的其他部分。这是共享和保持状态信息跨越批处理操作的一种有效方式。