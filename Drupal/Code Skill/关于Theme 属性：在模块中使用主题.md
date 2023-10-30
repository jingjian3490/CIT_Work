#### 1. 在block中使用theme属性
```php

<?php  
  
namespace Drupal\pfadpsg_hospital\Plugin\Block;  
  
use Drupal\Core\Block\BlockBase;  
use Drupal\pfadpsg_hospital\Form\HospitalFilterForm;  
  
/**  
 * Block for clinic region filter. 
 * 
 * @Block(  
 *   id = "clinic_filter_block", 
 *   admin_label = @Translation("Clinic Filter block"),  
 * ) 
 * */
class ClinicFilterBlock extends BlockBase {  
  
  /**  
   * {@inheritdoc}  
   */  
   public function build() {  
    return [  
      /*  
       * 在Drupal中，#theme 是一个特殊的渲染数组属性，它定义了如何展示或格式化某个数据。  
       * 当渲染系统遇到 #theme 属性时，它会查找与指定值匹配的主题建议函数或模板，  
       * 然后使用这个函数或模板来渲染数据。  
       *       
       * 在这里使用了 #theme 属性，就要在 .module文件里面实现 hook_theme() 钩子，用来声明变量  
       *       
       * Drupal将使用名为 "clinic_filter_block" 的模板或主题建议函数来渲染这个块的内容。  
       * 对于模板，Drupal会在当前主题或模块的 templates 目录中查找名为  
       * "clinic-filter-block.html.twig" 的Twig模板文件。  
       * */      
      '#theme' => 'clinic_filter_block',  
      '#form' => \Drupal::formBuilder()->getForm(HospitalFilterForm::class),  
      '#map' => [  
        '#type' => 'view',  
        '#name' => 'hospital_list',  
        '#display_id' => 'hospital_map',  
      ],      
      '#results' => [  
        '#type' => 'view',  
        '#name' => 'hospital_list',  
        '#display_id' => 'hospital_list',  
      ],    
    ];  
  } 


/**  
 * 如果不使用 #theme 属性，就可以直接返回数据  
 * 直接在返回的渲染数组中包含了表单、地图和结果列表。  
 * 这样，这三个元素将按照它们在数组中的顺序被渲染。  
 * 需要注意的是，由于我们没有使用 #theme 来指定一个特定的Twig模板或主题建议函数，  
 * 所以元素的渲染和布局将取决于默认的CSS和其他已启用的模块或主题的行为。  
 */  
public function build2() {  
  // 获取表单。  
  $form = \Drupal::formBuilder()->getForm(HospitalFilterForm::class);  
  
  // 获取地图视图。  
  $map = [  
    '#type' => 'view',  
    '#name' => 'hospital_list',  
    '#display_id' => 'hospital_map',  
  ];  
  // 获取结果列表视图。  
  $results = [  
    '#type' => 'view',  
    '#name' => 'hospital_list',  
    '#display_id' => 'hospital_list',  
  ];  
  // 返回渲染数组。  
  return [  
    'form' => $form,  
    'map' => $map,  
    'results' => $results,  
  ];
 }
}
```
#### 2. 在 .module 文件中定义 theme
```php
/**  
 * Implements hook_theme(). 
 * 
 * hook_theme() 钩子允许模块定义自己的主题建议函数或模板，并为这些主题建议或模板定义默认的变量。  
 * 这里定义了一个新的主题 clinic_filter_block，并为它定义了三个默认变量：form、map 和 results。  
 * 这些变量的默认值都是 NULL。  
 *  
 * ClinicFilterBlock 类中使用 '#theme' => 'clinic_filter_block', 时，  
 * Drupal会查找名为 clinic_filter_block 的主题建议或模板。只再有定义了才不会报错  
 */  
function pfadpsg_hospital_theme() {  
  return [  
    'clinic_filter_block' => [  
      'variables' => [  
        'form' => NULL,  
        'map' => NULL,  
        'results' => NULL,  
       ],    
     ],  
  ];
}
```
#### 3. 在模块的 templates 目录下定义模板文件 clinic_filter_block.html.twig
```twig
{#  
/**  
 * @file 
 * Theme override for clinic filter block.#}  
{{ map }}  
{{ form }}  
{{ results }}
```

