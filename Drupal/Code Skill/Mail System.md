## 使用Pfizer-login登录
```php
HAOH05  
98031919
cnQ9-V7SQJ$9-&5

1. 使用` /pfizer-login `访问
2. 输入用户名和PIN：HAOH05  98031919
3. 选择第二个账号（ciandt后缀），输入验证码 889143
4. 输入用户名和密码HAOH05  cnQ9-V7SQJ$9-&3
```
文件同步
```php
在source目录下运行
scp -r caneg@172.21.2.211:/var/www/pfkpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/

注意更改项目名称，密码为锁屏密码

```

ddev 发邮件
```PHP
// Override drupal/symfony_mailer default config to use Mailpit
$config['symfony_mailer_lite.symfony_mailer_lite_transport.smtp']['plugin'] = 'smtp';
$config['symfony_mailer_lite.symfony_mailer_lite_transport.smtp']['configuration']['user']='';
$config['symfony_mailer_lite.symfony_mailer_lite_transport.smtp']['configuration']['pass']='';
$config['symfony_mailer_lite.symfony_mailer_lite_transport.smtp']['configuration']['host']='localhost';
$config['symfony_mailer_lite.symfony_mailer_lite_transport.smtp']['configuration']['port']='1025';
```
## QQ邮箱SMTP授权码
```
2054463918@qq.com
cfsafguaclupbgic
```
## 需要的模块

`Mail System`、`Swift Mailer`

## 实现步骤（以Pfemasia项目Notification模块为例）

#### 1. 安装需求模块
使用 swift mailer 配置SMTP时，要更改站点基础设置的email地址，使其和开通SMTP授权的账号一致![[Pasted image 20230912091333.png]]

#### 2. 新建自定义邮件服务模块
```md
info.yml
.module
.services.yml
```

##### ==src下新建php邮件实体==
```php
<?php  
  
namespace Drupal\notification_services;  

class Notification {  
  
  // Notification type value.  
  const NOTIFICATION_TYPE_EMAIL = 1;  
  
   // Email type. int
   public $type;  
   
   public $templateKey;  
   
   // The target address.   *   * @var string  
   public $receiver;  
  
   // The data to be fill into the template.   *   * @var array   
   public $data;  
  
   // Whether to combine the footer.   *   * @var bool    
   public $combineFooter;  
  
  /**  
   * Notification constructor.
   */  
   public function __construct(  
    int $type,  
    string $templateKey,  
    string $receiver,  
    array $data,  
    bool $combineFooter = TRUE) {  
    $this->type = $type;  
    $this->templateKey = $templateKey;  
    $this->receiver = $receiver;  
    $this->data = $data;  
    $this->combineFooter = $combineFooter;  
  }  
}
```

