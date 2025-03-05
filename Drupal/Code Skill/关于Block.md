==在Drupal中，块（Block）被视为实体（Entity）。Block don't have machine，只有 Block description，但是其实可以把Block description视为machine==

==Block description 命名不能重复，在数据库中存储的字段是 ‘info’，由此可以根据它来从数据库中查询Block。==

![[Pasted image 20230908150432.png]]

![[Pasted image 20230908150501.png]]

```php
class NotificationCommonServices {
	const EMAIL_TEMPLATE_FOOTER_DESCRIPTION = 'Notification footer';
	public function getEmailFooter() {  
	  // Block don't have a machine name. So we have to use id here.  
	  $blocks = $this->entityTypeManager->getStorage('block_content')  
	    ->loadByProperties([  
	      'info' => self::EMAIL_TEMPLATE_FOOTER_DESCRIPTION,  
	    ]);  
	  if (empty($blocks)) {  
	    return NULL;  
	  }  
	  $block = array_pop($blocks);  
	  //将块内容的主体文本提取出来，并将其包装为 `FormattableMarkup` 对象，然后返回。
	  //`FormattableMarkup` 允许包含HTML标记和变量，以便在文本中进行格式化。
	  return new FormattableMarkup($block->body->value, []);  
	}
}
```