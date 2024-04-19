## 1. Pfkpsg 导出配置和内容

- ==同步代码==
```shell
git pull origin develop
```
- ==同步数据库==
```shell
docker cp filename.sql mysql-container:/filename.sql
docker exec -it mysql-container bash
mysql -u root -p
use databaseName;
source /filename.sql;
```
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfkpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出配置==
```shell
drush cex
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer node --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer block_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer media --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer menu_link_content --folder=profiles/edisonknowpneumoniasg_profile/content  
drush dcer user --folder=profiles/edisonknowpneumoniasg_profile/content
drush dcer file --folder=profiles/edisonknowpneumoniasg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/edisonknowpneumoniasg_profile/content
```
- ==测试==
```shell
drush site:install -y
```
- ==导出数据库==
```shell
在 sub_prosile文件夹下创建 database.sanitize.yml
drush dbsg --machine-name="edisonknowpneumoniasg_profile"
or
drush dbsg + 回车 + 回车
or
drush dbsa --list  （卸载 dblog 模块）
--------------------------------
将打印出的配置复制到 database.sanitize.yml 文件，最后修改保持格式如下
sanitize:  
  edisonknowpneumoniasg_profile:  
    block_content__field_banner: FALSE  
    block_content__field_brightcove: FALSE  
    block_content__field_ckeditor: FALSE
--------------------------------
dblog 这个模块被 pfizer 忽略了，还有 views，导出来了也没用.
```
- ==完善settings.prod.php文件==
```php
// Uncomment and update the base URL with the production domain.  
$settings['pfizer_base_url'] = "https://www.pfizer-genotropin-shizai-info.jp";  
  
// Set XML sitemap base hostname.  
$config['simple_sitemap.settings']['base_url'] = $settings['pfizer_base_url'];  
  
// Adobe analysis.  
$config['adobe_analytics'] = [  
  'mode' => 'prod'  
];  

// 一般有两个一个用于私网登录CMS，一个用于公网，www是特殊
$settings['trusted_host_patterns'] = [  
  '^www\.pfizer-genotropin-shizai-info\.jp$',  
  '^pfizergenotropinshizaiin\.pfizersite\.io$',  
  '^pfizer-genotropin-shizai-info\.jp$',  
];
```

----------------------------------
## Pfrpsg 
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfrpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```

```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/migrainefreesg_profile/content  
drush dcer node --folder=profiles/migrainefreesg_profile/content  
drush dcer block_content --folder=profiles/migrainefreesg_profile/content  
drush dcer media --folder=profiles/migrainefreesg_profile/content  
drush dcer menu_link_content --folder=profiles/migrainefreesg_profile/content  
drush dcer user --folder=profiles/migrainefreesg_profile/content
drush dcer file --folder=profiles/migrainefreesg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/migrainefreesg_profile/content
```

```php
// 根据 id 导出单个内容
drush dcer file 166 --folder=profiles/migrainefreesg_profile/content
```
## ## Pfevtvn
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomvn_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomvn_profile/content
drush dcer file --folder=profiles/eventspfizerprocomvn_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomvn_profile/content
```
## Pfevtpk
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtpk/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```

```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer node --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer media --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocompk_profile/content  
drush dcer user --folder=profiles/eventspfizerprocompk_profile/content
drush dcer file --folder=profiles/eventspfizerprocompk_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocompk_profile/content
```

## Pfevtsg
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomsg_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomsg_profile/content
drush dcer file --folder=profiles/eventspfizerprocomsg_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomsg_profile/content
```

## Pfevtph
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevtph/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer node --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer media --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprocomph_profile/content  
drush dcer user --folder=profiles/eventspfizerprocomph_profile/content
drush dcer file --folder=profiles/eventspfizerprocomph_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprocomph_profile/content
```

## Pfevttw

- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfevttw/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/eventspfizerprotw_profile/content  
drush dcer node --folder=profiles/eventspfizerprotw_profile/content  
drush dcer block_content --folder=profiles/eventspfizerprotw_profile/content  
drush dcer media --folder=profiles/eventspfizerprotw_profile/content  
drush dcer menu_link_content --folder=profiles/eventspfizerprotw_profile/content  
drush dcer user --folder=profiles/eventspfizerprotw_profile/content
drush dcer file --folder=profiles/eventspfizerprotw_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/eventspfizerprotw_profile/content
```
## Pfplmy
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfplmy/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer node --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer block_content --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer media --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer menu_link_content --folder=profiles/pfecpreventlahcommy_profile/content  
drush dcer user --folder=profiles/pfecpreventlahcommy_profile/content
drush dcer file --folder=profiles/pfecpreventlahcommy_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfecpreventlahcommy_profile/content
```

## Pfadpag
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfadpsg/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer node --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer block_content --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer media --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer menu_link_content --folder=profiles/pfeccovid19oralrxphcomph_profile/content  
drush dcer user --folder=profiles/pfeccovid19oralrxphcomph_profile/content
drush dcer file --folder=profiles/pfeccovid19oralrxphcomph_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfeccovid19oralrxphcomph_profile/content
```