##### ==编写邮件服务类==
###### `NotificationCommonServices`
```php
<?php  
  
namespace Drupal\notification_services\Services;  
  
use Drupal\Component\Render\FormattableMarkup;  
use Drupal\Core\Entity\EntityTypeManager;  
use Drupal\node\NodeInterface;  
use PHPUnit\Runner\Exception;  
  
/**  
 * Notification common service. */
class NotificationCommonServices {  
  
  const EMAIL_TEMPLATE_FOOTER_DESCRIPTION = 'Notification footer';  
  
  protected $entityTypeManager;  

  public function __construct(  
    EntityTypeManager $entityTypeManager) {  
    $this->entityTypeManager = $entityTypeManager;  
  }  

  public function getTemplate($templateKey) {  
    $templates = $this->entityTypeManager->getStorage('node')  
      ->loadByProperties([  
        'type' => 'notification_templates',  
        'field_template_key' => $templateKey,  
        'status' => NodeInterface::PUBLISHED,  
      ]);  
    if (empty($templates)) {  
      throw new Exception("Template not found");  
    }  
    return array_pop($templates);  
  }  
  
  /**  
   * Get footer html.   *   * @return string  
   */  
  public function getEmailFooter() {  
    // Block don't have a machine name. So we have to use id here.  
    $blocks = $this->entityTypeManager->getStorage('block_content')  
      ->loadByProperties([  
        'info' => self::EMAIL_TEMPLATE_FOOTER_DESCRIPTION,  // iofo is block description.
      ]);  
    if (empty($blocks)) {  
      return NULL;  
    }  
    $block = array_pop($blocks);  
  
    return new FormattableMarkup($block->body->value, []);  
  }  
}
```
###### `EmailService`
```php
<?php  
  
namespace Drupal\notification_services\Services;  
  
use Drupal\Core\Config\ConfigFactoryInterface;  
use Drupal\Core\Entity\EntityTypeManager;  
use Drupal\file\Entity\File;  
use Drupal\notification_services\Notification;  
use Drupal\Core\Mail\MailManager;  
  

 class EmailServices implements BrokerInterface {  
 
   protected $entityTypeManager;  
  
   protected $mailManager;  
  
   protected $configFactory;  

   // Custom service. Return mail template node & Mail footer.
   protected $notificationCommonServices;  
  

   // Construct. Dependency injection. Need to write servicers file.
 
   public function __construct(  
    EntityTypeManager $entityTypeManager,  
    MailManager $mailManager,  
    ConfigFactoryInterface $configFactory,  
    NotificationCommonServices $notificationCommonService) {  
    $this->entityTypeManager = $entityTypeManager;  
    $this->mailManager = $mailManager;  
    $this->configFactory = $configFactory;  
    $this->notificationCommonServices = $notificationCommonService;  
  }  
  
  /**  
   * Send out notification.  Parameter is mail entiey of php.
   */  
   public function sendNotification(Notification $notification) {  
    try {  
      // Result is node  
      $template = $this->notificationCommonServices->getTemplate($notification->templateKey);  
    }    
    catch (\Exception $e) {  
      \Drupal::logger('Notification')->error(  
        $notification->templateKey . ':' . $e->getMessage());  
      return FALSE;  
    }  
    // 2. Prepare email subject and body.  
    // Placeholder replacement will be done in hook.  重点  
    $subject = $template->get('field_email_subject')->value;  
    $body = $template->get('field_email_content')->value;  
    // 主题和内容
    $params['subject'] = $subject;  
    $params['body'] = $body;  

	//处理附件
    if (!empty($notification->data['@attachment'])) {  
      $attachments = $notification->data['@attachment'];  
      if (!is_array($attachments)) {  
        $attachments = [$notification->data['@attachment']];  
      }      
      foreach ($attachments as $attachment) {  
        $params['attachment'][] = [  
          'filepath' => $attachment,  
          'filename' => basename($attachment),  
          'filemime' => mime_content_type($attachment),  
        ];      
      }      
      unset($notification->data['@attachment']);  
    }    
    elseif (!empty($template->get('field_attachment')->getValue())) {  
      $file_ids = array_column($template->get('field_attachment')->getValue(), 'target_id');  
      $attachments = File::loadMultiple($file_ids);  
      foreach ($attachments as $attachment) {  
        $params['attachment'][] = [  
          'filepath' => $attachment->uri->value,  
          'filename' => $attachment->filename->value,  
          'filemime' => $attachment->filemime->value,  
        ];      }  
    }  
    // 抄送人  
    if (!empty($notification->data['@cc'])) {  
      $cc = $notification->data['@cc'];  
      $params['headers']['Cc'] = is_array($cc) ? implode(',', $cc) : $cc;  
      unset($notification->data['@cc']);  
    }   
    // 密送人 
    if (!empty($notification->data['@bcc'])) {  
      $bcc = $notification->data['@bcc'];  
      $params['headers']['Bcc'] = is_array($bcc) ? implode(',', $bcc) : $bcc;  
      unset($notification->data['@bcc']);  
    }    
    // headers
    $params['headers']['MIME-Version'] = '1.0';  
    $params['headers']['Content-Type'] = 'text/html; charset=UTF-8; format=flowed';  
    $params['headers']['Content-Transfer-Encoding'] = '8Bit'; 
    // 占位符，从form获取
    $params['token'] = $notification->data;  
    // 占位符之footer
    if ($notification->combineFooter) {  
      $params['token']['@email-footer'] = $this->notificationCommonServices->getEmailFooter();  
    }    
    // 占位符之email_from，从node获取的，还有个email的占位符，从form表单获取
    if ($template->get('field_email_from')->value) {  
      $params['token']['@email_from'] = $template->get('field_email_from')->value;  
    }  
    // 占位符之邮件主题，从node获取
    if ($template->get('field_email_subject')->value) {  
      $params['token']['@email_subject'] = $template->get('field_email_subject')->value;  
    }  
    // 3. Send mail.  
    $result = $this->mailManager->mail(  
      'notification_services',  
      $notification->templateKey,  
      $notification->receiver, 
      NULL,  
      $params  
    );  
  
    if (!$result['result']) {  
      return FALSE;  
    }  
    return TRUE;  
  }  
}
```

