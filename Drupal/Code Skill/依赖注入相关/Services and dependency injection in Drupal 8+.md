# Intro
在Drupal 8中，==服务是由服务容器管理的任何对象==。Drupal 8引入了服务的概念来==解耦可重用==的功能，并通过将这些服务注册到服务容器中，使其可插拔和可替换。

Each service can also depend on other services. Define a dependency on a service by prefixing the name of the dependee service with an `@` sign, like `@language_manager`. (The `@` sign is needed to tell Drupal that the argument is a service. If we omitted the `@` sign, the argument would be a simple string).


# Accessing services

最佳实践是不要调用全局服务容器，而是将所需的服务==作为参数==传递给构造函数，或者通过服务设置器方法注入所需的服务。

### Using dependency injection

依赖注入是Drupal 8中访问和使用服务的首选方法，应该尽可能使用它。不是调用全局服务容器，而是将服务作为参数传递给构造函数或通过setter方法注入。

==显式地传入对象所依赖的服务称为依赖注入==。在一些情况下，依赖关系在==类构造函数==中显式传递。例如，路由访问检查器获取在服务创建中注入的当前用户，以及在检查访问时传递的当前请求。您还可以使用setter方法来设置依赖项。

### Using global functions

The global Drupal class provides static methods to access several of the most common services. For example, `Drupal::moduleHandler()` will return the module handler service or `Drupal::translation()` will return the string translation service.


# Defining  Services

使用 module.services.yml 文件定义服务，文件结构应该和 core.services.yml 文件结构一样。


### Defining service by fully qualified name of PHP namespace

不需要为服务添加机器名称，可以简单地使用全限定名代替，如
```yaml
services:
  Drupal\coffee_shop\Service\Barista:
    class: Drupal\coffee_shop\Service\Barista
    arguments: ['@config.factory']
```

然后通过PHP命名空间检索服务，如
```php
$barista = \Drupal::getContainer()
  ->get(Barista::class);
```

Here is an example with the extra abstraction layer with a service machine name, which means too much work (old approach):

```php
\Drupal::service('modulename.service_machinename');
```

# Autowiring services

# Injecting dependencies into controllers, forms and blocks

### Dependency Injection for a Form

Forms that require a Drupal service or a custom service should access the service using dependency injection.

An example form  uses the 'current_user' service to get the uid of the current user. File contents of `/modules/example/src/Form/ExampleForm.php` if the module is in `/modules/example`:

```php
<?php

namespace Drupal\example\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Implements an example form.
 */
class ExampleForm extends FormBase {

  /**
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * @param \Drupal\Core\Session\AccountInterface $account
   */
  public function __construct(AccountInterface $account) {
    $this->account = $account;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Instantiates this form class.
    return new static(
      // Load the service required to construct this class.
      $container->get('current_user')
    );
  }

  /**
   * {@inheritdoc}.
   */
  public function getFormId() {
    return 'example_form';
  }

  /**
   * {@inheritdoc}.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    // Get current user data.
    $uid = $this->account->id();
    
    // ...
  }
  
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // ...
  }
}
```

[[为什么为form、block进行依赖注入时需要实现create方法]]
实现了create方法就不用在service.yml文件添加相关信息了






