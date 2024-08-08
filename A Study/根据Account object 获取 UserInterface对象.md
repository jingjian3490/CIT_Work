在Drupal中，如果你有一个实现了 `AccountInterface` 或 `AccountProxyInterface` 的对象，并且你需要获取 `UserInterface` 对象（==即完整的用户实体==），你可以使用用户ID来加载完整的用户实体。

以下是如何实现的具体步骤和代码示例：

### 1. 获取 `AccountInterface` 或 `AccountProxyInterface` 对象

### 2. 使用用户ID加载 `UserInterface` 对象

一旦你有了一个 `AccountInterface` 或 `AccountProxyInterface` 对象，可以通过用户ID加载完整的用户实体（即 `UserInterface` 对象）：

```php
  public function someFunction() {
    $account = $this->currentUser;

    // 获取用户ID
    $uid = $account->id();

    // 加载完整的用户实体
    $user = User::load($uid);

    if ($user) {
      // 现在你可以使用 $user 作为 UserInterface 对象
      // 例如获取用户名
      $username = $user->getUsername();
    }
  }

```
