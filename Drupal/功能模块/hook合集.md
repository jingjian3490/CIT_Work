```php
关于paragraph预处理的规则：
themeName_preprocess_

```

#### ==hook_preprocess_html==
```php
function pfrpsg_preprocess_html(&$variables) {  
  $current_path = \Drupal::service('path.current')->getPath();  
  $internal = \Drupal::service('path_alias.manager')->getAliasByPath($current_path);
  // 在这个hook里面添加class 会添加到页面的body上
  $variables['attributes']['class'][] = 'path-55555'  
  if ($internal) {  
    $variables['attributes']['class'][] = 'path-' . substr($internal, 1);  
  }
}
```
![[Pasted image 20230921111313.png]]



#### ==hook_preprocess_views_view_field==
reference：[[Hook 修改视图字段显示]]
#### `hook_views_data_alter` & `hook_views_query_alter`
`hook_views_data_alter` 和 `hook_views_query_alter` 都是 Drupal 的 Views 模块中的钩子，用于修改 Views 查询和数据定义。它们的主要区别在于它们的作用和触发时机：

1. `hook_views_data_alter`：
    - 作用：`hook_views_data_alter` 主要用于修改 Views 模块中的数据定义，通常用于添加、修改或删除与数据库表或其他数据源相关的字段和表。
    - 触发时机：这个钩子在 Views 初始化阶段被触发，通常在视图的信息被加载时执行。这意味着它用于修改 Views 对数据源的认知，但在实际查询执行之前。

2.  `hook_views_query_alter`：
    - 作用：`hook_views_query_alter` 主要用于修改 Views 查询本身，包括修改查询条件、字段、排序方式等。它可以用于更改实际的 SQL 查询，以及在查询执行之前或之后进行自定义处理。
    - 触发时机：这个钩子在 Views 构建查询时被触发，通常在实际查询执行之前。这意味着它用于在查询被执行之前，对查询进行最后的修改和优化。

总结：
- `hook_views_data_alter` 用于修改 Views 对数据源的定义，它影响 Views 如何理解和使用数据。
- `hook_views_query_alter` 用于修改实际的查询，包括条件、字段和排序，它影响最终生成的 SQL 查询。


#### `hook_views_pre_render` & `hook_preprocess_views_view`
###### ==hook_views_pre_render==
- **执行时机**：在视图渲染之前，但在查询执行并且结果集==已经被==视图插件处理之后执行。
- **用途**：可以用来修改视图的结果集，比如添加、移除或改变记录的内容，或者根据结果集的内容改变视图的设置（如标题、按钮等）。
- **操作范围**：操作的是视图对象本身，你可以访问和修改视图的结果集和设置。
在视图渲染成HTML之前，在查询执行和处理结果之后，对视图的结果进行操作或修改。使用这个钩子来更改或增强视图的输出。
```php
function eventhub_search_views_pre_render(ViewExecutable $view) {
 if ($view->id() == 'search' && $view->current_display == 'search') {
    $keyword = \Drupal::request()->query->get('keyword', '');
    if (isset($view->header['area']) && $keyword == '') {
      unset($view->header['area']);
    }
  }
}
```
###### ==hook_preprocess_views_view==
- **执行时机**：在视图渲染为HTML之前，它是一个==主题预处理==钩子，用于准备模板变量。
- **用途**：用来添加或修改传递给视图模板的变量。这可以包括添加新的变量、改变类或属性、或者其他任何你想在模板中使用的数据。
- **操作范围**：操作的是模板变量，这些变量将会被==传递==到`.html.twig`文件中去渲染输出。
```php
function eventhub_register_preprocess_views_view(array &$variables) {  
  /**  
   * @var \Drupal\views\ViewExecutable $view  
   */  
  $view = $variables['view'];  
  if ($view->id() != 'pre_registration' || $view->current_display != 'event_list') {  
    return;  
  }  
  $route = \Drupal::routeMatch();  
  if ($route->getRouteName() != 'view.pre_registration.event_list') {  
    return;  
  }  
  $event = $route->getParameter('event');  
  if (empty($event)) {  
    return;  
  }  
  $current_path = \Drupal::request()->getPathInfo();  
  $upload_button = [  
    'title' => t('Upload pre-registration'),  
    'url' => Url::fromRoute('eventhub_register.pre_registration_import_csv', 
                          ['node' => $event], 
                          ['query' => ['destination' => $current_path]]),  
    'attributes' => [  
      'class' => [  
        'button',  
        'button--action',  
        'button--primary',  
        'button--small',  
      ],    
    ],  
  ];  
  $back_button = [  
    'title' => t('Back to event list'),  
    'url' => Url::fromRoute('view.cms_event_list.cms_event_page'),  
    'attributes' => [  
      'class' => ['button', 'button-action', 'button--small'],  
    ],  
  ];  
  $links = [$back_button];  
  /**  
   * @var \Drupal\eventhub_attend\Services\AttendeeService $attendee_service  
   */  
  $attendee_service = \Drupal::service('eventhub_attend.attendee_service');  
  if (!$attendee_service->hasAttendee(intval($event))) {  
    array_unshift($links, $upload_button);  
  }  
  // Add action button to the header.  
  $action_buttons = [  
    '#theme' => 'links__action_links',  
    '#links' => $links,  
    '#attributes' => [  
      'class' => ['action-links'],  
    ],    
    '#wrapper_element' => 'ul',  
  ];  
  $button_markup = \Drupal::service('renderer')->renderRoot($action_buttons);  
  $variables['header']['area']['content']['custom_button'] = ['#markup' => $button_markup];  
}
```
###### 区别总结

