#### 1. 入口：Navigation Menu，链接：`/clinic-locator`
#### 2. clinic-locator是哪里设置？OOOOOO，这是一个node，里面的内容都是block填充的
#### 3. 就只有一个block，来自 Pfadpsg Hospital 模块
```php
// block 返回一个 form 和两个 view，分别是 hospital_map、hospital_list
public function build() {  
  return [  
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
```
#### 4. 看看 form
Form 就是搜索和复选框，没有做提交处理，但选择了页面却有反应
###### code
![[Pasted image 20230921155426.png]]
```php
<?php  
  
namespace Drupal\pfadpsg_hospital\Form;  
  
use Drupal\Core\Form\FormBase;  
use Drupal\Core\Form\FormStateInterface;  
use Symfony\Component\DependencyInjection\ContainerInterface;  
  
/**  
 * Region filter form. */
class HospitalFilterForm extends FormBase {  
  
  /**  
   * {@inheritdoc}  
   */  
  public function getFormId() {  
    return 'hospital_filter_form';  
  }  
  /**  
   * Build form.   */  
  public function buildForm(array $form, FormStateInterface $form_state) {  
  
    $form['markup'] = [  
      '#markup' => '<h1 class="title text-align-center c-blue">Consult a <span class="c-red">medical specialist</span> near you</h1>'  
    ];  
  
    $form['address'] = [  
      '#type' => 'textfield',  
      '#placeholder' => $this->t('Type Street Name, Building Name or Zip Code'),  
      '#prefix' => '<div class="search-input">',  
      '#suffix' => '<div role="button" class="search-button"><span class="icon-search secondary">&zwnj;</span></div></div>',  
    ];  
    $zone_options = [  
      'North' => $this->t('North'),  
      'South' => $this->t('South'),  
      'Central' => $this->t('Central'),  
      'East' => $this->t('East'),  
      'West' => $this->t('West'),  
    ];    $form['zone'] = [  
      '#type' => 'checkboxes',  
      '#title' => 'OR Pick Zone (s)',  
      '#options' => $zone_options,  
    ];  
    $form['#prefix'] = '<div id="clinic-filter-form" class="clinic-filter-form text-align-center">';  
    $form['#suffix'] = '</div>';  
    return $form;  
  }  
  /**  
   * {@inheritdoc}  
   */  
  public function submitForm(array &$form, FormStateInterface $form_state) {  
    // TODO: Implement submitForm() method.  
  }  
  
}
```

#### 5. 看看 view
![[Pasted image 20230921161014.png]]
==这是数据源为 Hospital View，而 Hospital 是自定义实体==

#### 6. 研究实体（内容实体）

##### 1. 先看 `Hospital.php`
- 创建实体第一步：为实体的获取/设置方法定义定义接口，通常拓展`\Drupal\Core\Entity\ContentEntityInterface`，也可以直接用
- 为您的定义一个类，实现接口并扩展`\Drupal\Core\Entity\ContentEntityBase`，其中在其文档块中使用@ContentEntityType的注释。
```php
<?php  
  
namespace Drupal\pfadpsg_hospital\Entity;

class Hospital extends ContentEntityBase implements ContentEntityInterface {
}
```

- 注解
```php
/**  
 * Defines the hospital entity for pfadpsg. 
 * 
 * @ContentEntityType(  
 *   id = "hospital", 
 *   label = @Translation("Hospital"),  
 *   base_table = "hospital", 
 *   entity_keys = { 
 *     "id" = "id", 
 *   }, 
 *   handlers = { 
 *     "form" = { 
 *       "default" = "Drupal\pfadpsg_hospital\Form\HospitalAddForm", 
 *     }, 
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder", 
 *     "views_data" = "Drupal\views\EntityViewsData", 
 *     "storage_schema" = "Drupal\pfadpsg_hospital\Entity\HospitalSchema", 
 *   } 
 * ) 
 * */
class Hospital extends ContentEntityBase implements ContentEntityInterface {}
```

- 字段定义
```php
/**  
 * $fields: 这是一个数组，用于存储实体类型的所有基础字段定义。  
 * 这里调用了父类（即ContentEntityBase类）中的baseFieldDefinitions方法。  
 *  
 * 这个调用的作用是获取父类中已经定义的基础字段，这通常会包括一些通用字段，  
 * 比如实体ID、UUID、创建时间、修改时间等。这些字段通常在所有内容实体类型中都是需要的  
 * 创建的字段和entity_keys中的值有关  
 */  
$fields = parent::baseFieldDefinitions($entity_type);

/**  
 * geolocation 字段类型在 geolocation field 模块中定义  
 * 在创建时将会转换为 6 列  
 */  
$fields['location'] = BaseFieldDefinition::create('geolocation')  
  ->setLabel(t('Location'))  
  ->setDescription(t('The Location.'))  
  ->setRevisionable(TRUE)  
  // 设置了在视图模式下这个字段如何显示。标签被隐藏，字段类型被设置为geolocation_latlng，显示权重为-2。  
  ->setDisplayOptions('view', [  
    'label' => 'hidden',  
    'type' => 'geolocation_latlng',  
    'weight' => -2,  
  ])  // 设置了在表单模式下这个字段如何显示。字段类型被设置为geolocation_latlng，显示权重为-2，并设有自定义标题。  
  ->setDisplayOptions('form', [  
    'type' => 'geolocation_latlng',  
    'weight' => -2,  
    'title' => t('title thing'),  
  ]);

/**  
 * 字段的类型为created意味着这个字段用于存储一个UNIX时间戳，  
 * 该时间戳表示实体（在这个例子中可能是“hospital”）被创建的时间。  
 * 在Drupal中，created字段类型通常用于此目的。  
 */  
$fields['created'] = BaseFieldDefinition::create('created')  
  ->setLabel(t('Create Time'))  
  ->setDescription(t('hospital Create Time'))  
  ->setRequired(TRUE);
```
##### 2. 依注解看 `"default" = "Drupal\pfadpsg_hospital\Form\HospitalAddForm"`
#或者，您可以定义一个
在本案例：定义一个 "default" 表单来处理 "add" 和 "edit" 表单，**而不是分别定义**它们。

#### 3. 看完Form看对应的 routing.yml
#default_entity_form 
```yml
pfadpsg_hospital.add:  
  path: '/admin/hospital/add'  
  defaults:  
    _title: 'Clinic Add'  
    _entity_form: hospital.default  
  requirements:  
    _permission: 'access hospital management pages'  
  options:  
    no_cache: TRUE  
# defaults：对于实体表单路由，使用 `_entity_form` 而不是通用的 `_controller` 或 `_form`。  
# 该值由实体类型的机器名称和实体注解中的表单处理程序类型组成。  
# 因此，在此示例中，block.default 指的是块实体类型上的“默认”表单处理程序，实体其注解包含：  
#handlers = {  
#    "form" = {  
#      "default" = "Drupal\block\BlockForm",  
#    }  
#}
```