##### ==编写hook实现 placeholder replacement==
```php
<?php  
  
/**  
 * @file  
 * For notifications.  
 */  
use Drupal\Component\Render\FormattableMarkup;  
  
/**  
 * Implements hook_mail(). 
 * params 是邮件服务类给的，是一个关联数组
 * */
function notification_services_mail($key, &$message, $params) {  
  // subject get from node field by user input，
  // htmlspecialchars is to avoid spite code injection.
  $params['subject'] = htmlspecialchars($params['subject']);  
  // Replaceholder replacement
  // 在 Drupal 9.5 中，`FormattableMarkup` 是一个用于创建格式化文本的类。
  // 它用于在文本中包含 HTML 标记以及其他占位符，并确保这些标记和占位符被正确地渲染和转义
  
  // new FormattableMarkup($params['subject'], $params['token']); 对$params['subject']
  // 进行处理，如果里面有占位符，就从 $params['token']寻找对应的进行替换
  $params['subject'] = new FormattableMarkup($params['subject'], $params['token']);  
  $params['body'] = new FormattableMarkup($params['body'], $params['token']);  
  
  if (isset($message['headers']['From'])) {  
    $message['headers']['From'] = $params['token']['@email_from'] ?? $message['headers']['From'];  
    $message['headers']['From'] = new FormattableMarkup($message['headers']['From'], $params['token']);  
  }  
  if (isset($params['subject'])) {  
    $message['subject'] = $params['subject'];  
  }  
  if (isset($params['body'])) {  
    $message['body'][] = $params['body'];  
  }  
  if (isset($params['headers']) && is_array($params['headers'])) {  
    $message['headers'] = array_merge($message['headers'], $params['headers']);  
  }  
  // Add attachment when available.  
  if (!empty($params['attachment'])) {  
    $message['params']['attachments'] = $params['attachment'];  
  }
}
```

Hi there,  
Thank you for taking the The Migraine Disability Assessment Test (MIDAS). Your results have been generated here for you to download, print, and show to your medical practitioner. Where necessary, please bring a copy of these results to your consultation so your doctor can help diagnose and advise on your condition.  
Please do not reply as this is an unattended email box.  
  
To report any Adverse Events related to Pfizer pharmaceutical products, please contact us via the  
following: SGP.AEReporting@pfizer.com  
  
If you have any medical enquiries about Pfizer pharmaceutical products, please contact our medical information


#### 3. custom email service

###### 1. email entity
```php 
<?php  
  
namespace Drupal\pfrpsg_common;  
  
/**  
 * Custom Email Entity class. */class CustomEmailEntity {  
  
  /**  
   * Used to get email template from node.   */  public string $templateKey;  
  
  /**  
   * The target address.   */  public string $receiver;  
  
  /**  
   * The data to be fill template.   */  public array $data;  
  
  /**  
   * Construct.   */  public function __construct(string $template_key, string $receiver, array $data) {  
    $this->templateKey = $template_key;  
    $this->receiver = $receiver;  
    $this->data = $data;  
  }  
}
```