- `hook_views_pre_render` 更多地关注于操作视图的数据和配置，而 `hook_preprocess_views_view` 更多地关注于改变视图模板的渲染输出。
- `hook_views_pre_render` 在视图渲染过程中更早被调用，允许对数据进行更底层的修改；`hook_preprocess_views_view` 在视图即将渲染成HTML时被调用，关注于如何将数据展示给用户。

#### ==hook_theme_suggestions_HOOK_alter== & ==hook_theme_suggestions_alter==
在Drupal中，`hook_theme_suggestions_HOOK_alter`和`hook_theme_suggestions_alter` 钩子用于动态地添加或更改Twig模板建议。
这些钩子允许您根据某些条件（例如内容类型、角色、路径等）为不同的Drupal实体（如区块、页面、表单等）提供不同的模板文件。
###### 简单示例：
```php
/**
 * Implements hook_theme_suggestions_HOOK_alter() for node templates.
 */
function mymodule_theme_suggestions_node_alter(array &$suggestions, array $variables) {
  $node = $variables['elements']['#node'];

  if ($node->getType() == 'article') {
    $suggestions[] = 'node__article__' . $node->id();
  }
}
```
在上面的代码中，我们实现了一个针对节点（node）的模板建议钩子。当节点的类型为“文章”（article）时，我们添加一个新的模板建议，该建议将仅适用于具有特定ID的文章节点。这意味着您可以创建一个针对具有特定ID的文章节点的自定义模板，例如：`node--article--1.html.twig`。

==添加Form自定义模板==
```php
/**  
 * Implements hook_theme_suggestions_HOOK_alter() for form. 
 */
function pfrpsg_theme_suggestions_form_alter(array &$suggestions, array $variables) {  
  if (isset($variables['element']['#form_id'])) {  
    $suggestions[] = 'form__' . str_replace('-', '_', $variables['element']['#form_id']);  
  }
}

/**  
 * Implements template_theme_suggestions_alter(). 
 * 
 * Add form suggestions. 
 */
 function adpsg_theme_suggestions_alter(array &$suggestions, array $variables, $hook) {  
  if ($hook == 'form' && !empty($variables['element']['#id'])) {  
    $suggestions[] = 'form__' . str_replace('-', '_', $variables['element']['#id']);  
  }
}
```
使用`str_replace`函数将`#form_id`中的破折号（-）替换为下划线（\_），这是一个很好的做法.
`hook_theme_suggestions_alter`更加通用，可以用于所有类型的实体。这给了更多的灵活性，但也可能需要更复杂的逻辑。
 ==自定义 Error Page==
除了在CMS中配置，也可以使用 hook进行处理
```php
/**  
 * Implements hook_theme_suggestions_HOOK_alter(). 
 */
function evthub_theme_suggestions_page_alter(array &$suggestions, array $variables) {  
  $route_name = \Drupal::routeMatch()->getRouteName();  
  switch ($route_name) {  
    case 'system.401':  
    case 'system.403':  
    case 'system.404':  
      // Unauthorized Access.  
      $suggestions[] = 'page__error';  
      break;  
  }
}
```
Drupal将尝试使用名为 `page--error.html.twig` 的模板文件来渲染这些错误页面，如果该模板存在的话。


