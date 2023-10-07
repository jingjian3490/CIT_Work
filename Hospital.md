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

- 字段定义，在这里对字段的定义在view中展示方式
![[Pasted image 20231004095351.png]]
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

#### 7. 有实体了需要添加
`添加：`根据实体定义时的注解，default form 和对应的 routing.yml 文件 可以添加实体。

`展示：`案例使用view block进行展示，发现多了个字段 `Hospital: Proximity Form Field (location)`

------

#### 8. 进行展示数据，第一个 view
案例使用view展示，使用了三个 view ： ==Hospital List Block、Hospital Map Block、  
Manage List==

查看案例 Hospital List Block 展示字段时发现不同，有两处奇怪点
1. `Tel` 和  `Website` 字段被修改了
2. 多出了一个 `Proximity Form Field (location)` 字段
![[Pasted image 20231004101635.png]]

###### ==探索对字段的修改==
通过对比，初步判断是为了添加HTML属性，字段被修改后有了HTML属性
![[Pasted image 20231004102409.png]]
如何对view的数据进行修改？先到 .module 文件看看，发现hook：pfadpsg_hospital_views_data_alter
发现并不是修改原字段，而是新增字段对原字段进行加强：
![[Pasted image 20231004121031.png]]

```php
/**   .module
 * 为hospital表 增加 两个自定义字段tel_html和website_html，并分别为它们指定了一个处理程序。  
 *  
 * 为hospital表的$data数组添加一个新的定义tel_html，这定义了一个 新的 视图字段，  
 * 其处理程序 ID 为 hospital_tel_handler。  
 *  
 * 处理程序的定义在 Drupal\pfadpsg_hospital\Plugin\views\field\HospitalWebsiteHandler  
 */
 $data['hospital']['tel_html'] = [  
  'title' => 'Tel Html',  
  'field' => [  
    'id' => 'hospital_tel_handler'  
  ],  
];
```

```php
// HospitalWebsiteHandler
public function render(ResultRow $values) {  
  $hospital = $values->_entity;  
  $tel = $hospital->get('tel')->value;  
  $name = $hospital->get('name')->value;  
  if ($tel) {  
    $sc_link = "sc:linkname='clinic locator|pharmacy finder results|$name|telephone'";  
    $tel_text = '<a class="custom-field clinic-tel-number" href="tel:' . $tel . '" ' . $sc_link . '>' . $tel . '</a>';  
    $tel_html = Markup::create($tel_text);  
    // 为了安全性，任何要输出到页面上的HTML应该经过适当的清理和过滤，以防止跨站脚本攻击（XSS）。  
    // Markup::create($tel_text) 返回一个Markup对象，它包含了原始的HTML字符串。  
    // 这个对象可以被直接返回给Drupal的渲染系统，并在页面上输出其内容。  
    return $tel_html;  
  }  return NULL;  
}
```


###### 处理器
处理器（Handler）在Drupal的上下文中是一个关键概念，尤其是在与视图（Views）相关的功能中。

在Drupal的视图系统中，处理器是用来定义和处理特定类型数据的插件。它们提供了特定于字段、筛选器、关系、排序等的功能。每种类型的数据（例如内容实体的字段或属性）在视图中都可以有一个或多个相关的处理器。

以下是Drupal中几种常见的处理器类型：

1. **字段处理器 (Field Handlers)**: 这些处理器定义了如何在视图结果中展示特定的字段。
    
2. **筛选器处理器 (Filter Handlers)**: 定义了如何基于特定条件过滤或筛选视图结果。
    
3. **排序处理器 (Sort Handlers)**: 定义了如何根据某个字段或条件对视图结果进行排序。
    
4. **关系处理器 (Relationship Handlers)**: 允许基于实体之间的关系（例如节点和作者）添加额外的字段、筛选器和排序到视图中。
    
5. **区域处理器 (Area Handlers)**: 允许在视图的头部、页脚或空结果区域添加自定义文本或其他内容。

###### `Proximity Form Field`
`geolocation Field`模块在Drupal中提供了地理位置功能，包括存储、处理和显示地理位置数据。其中，`Proximity Form Field`是该模块的一个组件，专门用于处理地点之间的接近性或距离。

`Proximity Form Field`的主要用途和特点如下：

1. **用户界面**: 它提供了一个表单字段，允许用户输入一个中心点（例如，他们的当前位置或特定的地址）。
    
2. **计算距离**: 结合给定的中心点和存储的地理位置数据，它可以计算内容或地点与给定中心点之间的距离。
    
3. **过滤内容**: 在视图或其他查询上下文中，用户可以使用这个字段来过滤结果，基于与指定地点的距离。例如，用户可能想要找到距离他们当前位置5公里以内的所有餐馆。
    
4. **排序**: 在视图中，可以根据与给定中心点的距离对结果进行排序，从而找到最近的地点。
    
5. **兼容性**: `Proximity Form Field`与`geolocation Field`模块中的其他组件兼容，例如地图显示、标记和其他地理位置相关的功能。
    
6. **灵活性**: 这个字段提供了一些配置选项，允许管理员调整其行为，例如设置默认中心点、距离单位（公里或英里）等。


![[Pasted image 20231004221329.png]]
`Proximity Form Field`在Drupal中的配置界面。它为用户提供了多种方式来输入或确定一个地理位置，然后根据该位置进行距离或接近性的计算。以下是每个选项的解释：

1. **ipstack Service**:
    
    - 该服务会使用访问者的IP地址来大致确定其地理位置。这是一个第三方服务，通常用于快速、自动地为用户提供一个大致的位置。
2. **Client location**:
    
    - 这个选项将尝试使用浏览器的地理位置API来获取访问者的精确位置。这要求用户给予网站权限来访问其位置数据。
    - **Auto-submit form**: 如果位置可以被设定，此选项会自动提交表单，无需用户点击任何按钮。
    - **Hide coordinates form**: 如果选择这个选项，用户将看不到实际的经纬度坐标，即使他们的位置已经被获取。这对于那些希望简化用户界面的场景可能很有用。
    - 如果客户端位置可用并且为空，则将设置位置。这通常需要HTTPS连接。
3. **Fixed coordinates**:
    
    - 这个选项允许管理员设置一个固定的经纬度坐标作为中心点。这对于那些希望以特定地点为中心进行搜索的场景特别有用，例如公司总部或特定的城市中心。
    - **Latitude** 和 **Longitude**: 这里可以手动输入固定的经纬度坐标。
4. **Geocoder address input**:
    
    - 允许用户输入一个实际的地址（例如“101 Main Street, Anytown, USA”），然后使用地理编码服务将该地址转换为经纬度坐标。
5. **Coordinates input**:
    
    - 这个选项提供了一个简单的表单字段，允许用户直接输入经纬度坐标。
6. **Distance unit**:
    
    - 定义计算距离的单位。在这里，您选择了“Kilometer”。这意味着系统在内部总是以公里为单位处理值。

关于 `Calculate proximity` 按钮，由前端控制不显示

#### 9. 看第二个 view ： Hospital Map List
