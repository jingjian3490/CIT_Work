当得到 URL 对象，直接使用 `getText()` 获取Text 属性时会返回`Drupal\Core\StringTranslation\TranslatableMarkup` 对象，不能直接用于 字符串的比较，使用 `TranslatableMarkup` 对象的 `__toString()` 方法来获取实际的字符串值。
```php
if ($link instanceof \Drupal\Core\Link && $link->getText() === $this->t('Sign in')) {  
  $output[$key] = $link->setText($this->t('Now Sign'));  
}
```
正确示例
```php
if ($link instanceof \Drupal\Core\Link && (string) $link->getText() === 'Sign in') { $output[$key] = $link->setText($this->t('Now Sign')); }
```