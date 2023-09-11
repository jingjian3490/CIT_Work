
## 需要的模块

`Mail System`、`Swift Mailer`

## 实现步骤（以Pfemasia项目Notification模块为例）

#### 1. 安装需求模块
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