#### `hook_token_info` & `hook_tokens`
[[自定义 Token]]
#### `hook_entity_load` & `hook_ENTITY_TYPE_load`

`hook_entity_load`和`hook_ENTITY_TYPE_load`是两个用于拦截并响应实体加载事件的钩子（Hooks）。都允许开发者在实体被加载到内存中时执行自定义代码，但应用范围和用途有所不同。
##### hook_entity_load

- **应用范围**：`hook_entity_load`是一个==通用==钩子，它在**任何类型的实体被加载时**都会被调用。这意味着无论是节点（Node）、用户（User）、评论（Comment）还是任何自定义实体，只要它们被加载，这个钩子就会触发。
- **执行时机**：当一个或多个实体被加载到内存中后，Drupal核心会调用此钩子。它传递给钩子的参数包括一个实体对象的数组和实体类型。
- **用途**：这个钩子通常用于需要对所有类型的实体执行操作的情况，例如记录日志、修改实体属性等。
- **示例**：
  ```php
  function mymodule_entity_load(array $entities, $entity_type) {
    foreach ($entities as $entity) {
      // 对所有类型的实体执行某些操作
      // 例如，为所有实体添加一个自定义属性
      $entity->custom_property = 'Custom value';
    }
  }
  ```
##### hook_ENTITY_TYPE_load

- **应用范围**：`hook_ENTITY_TYPE_load`是一个特定类型的实体钩子，它只在特定类型的实体被加载时触发。`ENTITY_TYPE`应该被替换为目标实体类型的机器名称，例如`node`、`user`等。
- **执行时机**：与`hook_entity_load`类似，当指定类型的一个或多个实体被加载到内存中后，Drupal核心会调用此钩子。它传递给钩子的参数包括一个实体对象的数组。
- **用途**：这个钩子用于对特定类型的实体执行操作，例如只修改用户实体或只修改节点实体。
- **示例**：
  ```php
  function mymodule_node_load(array $nodes) {
    foreach ($nodes as $node) {
      // 仅对节点实体执行操作
      // 例如，为所有节点添加一个自定义属性
      $node->custom_node_property = 'Node-specific custom value';
    }
  }
  ```
##### 实际使用案例
假设正在开发一个模块，需要为所有用户实体添加一个字段值，表明它们是否已经完成了某项配置。
使用`hook_user_load`（实际上是`hook_ENTITY_TYPE_load`的一个实例，其中`ENTITY_TYPE`为`user`）:

```php
function mymodule_user_load(array $users) {
  foreach ($users as $user) {
    // 检查并设置用户是否完成了配置的属性
    $user->completed_setup = mymodule_check_user_setup($user);
  }
}
```

这个示例中，`mymodule_check_user_setup`是一个假设的函数，用于检查用户是否完成了某项配置，并且仅在用户实体加载时运行，这样可以保证只在需要时才执行这些额外的检查。
#### ==hook_entity_storage_load==
从功能上看，`hook_entity_storage_load` 和 `hook_entity_load` 都可以用于在实体加载时进行数据的修改或添加。然而，选择使用哪一个hook主要取决于你的具体需求，以及何时你想介入实体的加载过程。
1. **hook_entity_storage_load**：
   - **触发时机**：在实体数据从数据库加载到PHP内存中之后，实体对象被构建之前。这意味着此时对实体的修改是在所有默认的字段值被设置之前进行的。
   - **使用场景**：适用于需要根据存储数据快速调整或添加数据，而这些数据不依赖于实体类型系统完全处理完毕的状态。例如，快速计算出一些值，或者基于原始数据调整实体属性，这些属性不需要依赖于其他系统逻辑或实体方法。
2. **hook_entity_load**：
   - **触发时机**：在实体对象完全构建好，所有字段和方法都已就绪可以使用之后。这是对实体最终形态的修改，所有默认的处理逻辑（包括字段API的处理）都已完成。
   - **使用场景**：适用于那些需要依赖实体完整状态的操作，比如添加依赖于其他字段计算的新字段，或执行复杂的数据整合和校验。
##### 替换可能性的讨论
虽然在某些情况下这两个hooks看起来可以互换，但它们在实体加载生命周期中的作用点有细微的差别。例如，如果你需要在实体上设置一个依赖于其他字段（这些字段可能通过其他模块的hook_entity_load进行了修改）的字段，那么 `hook_entity_load` 是更安全的选择，因为它保证了所有处理在你的hook执行前都已完成。

##### 使用案例：hook_entity_storage_load