## Pfemasia
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfemasia/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/psiasiadummycom_profile/content  
drush dcer node --folder=profiles/psiasiadummycom_profile/content  
drush dcer block_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer media --folder=profiles/psiasiadummycom_profile/content  
drush dcer menu_link_content --folder=profiles/psiasiadummycom_profile/content  
drush dcer user --folder=profiles/psiasiadummycom_profile/content
drush dcer file --folder=profiles/psiasiadummycom_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/psiasiadummycom_profile/content
```




## Pfpspau
- ==同步文件==
```shell
scp -r caneg@172.21.2.211:/var/www/pfpspau/source/docroot/app/sites/default/files ./source/docroot/app/sites/default/
```
- ==导出内容==
```shell
准备模块：default-content 和 default-content-extra，Database Sanitize

drush dcer shortcut --folder=profiles/pfizerflexau_profile/content  
drush dcer node --folder=profiles/pfizerflexau_profile/content  
drush dcer block_content --folder=profiles/pfizerflexau_profile/content  
drush dcer media --folder=profiles/pfizerflexau_profile/content  
drush dcer menu_link_content --folder=profiles/pfizerflexau_profile/content  
drush dcer user --folder=profiles/pfizerflexau_profile/content
drush dcer file --folder=profiles/pfizerflexau_profile/content
  注意文件名不能有空格，若运行命令报错文件不存在，运行cron清除临时文件
drush dcer taxonomy_term --folder=profiles/pfizerflexau_profile/content
```


```
<?php

namespace Drupal\pfpspau_coordinator\Form;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Url;
use Drupal\pfpspau_hcp\Services\HcpService;
use Drupal\pfpspau_user\Traits\ProfileTrait;
use Drupal\user\Entity\User;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides hcp profile form for Coo.
 */
class CooViewHcpProfileForm extends FormBase {

  use ProfileTrait;

  /**
   * ID of the user.
   *
   * @var int
   */
  protected $uid;

  /**
   * The messenger service.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The user service.
   *
   * @var \Drupal\pfpspau_hcp\Services\HcpService
   */
  protected HcpService $hcpService;

