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

##### 3. 看完Form看对应的 routing.yml
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


##### 4. 依注解看 `"view_builder" = "Drupal\Core\Entity\EntityViewBuilder"`
本例使用了core的默认视图构建器来渲染视图的输出，可以省略这个注解。
如果计划使用`Drupal\Core\Entity\EntityViewBuilder`作为您实体的视图构建器，并且没有任何定制的显示逻辑，那么可以在实体注解中省略`view_builder`。如果省略，Drupal会默认使用`EntityViewBuilder`来处理实体的显示。

**EntityViewBuilder (`Drupal\Core\Entity\EntityViewBuilder`)**:
- 负责构建和渲染实体。
- 为实体提供默认的模板和渲染数组。
- 提供一个标准的方法来添加缓存标签、上下文和最大有效期，以确保正确的缓存行为。
- 允许其他模块通过`hook_ENTITY_TYPE_view()`和`hook_entity_view()`来修改渲染数组
##### 5. 依注解看 `"views_data" = "Drupal\views\EntityViewsData"`
`views_data`类提供了与Views模块的集成，它描述了如何在Views模块中使用和显示实体字段。如果您计划使用默认的`EntityViewsData`并且没有任何定制的Views集成需求，那么您可以在实体注解中省略`views_data`。

**EntityViewsData (`Drupal\views\EntityViewsData`)**:
- 为每个实体字段提供默认的Views集成，允许它们在Views界面中被添加、过滤和排序。
- 提供默认的关系，如与其他实体的引用关系。
- 自动生成Views插件定义，例如字段、排序、过滤器和关系。
- 可以被其他模块通过hooks修改，以定制或增强默认的Views集成。

##### 6. 依注解看 `storage_schema" = "Drupal\pfadpsg_hospital\Entity\HospitalSchema"`
在Drupal的实体定义中，`storage_schema`通常指定一个类，用于定义实体在数据库中的模式，例如字段的数据类型、大小、索引等。但如果您没有为实体定义特定的模式需求或自定义模式行为，那么您完全可以省略这个注解。

当您省略`storage_schema`时，Drupal核心会使用默认的模式处理器`Drupal\Core\Entity\Sql\SqlContentEntityStorageSchema`。这个默认的处理器能够根据您在实体字段定义中提供的信息自动构建和管理数据库模式。

本例自定义，因为：
```php
/**  
 * 对于'address'和'zone'字段，我们添加了索引。  
 * 在数据库中为这些字段添加索引可以提高查询性能，特别是当您经常需要根据这些字段进行筛选或排序时。  
 */  
if ($table_name == 'hospital') {  
  switch ($field_name) {  
    case 'address':  
      $this->addSharedTableFieldIndex($storage_definition, $schema);  
      break;  
  
    case 'zone':  
      $this->addSharedTableFieldIndex($storage_definition, $schema);  
      break;  
  }
}
```


   