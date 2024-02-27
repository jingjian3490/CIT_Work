列出所有安装的WSL分发版
```sh
wsl --list --verbose
```

停止 wsl 服务
```sh
wsl --shutdown
```

卸载指定 Ubuntu 分发版
```sh
wsl --unregister 分发版名称
```

设置指定 Ubuntu 分发版作为默认分发版
```sh
wsl --set-default 分发版名称
```