  /**
   * Constructs a CooViewHCPForm object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\pfpspau_user\Services\HcpService $user_service
   *   The hcp service.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    HcpService $user_service,
    MessengerInterface $messenger,
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->hcpService = $user_service;
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('pfpspau_hcp.hcp_service'),
      $container->get('messenger'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'coo_view_hcp_profile';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $uid = NULL): array {
    $this->uid = $uid;
    $user = User::load($uid);
    $profile = $this->hcpService->getProfile($user);
    $profile_form = $this->hcpService->getProfileForm($user);

    // Build profile basic information section.
    $form['info'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['coo_profile-detail'],
      ],
    ];
    $form['info']['header'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-header'],
      ],
    ];
    $form['info']['header']['title'] = [
      '#type' => 'markup',
      '#markup' => '<h2>' . $this->t('HCP profiles') . '</h2>',
    ];
    $url = Url::fromRoute('pfpspau_coordinator.edie_hcp_profile', ['uid' => $uid]);
    $form['info']['header']['edit'] = [
      '#type' => 'link',
      '#title' => $this->t('Edit'),
      '#url' => $url,
      '#attributes' => ['class' => ['edit-link-button']],
    ];

    $form['info']['fullname'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $form['info']['fullname']['field_first_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First name'),
      '#default_value' => $profile ? $profile->get('field_first_name')->value : '',
      '#required' => TRUE,
      '#maxlength' => 255,
      '#disabled' => TRUE,
    ];
    $form['info']['fullname']['field_last_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Last name'),
      '#default_value' => $profile ? $profile->get('field_last_name')->value : '',
      '#required' => TRUE,
      '#maxlength' => 255,
      '#disabled' => TRUE,
    ];

    $form['info']['identifier'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $form['info']['identifier']['field_ahpra_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('AHPRA number'),
      '#default_value' => $profile ? $profile->get('field_ahpra_number')->value : '',
      '#required' => TRUE,
      '#maxlength' => 13,
      '#disabled' => TRUE,
    ];
    $form['info']['identifier']['email'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Email'),
      '#default_value' => $user->getEmail(),
      '#required' => TRUE,
      '#disabled' => TRUE,
    ];

    $form['info']['state_and_hospital'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $form['info']['state_and_hospital']['field_state'] = [
      '#type' => 'select',
      '#title' => $this->t('State'),
      '#options' => $profile_form['field_state']['widget']['#options'] ?? [],
      '#required' => TRUE,
      '#disabled' => TRUE,
      '#default_value' => $profile ? $profile->get('field_state')->target_id : '',
    ];
    $form['info']['state_and_hospital']['field_hospital_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('The name of the hospital, clinic or pharmacy?'),
      '#default_value' => $profile ? $profile->get('field_hospital_name')->value : '',
      '#required' => TRUE,
      '#disabled' => TRUE,
      '#maxlength' => 50,
    ];

    $form['info']['speciality_and_postcode'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $form['info']['speciality_and_postcode']['field_speciality'] = [
      '#type' => 'select',
      '#title' => $this->t('Speciality'),
      '#options' => $profile_form['field_speciality']['widget']['#options'] ?? [],
      '#required' => TRUE,
      '#disabled' => TRUE,
      '#default_value' => $profile ? $profile->get('field_speciality')->target_id : '',
    ];
    $form['info']['speciality_and_postcode']['field_post_code'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Postcode'),
      '#default_value' => $profile ? $profile->get('field_post_code')->value : '',
      '#required' => TRUE,
      '#disabled' => TRUE,
      '#maxlength' => 4,
    ];

    $form['info']['specialty'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $other_specialty = $this->getTermByName('Other', 'speciality');
    $visible = [
      'select[name=field_speciality]' => ['value' => $other_specialty->id()],
    ];
    $form['info']['specialty']['field_other_speciality'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Other specialty'),
      '#default_value' => $profile ? $profile->get('field_other_speciality')->value : '',
      '#maxlength' => 25,
      '#disabled' => TRUE,
      '#states' => [
        'visible' => $visible,
        'required' => $visible,
      ],
    ];

    $form['info']['comment'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['form-container'],
      ],
    ];
    $form['info']['specialty']['field_comment'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Comment'),
      '#default_value' => $profile ? $profile->get('field_comment')->value : '',
      '#required' => TRUE,
      '#maxlength' => 4,
    ];

    $form['actions'] = ['#type' => 'actions'];

    $form['actions']['approve_action'] = [
      '#type' => 'submit',
      '#value' => $this->t('Approval'),
      '#name' => 'Approval',
      '#id' => 'approve_api_' . $uid,
      '#attributes' => [
        'class' => ['approve-action'],
      ],
    ];
    $form['actions']['reject_action'] = [
      '#type' => 'submit',
      '#value' => $this->t('Reject'),
      '#name' => 'Reject',
      '#id' => 'reject_api_' . $uid,
      '#attributes' => [
        'class' => ['reject-action'],
      ],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {

    $data = $form_state->getValues();
    $user = User::load($this->uid);
    $form_data = [
      'field_comment' => $data['field_comment'] ?? '',
    ];

    $field_mapping = array_combine(array_keys($form_data), array_keys($form_data));
    $this->hcpService->saveProfile($user, $form_data, $field_mapping);

    $triggering_element = $form_state->getTriggeringElement();
    $profile = $this->hcpService->getProfile($user);
    if ($profile) {
      if ($triggering_element['#id'] == 'approve_api_' . $this->uid) {
        $profile->set('field_validation_status', PROFILE_VALIDATION_APPROVE);
      }
      elseif ($triggering_element['#id'] == 'reject_api_' . $this->uid) {
        $profile->set('field_validation_status', PROFILE_VALIDATION_REJECT);
      }
      $profile->set('field_comment', $data['field_comment']);
      $profile->save();
      $this->messenger->addMessage($this->t('The application has been @action.', ['@action' => $triggering_element['#name']]));
    }
    else {
      $this->messenger->addError($this->t('System error. Please contact the administrator'));
    }
    // @todo Send email.
    $form_state->setRedirect('<front>');
  }

}

```