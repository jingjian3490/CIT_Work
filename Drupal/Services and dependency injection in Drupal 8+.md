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

使用 module.services.yml 文件定义访问，文件结构应该和 core.services.yml 文件结构一样。

https://www.drupal.org/node/2122195
https://www.drupal.org/docs/drupal-apis/services-and-dependency-injection/services-and-dependency-injection-in-drupal-8