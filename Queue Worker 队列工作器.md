## Summary
在Drupal中，`QueueWorker` 注解用于定义一个队列工作器（queue worker）。这是一个特定于Drupal的概念，用于处理延迟执行或周期性任务，通常是处理大量数据或需要在后台运行的任务。

注解 `@QueueWorker` 定义了以下几个属性：

- `id`: 队列工作器的唯一标识符。
- `title`: 工作器的可读名称，通常用于管理员界面。
- `cron`: 指定队列工作器应该多久执行一次，这里的 `time = 60` 表示每60秒执行一次。

`cron` 属性用于指定 `QueueWorker` 的运行频率，但它确实与Drupal的cron系统关联。当Drupal的cron运行时，它会检查定义的队列工作器，并根据配置的时间间隔执行它们。

在`QueueWorker` 注解的 `cron` 属性中设置的值指定了队列工作器多久被触发一次。例如，如果设置为 `{"time" = 60}`，则意味着每当Drupal的cron任务运行时，如果距离上次执行此队列工作器已经过去了60秒或以上，那么这个队列工作器将被执行。

这并不意味着队列工作器会精确每60秒执行一次。实际的执行频率取决于Drupal cron任务的运行频率。如果Drupal的cron设置为每小时运行一次，那么即使队列工作器设置为每分钟执行，它实际上也只会在每次cron运行时执行一次。

## Case
`Pfevtsg， Drupal\eventhub_s3`
使用注释 API 添加队列，它们被视为插件。将队列工作器类放置在模块的 Plugin/QueueWorker 目录中，并为其定义 QueueWorker 注释，通常扩展 `QueueWorkerBase` 类，并实现 `processItem` 方法。
- 实现 `ContainerFactoryPluginInterface`，以便能够使用依赖注入
###### 定义 queue worker
```php
<?php  
  
namespace Drupal\eventhub_s3\Plugin\QueueWorker;  
  
use Drupal\Core\Logger\LoggerChannelFactoryInterface;  
use Drupal\Core\Messenger\MessengerTrait;  
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;  
use Drupal\Core\Queue\QueueWorkerBase;  
use Drupal\eventhub_s3\Services\ConnectService;  
use Symfony\Component\DependencyInjection\ContainerInterface;  
  
/**  
 * S3 handler. * * @QueueWorker(  
 *   id = "upload_s3_queue", *   title = @Translation("Upload to S3 queue"),  
 *   cron = {"time" = 60} * ) */
class UploadToS3Queue extends QueueWorkerBase implements ContainerFactoryPluginInterface {  
  
  use MessengerTrait;  
  
  /**  
   * The logger.   *   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface  
   */  protected $logger;  
  
  /**  
   * Connect to S3.   *   * @var \Drupal\eventhub_s3\Services\ConnectService  
   */  protected $connectService;  
  
  /**  
   * {@inheritdoc}  
   */  public function __construct(  
    array $configuration,  
    $plugin_id,  
    $plugin_definition,  
    LoggerChannelFactoryInterface $logger,  
    ConnectService $connect  
  ) {  
    parent::__construct($configuration, $plugin_id, $plugin_definition);  
    $this->logger = $logger;  
    $this->connectService = $connect;  
  }  
  /**  
   * {@inheritdoc}  
   */  public static function create(  
    ContainerInterface $container,  
    array $configuration,  
    $plugin_id,  
    $plugin_definition) {  
    $form = new static(  
      $configuration,  
      $plugin_id,  
      $plugin_definition,  
      $container->get('logger.factory'),  
      $container->get('eventhub_s3.connect')  
    );    $form->setMessenger($container->get('messenger'));  
    return $form;  
  }  
  /**  
   * {@inheritDoc}  
   */  public function processItem($data) {  
    $this->connectService->processFilesToS3($data);  
  }  
}
```
###### 使用 queue worker
在Drupal的队列系统中，`processItem` 方法的 `$data` 参数来源于队列中的项。当您将一个项加入队列时，这个项的数据就是 `$data`。这个数据是在您将任务加入队列时定义的，并且在队列工作器处理该项时作为参数传递给 `processItem` 方法。
```php
public function uploadFile() {  
  $event_ids = \Drupal::entityQuery('node')->condition('field_s3_status', [  
    EVENT_S3_STATUS_PENDING,  
    EVENT_S3_STATUS_FAILED,  
  ], 'IN')  
    ->accessCheck(FALSE)  
    ->execute();  
  
  if (!empty($event_ids)) {  
    $event_id_string = implode(', ', $event_ids);  
    \Drupal::logger('s3_cron_job')->info('Below events are collected to be uploaded: ' . $event_id_string);  
    // ----------- 使用 queue worker -------------
    $queue = $this->queueFactory->get('upload_s3_queue');  
    foreach ($event_ids as $event_id) {  
      $queue->createItem($event_id);  
    }  }  else {  
    \Drupal::logger('s3_cron_job')->info('No data should be uploaded to S3 today');  
  }}
```