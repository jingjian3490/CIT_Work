Drupal 的 ConfigForm API 使得模块开发者能够创建和管理配置表单，这对于存储模块设置、偏好和其他配置数据至关重要。这些表单通过 Drupal 的配置系统进行数据的保存和检索，使得配置数据可以跨多个环境（如开发、测试和生产）轻松迁移。

### ConfigFormBase 类

`ConfigFormBase` 是 Drupal 提供的一个基础类，用于创建配置表单。它扩展了 `FormBase` 类，增加了一些特定于配置管理的方法。当你的表单旨在保存配置到系统中时，你应该继承 `ConfigFormBase` 类。

### 主要方法

以下是在 `ConfigFormBase` 类中通常会被重写的几个关键方法，正如您的示例代码所展示的：

- **getFormId()**: 返回一个唯一的表单ID，用于区分 Drupal 系统中的不同表单。

- **getEditableConfigNames()**: 返回一个包含配置对象名称的数组。这些配置对象将在表单保存时被编辑。这是表单安全工作的一部分，确保只有指定的配置可以被此表单更改。

- **buildForm()**: 构建表单的结构。这个方法接收一个表单数组和一个表单状态对象，并返回修改后的表单数组。在这个方法中，你可以定义表单字段和结构。

- **submitForm()**: 处理表单提交的逻辑。当表单被提交时，这个方法会被调用。这里你可以执行保存表单数据到配置的逻辑。

### Case
```php
<?php

namespace Drupal\pfpspau_hcp\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure Pending GRV access control settings for this site.
 */
class AccessPageConfigurationForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'pfpspau_hcp_configuration';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return ['pfpspau_hcp.config'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $config = $this->config('pfpspau_hcp.config');

    $form['routes_to_forbidden'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Routes to forbidden'),
      '#description' => $this->t(''),
      '#default_value' => $config->get('routes_to_forbidden'),
      '#rows' => 7
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('pfpspau_hcp.config')
      ->set('routes_to_forbidden', $form_state->getValue('routes_to_forbidden'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}
```
### 示例代码解释

您的示例代码定义了一个名为 `AccessPageConfigurationForm` 的配置表单类，用于配置站点的 “Pending GRV access control settings”。

- **getFormId() 方法** 返回表单的唯一ID `pfpspau_hcp_configuration`。

- **getEditableConfigNames() 方法** 返回包含单个配置对象名称 `pfpspau_hcp.config` 的数组。这意味着此表单将编辑名为 `pfpspau_hcp.config` 的配置。

- **buildForm() 方法** 创建表单界面，包括一个 `textarea` 类型的字段，允许用户输入要被禁止的路由（routes）。它使用配置系统检索和设置默认值。

- **submitForm() 方法** 在表单提交时被调用，更新 `routes_to_forbidden` 配置项的值并保存更改。

此示例清楚地展示了如何利用 `ConfigFormBase` 类来创建和管理 Drupal 站点配置的界面。通过定义 `buildForm` 和 `submitForm` 方法，您可以创建一个用户友好的界面来更新您的模块配置。这种方法使得模块设置的管理既简单又高效。