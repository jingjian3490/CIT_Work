##### ==1. Drush user: unblock [username]==

`drush user:unblock pfizer-admin` 这个命令用于解锁 Drupal 系统中的用户账号。在这个例子中，它特别用于解锁用户名为 `pfizer-admin` 的账号。如果这个账号之前因为某些原因（如密码尝试失败次数过多等）被锁定，执行这个命令后，该账号将重新被激活，用户可以正常登录和使用 Drupal 系统。

如：同步dev数据库后不能使用 /user  + pfizer-admin 登录。
##### ==2. drush uli [username]==

解锁用户账户后，如果需要为用户生成一次性登录链接，可以使用 `Drush uli [username]`，其中 `[username]` 替换为需要生成链接的用户名。例如，对于 `pfizer-admin` 用户，命令将是：`drush uli pfizer-admin`

执行此命令后，Drush 将输出一个一次性登录链接。用户可以通过这个链接直接登录 Drupal 网站，而不需要输入密码。登录后，用户通常会被引导到用户账户页面，从那里他们可以重置自己的密码。