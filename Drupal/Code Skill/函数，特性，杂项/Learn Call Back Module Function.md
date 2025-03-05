#### 源码分析
###### `pfemasia_callback.info.yml`
```yml
name: Pfemasia Callback  
description: This Callback custom Drupal module is designed to provide personalized contact forms for different countries.  
package: Custom  
type: module  
core_version_requirement: ^9 || ^10  
#它依赖于名为 "notification_services" 的模块，您已经提到过这是Drupal中的另一个模块。这意味着在启用 "Pfemasia Callback" 模块之前，您需要确保 "notification_services" 模块也已经启用。
dependencies:  
  - notification_services:notification_services
```

```yml
dependencies:   
  - module_name:module_name
```
这种格式是用来指定模块依赖的规范方式，其中:
- 第一个 `module_name` 是要列出的依赖模块的名称。
- 第二个 `module_name` 是依赖模块的名称再次重复，用于提供额外的信息，通常是模块的主要标识。

###### `CallBackForm.php`
```php
<?php  
  
namespace Drupal\pfemasia_callback\Form;  
  
use Drupal\Core\Entity\EntityTypeManagerInterface;  
use Drupal\Core\Form\FormBase;  
use Drupal\Core\Form\FormStateInterface;  
use Drupal\node\Entity\Node;  
use Drupal\node\NodeInterface;  
use Drupal\notification_services\Notification;  
use Drupal\notification_services\Services\EmailServices;  
use Drupal\user\Entity\User;  
use Symfony\Component\HttpFoundation\RedirectResponse;  
use Symfony\Component\DependencyInjection\ContainerInterface;  
  
/**  
 * Provides a Pfemasia Callback form. 
 */
class CallBackForm extends FormBase {  
// 依赖注入
protected EmailServices $emailServices;  
protected EntityTypeManagerInterface $entityTypeManger;  
public function __construct(EmailServices $emailServices, EntityTypeManagerInterface $entityTypeManager) {  
    $this->emailServices = $emailServices;  
    $this->entityTypeManger = $entityTypeManager;  
  }
// Form依赖注入不在service.yml文件
public static function create(ContainerInterface $container) {  
    return new static(  
      $container->get('notification_services.email_service'),  
      $container->get('entity_type.manager')  
    );  
}  

public function getFormId(): string {  
    return 'callback_form';  
  }  

public function buildForm(array $form, FormStateInterface $form_state): array {  
  
    $form['call_back_form'] = [  
      '#type' => 'container',  
      '#attributes' => [  
        'class' => ['callback-form-container']  // use container to add custom class
      ],    ];  
    $form['call_back_form']['contacted'] = [  
      '#type' => 'select',  
      '#title' => $this->t('I prefer to be contacted:'),  
      '#options' => $this->getContactedOptions(),  
      '#required' => TRUE,  
    ];  
    $form['call_back_form']['contact_via'] = [  
      '#type' => 'select',  
      '#title' => $this->t('Please contact me via:'),  
      '#options' => $this->getContactedViaOptions(),  
      '#required' => TRUE,  
    ];  
    $account = $this->currentUser();  
    $form['call_back_form']['email'] = [  
      '#type' => 'textfield',  
      '#title' => t('Email'),  
      '#maxlength' => 50,  
      '#required' => TRUE,  //Drupal将自动生成一个默认的错误消息，通常是 "This field is required."
      '#error_no_message' => TRUE,  // 即使没有自定义错误消息，也显示默认的错误消息
-------------------------------------------
      //有时您可能希望自定义错误消息，以提供更具体的提示。这就是 `'#error_no_message'` 
      '#required' => TRUE, // 这个字段是必填的 
      '#required_error' => t('Please provide your email address.'), // 自定义错误消息
-------------------------------------------
      '#default_value' => $account->isAuthenticated() ? $account->getEmail() : '',  
    ];  
    $form['call_back_form']['phone_number'] = [  
      '#type' => 'textfield',  
      '#title' => t('Phone Number'),  
      '#required' => TRUE,  
      '#maxlength' => '20',  
      '#error_no_message' => TRUE,  
    ];  
    $form['speciality'] = [  
      '#type' => 'hidden',  
      '#attributes' => [  
        'id' => ['callback-speciality']  
      ],    
	];  
    $form['sub_speciality'] = [  
      '#type' => 'hidden',  
      '#attributes' => [  
        'id' => ['callback-sub-speciality']  
      ],    
	];  
    $form['first_name'] = [  
      '#type' => 'hidden',  
      '#attributes' => [  
        'id' => ['callback-first-name']  
      ],    
	];  
    $form['last_name'] = [  
      '#type' => 'hidden',  
      '#attributes' => [  
        'id' => ['callback-last-name']  
      ],    
	];  
    // define a new form element，name is actions，type is actions.
	//"actions" 类型通常用于包装一个或多个提交按钮以及其他与表单操作相关的元素。
    $form['call_back_form']['actions']['#type'] = 'actions'; 
	// define a new form element, name is submit, 从属actions这个元素
    $form['call_back_form']['actions']['submit'] = [  
      '#type' => 'submit',  
      '#value' => $this->t('submit'),  
      '#attributes' => [  
        'disabled' => TRUE,  //该按钮在加载表单时将处于禁用状态
      ]    
	];    
    return $form;  
  }  

public function validateForm(array &$form, FormStateInterface $form_state) {  
    $email = $form_state->getValue('email');  
    if (!\Drupal::service('email.validator')->isValid($email)) {  
      $form_state->setErrorByName('email', $this->t('Please fill in the correct email address.'));  
    }    $phone_number = $form_state->getValue('phone_number');  
    if (strlen($phone_number) > 20) {  // strlen() 返回字符串长度
      $form_state->setErrorByName('phone_number', $this->t('Please fill in the correct phone number, No more than 20 characters.'));  
    }  
}  

public function submitForm(array &$form, FormStateInterface $form_state) {  
    try {  
      $this->createCallback($form_state);  //回调函数
      $build = [  // 数组
        '#type' => 'container',  // HTML容器元素
        '#markup' => '<p>' . $this->t('The form was submitted successfully.') . '</p>',  
        '#attributes' => ['class' => ['callback-success-messages']],  //容器元素的class
      ];   
	  // 使用Drupal的渲染服务来将HTML构建数组 `$build` 渲染成一个纯文本的消息
      $message = \Drupal::service('renderer')->renderPlain($build); 
      // 为什么不直接使用addMessenge方法，因为要添加class
      $this->messenger()->addMessage($message);  
	  // 获取当前页面的URI（统一资源标识符）
      $path = $this->getRequest()->getRequestUri();  
      $response = new RedirectResponse($path);  
      $response->send();

	  // 关闭当前会话的写入，通常在发送响应后执行
	  // 由于PHP的Session信息是写入文件的，1个客户端占有1个session文件。
	  // 因此，当 session_start被调用的时候，该文件是被锁住的，而且是以读写模式锁住的
	  //（因为程序中可能要修改session的值），这样，第2次调用 session_start的时候就被阻塞了。
	  // 如果你有一个需要执行时间比较长并用到session的ajax请求的话，就需要在服务器端调用
	  // session_write_close()，不然你的其他页面就都会被挂起直到请求结束！！！
      session_write_close();  
      $this->sendEmail($form_state);  
    }    
	catch (\Throwable $e) {  
      $this->logger('pfemasia_callback')->error($e->getMessage());  
    }  
}  

protected function createCallback(FormStateInterface $form_state) {  
    $account = $this->currentUser();  
    $user = User::load($account->id());  
    $title = $account->getAccountName() . $this->t(' - callback requested - ') . time();  
    $node = Node::create(['type' => 'call_back']); 
	// title 和 uid 是 node 必要属性，表示node title 和作者
    $node->set('title', $title);  
    $node->set('uid', $account->id());  
    $node->set('field_callback_contacted_time', $form_state->getValue('contacted'));  
    $node->set('field_callback_contact_type', $form_state->getValue('contact_via'));  
    $node->set('field_phone_number', $form_state->getValue('phone_number'));  
    $node->set('field_email', $form_state->getValue('email'));  
    $node->save();  
  }  

public function sendEmail(FormStateInterface $form_state) {  
    $account = $this->currentUser();  
    $user = User::load($account->id());  
    $contacted = $form_state->getValue('contacted') ? $this->getContactedOptions()[$form_state->getValue('contacted')] : 'Morning';  
    $via = $form_state->getValue('contact_via') ? $this->getContactedViaOptions()[$form_state->getValue('contact_via')] : 'Virtual call';  
    /** @var \Drupal\pfizer_grv_nextgen\ConfigManager $config_manager */  
    $config_manager = \Drupal::service('pfizer_grv_nextgen.config_manager');  
    /** @var \Drupal\pfizer_grv_nextgen\AccountManagerInterface $account_manager */  
    $account_manager = \Drupal::service('pfizer_grv_nextgen.account_manager'); 
	// 获取user的名字
    $username = $user->getDisplayName();  
    if (!$config_manager->isGrvDisabled() && $account_manager->isGrvAccount($account)) {  
      $first_name = $form_state->getValue('first_name');  
      $last_name = $form_state->getValue('last_name');  
	  // 获取user title 字段的值
      $title = $user->get('field_user_title')->getValue()[0]['value'] ?? '';  
      $username = $title . $first_name . ' ' . $last_name;  
    }    
	$replace_data = [  
      '@username' => $username, 
	  // 获取站点名称
      '@site_name' => $this->configFactory()->get('system.site')->get('name'),  
      '@contacted' => $contacted,  
      '@via' => $via,  
      '@email' => $form_state->getValue('email'),  
      '@phone_number' => $form_state->getValue('phone_number'),  
      '@main_speciality' => $form_state->getValue('speciality') ?: 'N/A',  
      '@detailed_speciality' => $form_state->getValue('sub_speciality') ?: 'N/A',  
    ]; 
       
    // Send email to HCP.  
	// 新建一个Notification实例（notification_services模块的）
	// 使用Notification类的常量 Notification::NOTIFICATION_TYPE_EMAIL
	// 关于发送邮件
    $hcp_notification = new Notification(Notification::NOTIFICATION_TYPE_EMAIL, 'user_submit_callback_request', $form_state->getValue('email'), $replace_data);  
    $this->emailServices->sendNotification($hcp_notification);  
    // Send email to manager.  
    $country_term_id = $user->field_user_country->target_id;  
    if (!empty($country_term_id)) {  
      $country = $this->entityTypeManger->getStorage('taxonomy_term')->load($country_term_id);  
      $manager_emails = $country->hasField('field_manager_email') ? $country->field_manager_email->getValue() : [];  
      if (!empty($manager_emails)) {  
        $manager_email_to = implode(', ', array_column($manager_emails, 'value'));  
        $manager_notification = new Notification(Notification::NOTIFICATION_TYPE_EMAIL, 'manager_receives_callback_request', $manager_email_to, $replace_data);  
        $this->emailServices->sendNotification($manager_notification);  
      }     
    }      
    return TRUE;  
  }  
 
  protected function getContactedOptions(): array {  
    $storage = $this->entityTypeManger->getStorage('taxonomy_term');  
    $options = [];  
    $term_ids = $storage->getQuery()  
      ->accessCheck(FALSE)  
      ->condition('status', 1)  
      ->condition('vid', 'contacted')  
      ->sort('weight')  
      ->execute();  
    if ($term_ids) {  
      $terms = $storage->loadMultiple($term_ids);  
      foreach ($terms as $id => $term) {  
        $options[$id] = $term->label();  
      }    
    }    
    if (empty($options)) {  
      $options = [  
        'morning' => $this->t('Morning'),  
        'afternoon' => $this->t('Afternoon'),  
        'evening' => $this->t('Evening'),  
      ];    
    }   
    return $options;  
  }  

protected function getContactedViaOptions(): array {  
    $storage = $this->entityTypeManger->getStorage('taxonomy_term');  
    $options = [];  
    $term_ids = $storage->getQuery()  
      ->accessCheck(FALSE)  
      ->condition('status', 1)  
      ->condition('vid', 'contact_via')  
      ->sort('weight')  
      ->execute();  
    if ($term_ids) {  
      $terms = $storage->loadMultiple($term_ids);  
      foreach ($terms as $id => $term) {  
        $options[$id] = $term->label();  
      }    
    }    
    if (empty($options)) {  
      $options = [  
        'virtual_call' => $this->t('Virtual call'),  
        'phone_number' => $this->t('Phone call'),  
      ];    
    }    
    return $options;  
  }  
}

```

``` php
# 创建一个存储SMTP凭据的变量
 $Email = "your_email@example.com" 
$Password = ConvertTo-SecureString "your_password" -AsPlainText -Force $SMTPCredentials = New-Object System.Management.Automation.PSCredential ($Email, $Password)
 # 使用Send-MailMessage发送邮件，并提供SMTP凭据 
Send-MailMessage -To "1114669713@qq.com" -From "19120728841@163.com" -Subject "Hello!" -Body "This is important" -SmtpServer "smtp.163.com" -Port 465 -Credential $SMTPCredentials
```