###### 2. send email service
```php 
<?php  
  
namespace Drupal\pfrpsg_common\Services;  
  
use Drupal\Core\Entity\EntityTypeManager;  
use Drupal\Core\Mail\MailManager;  
use Drupal\pfrpsg_common\CustomEmailEntity;  
  
/**  
 * Custom Email Service. */class CustomEmailService {  
  
  /**  
   * EntityTypeManager.   *   * @var \Drupal\Core\Entity\EntityTypeManager  
   */  protected EntityTypeManager $entityTypeManager;  
  
  /**  
   * MailManager.   *   * @var \Drupal\Core\Mail\MailManager  
   */  protected MailManager $mailManager;  
  
  /**  
   * Construct.   */  public function __construct(EntityTypeManager $entityTypeManager, MailManager $mailManager) {  
    $this->entityTypeManager = $entityTypeManager;  
    $this->mailManager = $mailManager;  
  }  
  /**  
   * Send mail.   */  public function sendEmail(CustomEmailEntity $emailEntity): bool {  
  
    // 1. Get template  
    try {  
      $templates = $this->entityTypeManager->getStorage('node')  
        ->loadByProperties([  
          'type' => 'email_template',  
          'field_template_key' => EMAIL_TEMPLATE_KEY,  
          'status' => 1,  
        ]);      $template = reset($templates);  
    }    catch (\Exception $e) {  
      \Drupal::logger('Email Service')  
        ->error($emailEntity->templateKey . ':' . $e->getMessage());  
      return FALSE;  
    }  
    // 2. Prepare email subject and body.  
    if (!empty($emailEntity->data['@attachment'])) {  
      $attachments = $emailEntity->data['@attachment'];  
      if (!is_array($attachments)) {  
        $attachments = [$emailEntity->data['@attachment']];  
      }      foreach ($attachments as $attachment) {  
        $params['attachment'][] = [  
          'filepath' => $attachment,  
          'filename' => basename($attachment),  
          'filemime' => mime_content_type($attachment),  
        ];      }      unset($emailEntity->data['@attachment']);  
    }  
    $params['headers']['MIME-Version'] = '1.0';  
    $params['headers']['Content-Type'] = 'text/html; charset=UTF-8; format=flowed';  
    $params['headers']['Content-Transfer-Encoding'] = '8Bit';  
  
    $params['subject'] = $template->field_email_subject->value;  
    $params['body'] = $template->body->value;  
    $params['token'] = $emailEntity->data;  
  
    // 3. Send mail.  
    $result = $this->mailManager->mail(  
      'pfrpsg_common',  
      $emailEntity->templateKey,  
      $emailEntity->receiver,  
      NULL,  
      $params  
    );  
  
    if (!$result['result']) {  
      \Drupal::logger('Email Service')->error('Error sending email');  
      return FALSE;  
    }    else {  
      return TRUE;  
    }  
  }  
}
```

```yml
services:  
  pfrpsg_common.email_services:  
    class: Drupal\pfrpsg_common\Services\CustomEmailService  
    arguments:  
      - '@entity_type.manager'  
      - '@plugin.manager.mail'
```


###### 3. placeholder in .module
```php
/**  
 * Implements hook_mail(). $params from service. */function pfrpsg_common_mail($key, &$message, $params): void {  
  
  if (isset($params['subject'])) {  
    $params['subject'] = new FormattableMarkup($params['subject'], $params['token']);  
    $message['subject'] = $params['subject'];  
  }  if (isset($params['body'])) {  
    $params['body'] = new FormattableMarkup($params['body'], $params['token']);  
    $message['body'][] = $params['body'];  
  }  if (isset($params['headers']) && is_array($params['headers'])) {  
    $message['headers'] = array_merge($message['headers'], $params['headers']);  
  }  if (!empty($params['attachment'])) {  
    $message['params']['attachments'] = $params['attachment'];  
  }}
```


###### 4. create  Content Type  & node

###### 5. by form to use email service