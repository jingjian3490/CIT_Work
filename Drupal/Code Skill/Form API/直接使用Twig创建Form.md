## Case

#### 1. 创建block，返回theme
```php
<?php  
  
namespace Drupal\eventhub_search\Plugin\Block;  
  
use Drupal\Core\Block\BlockBase;  
  
/**  
 * Search block. 
 * 
 * @Block(  
 *   id = "search_block", 
 *   admin_label = @Translation("Search block"),  
 * ) 
*/
class SearchBlock extends BlockBase {  
  
  /**  
   * Block build.   
   *   
   * @return array  
   *   return block.   
   */  
  public function build() {  
    return [  
      '#theme' => 'search_block',  
    ];  
  }  
}
```
#### 2. module文件创建theme hook
```php
/**  
 * Implements hook_theme(). 
*/
function eventhub_search_theme($existing, $type, $theme, $path) {  
  return [  
    'search_block' => [  
      'template' => 'block--search',  
      'variables' => [],  
    ],  
  ];
}
```
#### 3. ==在Twig模板文件编写==
```HTML.twig
<div class="search">  
  <div>  
    <form action="/search" method="GET">  
      <p>  
        <input maxlength="128" type="text" name="keyword" autocomplete="off">  
      </p>  
    </form>  
  </div>  
  <div class="search-icon"></div>  
</div>
```

`<form action="/search" method="GET">`：定义了一个表单，其动作（`action`）设置为 `/search`，这意味着当表单提交时，浏览器会向 `/search` 路径发送一个GET请求。==使用GET方法意味着提交的数据会附加在URL上==。

`<input maxlength="128" type="text" name="keyword" autocomplete="off">`：一个输入字段，允许用户输入文本。它的最大长度（`maxlength`）限制为128个字符，`name` 属性设置为 `keyword`，这是==提交表单时用于传递输入值的参数名==。`autocomplete="off"` 表示浏览器不会自动完成用户以前输入的值。

如果表单有==多个输入框==，每个输入框都会有自己的 `name` 属性，当表单提交时，这些输入框的 `name` 和用户填写的 `value` 将成为URL查询字符串的一部分。

在Drupal中使用==Form API==创建的表单，默认情况下使用==POST方法==提交数据。POST方法将表单数据作为==HTTP消息的一部分==发送，而不是作为URL的一部分，提供了更好的安全性，特别是当表单数据包含敏感信息时。