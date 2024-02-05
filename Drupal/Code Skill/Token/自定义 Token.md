自定义 Token 在 .module 文件中进行，想要实现两个 hook 函数，不需要安装其他模块， Token 模块是 core 携带的。但如果想要在文本框中使用自定义 Token，则需要安装 `Token filter` 模块。

## 1. 实现 hook
==pfkpsg_common_token_info==
如果不编写type数组，在Token UI（**/admin/help/token**）中将不会显示
```php
function pfkpsg_common_token_info() {  
  $info = [];  
  // 声明 token type
  $info['types'] = [  
    'pfkpsg_common' => [  
      'name' => t('Pfkpsg common'),  
      'description' => t('Pfkpsg common module tokens.'),  
    ],  
  ];  
  // 声明具体 token：gcma-field，type 为 pfkpsg_common
  $info['tokens']['pfkpsg_common']['gcma-field'] = [  
    'name' => t('GCMA Field Value'),  
    'description' => t('A token to display GCMA field value of the current node.'),  
  ];  
  return $info;  
}
```
==pfkpsg_common_tokens==
在 tokens hook 函数中编写具体要返回什么数据

```php
function pfkpsg_common_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata) {  
  $replacements = [];  
  if ($type == 'pfkpsg_common') {  
    foreach ($tokens as $name => $original) {  
      switch ($name) {  
        case 'gcma-field':  
          if ($node = \Drupal::routeMatch()->getParameter('node')) {  
            if ($node instanceof \Drupal\node\NodeInterface && $node->hasField('field_gcma')) {  
              $replacements[$original] = $node->field_gcma->value;  
            }          
          }          
          break;  
      }    
    }  
  }  
  return $replacements;  
}
```

`BubbleableMetadata` 对象用于添加缓存上下文、缓存标签和缓存最大生存时间（max-age）。为了解决缓存问题，可以在的Token替换函数中添加适当的缓存上下文。

## 2. 使用自定义 Token

Drupal标准token格式如下：  ==[type:name]==。
要使用上一小节定义的token，则应该为 ==[pfkpsg_common:gcma-field]==

#### 2.1 在 CMS 的文本框中使用
 **文本过滤器的作用**：在Drupal中，文本区域的处理依赖于配置的文本格式和过滤器。某些文本格式可能不会解析Token。为了让Token在基本块中被替换，你需要确保`使用的文本格式`配置了支持Token的过滤器。

**Token过滤器模块**：虽然Token模块提供了API和界面来使用Token，但在文本编辑器中自动替换Token通常需要**Token Filter**模块或类似的解决方案。如果你没有安装**Token Filter**模块，请`安装并启用`它。

 **配置文本格式**：安装**Token Filter**模块后，你需要`配置一个`文本格式（或使用一个已存在的文本格式 ），并确保`启用`了Token过滤器。然后，使用这个文本格式在你的基本块中输入内容。（/admin/config/content/formats）

然后在文本框中输入正确的token格式即可，如 ==[pfkpsg_common:gcma-field]==

#### 2.2 在 Twig 模板中使用
创建一个自定义Twig过滤器或函数 参考[[开发自定义 Twig 扩展]]
```php
// src/Twig/MyCustomTwigExtension.php
namespace Drupal\my_module\Twig;

use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Utility\Token;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class MyCustomTwigExtension extends AbstractExtension {

  protected $token;
  protected $renderer;

  public function __construct(Token $token, RendererInterface $renderer) {
    $this->token = $token;
    $this->renderer = $renderer;
  }

  public function getFilters() {
    return [
      new TwigFilter('replace_tokens', [$this, 'replaceTokens']),
    ];
  }

  public function replaceTokens($string, array $data = []) {
    return $this->token->replace($string, $data);
  }
}
```
然后在你的Twig模板中，你可以这样使用：
```twig
{{ 'Some text with [my_custom_token]'|replace_tokens }}
```

## 3. 案例 pfkpsg

项目 footer 上的 GCMA code 需要跟随 node 的变化而变化，使用 token 获取 node 的 GCMA 字段的值进行替换。
###### #缓存问题
```php
function pfkpsg_common_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata) {  
  $replacements = [];  
  
  if ($type == 'pfkpsg_common') {  
    foreach ($tokens as $name => $original) {  
      switch ($name) {  
        case 'gcma-code':  
          if ($node = \Drupal::routeMatch()->getParameter('node')) {  
            \Drupal::logger('logger')->notice('<pre>' . print_r('is node', TRUE) . '</pre>');  
            if ($node instanceof NodeInterface && $node->hasField('field_copyright_and_gcma')) {  
              // Add cache context for the node.  
              $bubbleable_metadata->addCacheContexts(['url.path']);  
              $replacements[$original] = $node->get('field_copyright_and_gcma')->value;  
            }            
            else {  
              $replacements[$original] = DEFAULT_COPYRIGHT_AND_GCMA_CODE;  
            }          
        }          
        else {  
            \Drupal::logger('logger')->notice('<pre>' . print_r('not node', TRUE) . '</pre>');  
            $replacements[$original] = DEFAULT_COPYRIGHT_AND_GCMA_CODE;  
        }          
        break;  
      }    
      }  
      }  
  return $replacements;  
}
```

一开始进行替换后遇到缓存问题，footer上的GCMA code 显示都是一样的，使用缓存上下文才解决问题。


`$bubbleable_metadata->addCacheContexts(['url.path']);` 行添加了一个缓存上下文，这告诉Drupal缓存系统，块的内容依赖于当前的URL路径。因此，当你访问不同的节点页面时，Drupal会为每个不同的URL路径生成和存储不同的块内容。


#### 没解决问题
明确需求，当node 的GCMA字段更新时token更新，每个node的GCMA不一样，所以切换URL是也更新。
==在何处添加缓存上下文和缓存标签也非常重要==，将缓存上下文写在循环里面依然出现缓存问题
```php
function pfkpsg_common_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata) {  
  $replacements = [];  
  
  if ($type == 'pfkpsg_common') {  
    // Add cache context for the node.  
    $bubbleable_metadata->addCacheContexts(['url.path']);  
    foreach ($tokens as $name => $original) {  
      switch ($name) {  
        case 'gcma-code':  
          if ($node = \Drupal::routeMatch()->getParameter('node')) {  
            // Add cache tag for the node.  
            $bubbleable_metadata->addCacheTags(['node:' . $node->id()]);  
            if ($node instanceof NodeInterface &&  
              $node->hasField('field_copyright_and_gcma') &&  
              !empty($node->get('field_copyright_and_gcma')->getValue())) {  
  
              $replacements[$original] = $node->get('field_copyright_and_gcma')->value;  
            }            
            else {  
              $replacements[$original] = DEFAULT_COPYRIGHT_AND_GCMA_CODE;  
            }          
          }          
          else {  
            $replacements[$original] = DEFAULT_COPYRIGHT_AND_GCMA_CODE;  
          }          
          break;  
      }    
    }  
  }  
  return $replacements;  
}
```