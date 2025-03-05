```php
// 假设 $node 是你的节点对象。  
if ($node->hasField('field_attachment') && !$node->get('field_attachment')->isEmpty()) {  
  $field_attachment_file = $node->get('field_attachment')->getValue();  
  
  // 检查是否字段真的有一个文件。  
  if (!empty($field_attachment_file)) {  
    $file_id = $field_attachment_file[0]['target_id'];  
  
    // 通过文件的ID获取文件对象。  
    $file = File::load($file_id);  
  
    if ($file) {  
      // 获取文件的URI。  
      $uri = $file->getFileUri();  
  
      // 获取stream_wrapper_manager服务。  
      $stream_wrapper_manager = \Drupal::service('stream_wrapper_manager');  
  
      // 生成公开的URL。  
      $url = $stream_wrapper_manager->getViaUri($uri)->getExternalUrl();  
  
      // 现在 $url 就是你的文件的下载链接。  
      // http://localhost/system/files/email_attachments/projectvax-matters.ics
    }
```
