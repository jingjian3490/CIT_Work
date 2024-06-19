### ==在构造函数中使用 AccountInterface 和 AccountProxy 都可以依赖注入成功==

推荐使用 `AccountInterface`

```PHP
  /**
   * AccountInterface.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  public function __construct(AccountInterface $current_user) {
    $this->currentUser = $current_user;
  }

  /**
   * T.
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user'),
    );
  }
```

```PHP
  /**
   * AccountProxy.
   *
   * @var \Drupal\Core\Session\AccountProxy
   */
  protected $currentUser;

  public function __construct(AccountProxy $current_user) {
    $this->currentUser = $current_user;
  }

  /**
   * T.
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user'),
    );
  }
```
# About

在Drupal中，`AccountProxy` 和 `AccountInterface` 是两个与用户帐户相关的重要接口和类，它们在不同的上下文中使用，以实现用户帐户的管理和操作。

### AccountInterface

`AccountInterface` 是一个接口，定义了用户帐户对象必须实现的方法。它提供了对用户帐户属性和操作的抽象定义。

#### 主要方法

- `id()`: 获取用户的ID。
- `getUsername()`: 获取用户名。
- `getEmail()`: 获取用户的电子邮件地址。
- `getRoles()`: 获取用户的角色。
- `hasPermission($permission)`: 检查用户是否具有特定权限。
- `isAuthenticated()`: 检查用户是否已通过身份验证。
- `isAnonymous()`: 检查用户是否为匿名用户。
### AccountProxy

`AccountProxy` 是 `AccountInterface` 的一个==具体实现类==，它通常用于获取当前用户的帐户信息。它是一个代理类，用于延迟加载当前用户帐户，以提高性能和减少不必要的加载。

#### 主要方法

`AccountProxy` 实现了 `AccountInterface`，因此它包含了所有 `AccountInterface` 的方法。此外，它还提供了一==些额外==的方法来管理和操作当前用户帐户。

### 区别

1. **接口 vs 实现**:
   - `AccountInterface` 是一个接口，定义了用户帐户对象必须实现的方法。
   - `AccountProxy` 是 `AccountInterface` 的一个具体实现类，用于获取当前用户的帐户信息。

2. **用途**:
   - `AccountInterface` ==通常用于方法参数类型提示==，确保传递的对象实现了用户帐户的基本操作。
   - `AccountProxy` 通常用于获取和操作当前用户的帐户信息，特别是在需要延迟加载用户信息的情况下。

3. **实例化**:
   - `AccountInterface` 不能直接实例化，因为它是一个接口。
   - `AccountProxy` 可以通过依赖注入或服务容器获取实例，例如通过 `\Drupal::currentUser()`。

### 总结

- **`AccountInterface`**: 定义了用户帐户必须实现的方法，提供了对用户帐户属性和操作的抽象定义。
- **`AccountProxy`**: `AccountInterface` 的具体实现类，用于获取和操作当前用户的帐户信息，提供了延迟加载的功能。

希望这些信息能帮助你更好地理解 `AccountProxy` 和 `AccountInterface` 的区别和用途。如果你有更多问题，欢迎继续提问。