假设你正在管理一个电子商务网站，需要在用户的购物车实体中添加一个临时计算字段，该字段用于显示购物车中所有商品的总重量。这个字段仅基于当前购物车的内容计算，不需要保存到数据库中。
你可以实现 `hook_entity_storage_load` 来添加这个字段：
```php
function mymodule_entity_storage_load(array $entities, $entity_type) {
  if ($entity_type === 'shopping_cart') {
    foreach ($entities as $entity) {
      $total_weight = 0;
      foreach ($entity->items as $item) {
        // 假设$item->weight已经包含了该商品的重量
        $total_weight += $item->weight * $item->quantity;
      }
      // 设置一个不存储在数据库中的临时字段
      $entity->total_weight = $total_weight;
    }
  }
}
```
##### 使用案例：hook_entity_load
考虑另一个场景，你需要在用户的个人资料页面显示他们的年龄，该年龄是根据存储在用户实体中的出生日期动态计算出来的。由于年龄会随时间变化而改变，你不希望将它存储在数据库中，而是每次加载用户实体时动态计算。
你可以使用 `hook_entity_load` 来实现这一点：
```php
function mymodule_entity_load(array $entities, $entity_type) {
  if ($entity_type === 'user') {
    foreach ($entities as $entity) {
      if (isset($entity->date_of_birth)) {
        $date_of_birth = new DateTime($entity->date_of_birth);
        $current_date = new DateTime();
        $age = $current_date->diff($date_of_birth)->y;
        // 将计算出的年龄添加到实体中
        $entity->age = $age;
      }
    }
  }
}
```

如果“购物车总重量”或“用户年龄”的计算依赖于通过其他模块或系统修改的字段，使用 `hook_entity_load` 将更为适合。但如果确信这些值的计算只依赖于数据库中直接加载的数据，并且对计算时机要求更为迅速，`hook_entity_storage_load` 可能是一个更高效的选择。
#### `hook_entity_preload`
`hook_entity_preload` 是一个在 Drupal 8.7.0 中引入的新hook，它允许模块在实体的默认加载过程之前介入。这个hook主要被设计来处理那些需要在标准实体加载流程之前，根据特定逻辑（如工作区或其他条件）加载不同修订版本的实体的场景。

使用 `hook_entity_preload` 的一个典型例子是，如果有一个模块需要根据用户的当前工作区加载特定的实体修订版本，而不是加载默认的修订版本。通过这个hook，可以在实体正常加载前，切换到这些特定的修订版本，确保系统使用的是适当的数据版本。

让我们通过一个具体的例子来解释 `hook_entity_preload` 的使用场景。

假设你正在开发一个内容管理系统，该系统支持内容的多个修订版本，并且有一个“工作区”功能，允许用户在不同的工作区中处理内容。用户可以在一个工作区中进行更改，而这些更改在发布之前对其他用户不可见。

在这种场景下，系统需要能够根据用户当前选择的工作区加载特定的内容修订版本，而不是总是加载最新的或默认的修订版本。这里，`hook_entity_preload` 就非常有用。

### 示例实现：

```php
/**
 * Implements hook_entity_preload().
 */
function mymodule_entity_preload(array $entities, $entity_type, $ids) {
  if ($entity_type === 'node') {
    $workspace_manager = \Drupal::service('workspace.manager');
    $current_workspace = $workspace_manager->getActiveWorkspace();

    foreach ($entities as $id => $entity) {
      // 检查实体是否在当前工作区中有修订版本
      $workspace_revision = mymodule_get_workspace_revision($entity, $current_workspace);

      if ($workspace_revision) {
        // 如果存在，用工作区的修订版本替换默认修订版本
        $entities[$id] = $workspace_revision;
      }
    }
  }
}

/**
 * 辅助函数，获取在特定工作区中的实体修订版本。
 */
function mymodule_get_workspace_revision($entity, $workspace) {
  // 假设函数逻辑是检查数据库中对应工作区的修订版本
  // 返回工作区的实体修订版本或null
}
```

在这个示例中，`hook_entity_preload` 用于在实体加载前，检查并替换成对应工作区中的修订版本。这样做可以确保系统根据当前工作区的上下文返回正确的数据，同时避免在实体加载之后进行不必要的再查询或数据替换，从而优化性能。

这种方法在处理需要根据用户会话或其他动态上下文显示不同数据版本的应用程序时非常有用。它特别适用于复杂的内容管理系统、多版本控制系统以及需要高度定制化加载逻辑的企业级应用。