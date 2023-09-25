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

#### 6. 研究实体
