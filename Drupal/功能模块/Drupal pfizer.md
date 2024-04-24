## 获取站点 Host

通常情况
```PHP
$base_url = $this->requestStack->getCurrentRequest()
->getSchemeAndHttpHost();
$base_url = $base_url . '/user/login';
```

Base Url 从设置里面拿一下吧，因为上线会有两个地址（一个内网和一个外网地址）
```PHP
use Drupal\Core\Site\Settings;

$base_url = Settings::get('pfizer_base_url') ?: $this->requestStack->getSchemeAndHttpHost();
```
