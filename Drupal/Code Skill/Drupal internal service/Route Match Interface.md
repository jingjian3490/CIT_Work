```PHP
use Drupal\Core\Routing\RouteMatchInterface;


  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * Constructs a new CallDetailForm object.
   *
   * @param \Drupal\pfpspau_call\Services\CallService $call_service
   *   The call service.
   */
  public function __construct(
    RouteMatchInterface $route_match,
  ) {
    $this->routeMatch = $route_match;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_route_match'),
    );
  }

```

```yml
  pfpspau_patient.event_subscriber:
    class: Drupal\pfpspau_patient\EventSubscriber\RedirectSubscriber
    tags:
      - { name: event_subscriber }
    arguments: ['@current_user', '@current_route_match', '@session']
```