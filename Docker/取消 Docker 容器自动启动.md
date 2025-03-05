如果想一次性禁用所有容器的自动启动，你可以使用子命令来列出所有容器的 ID，并将它们的重启策略设置为`no`。你可以使用以下命令：
```sh
docker ps -q | xargs -r docker update --restart=no
```
这将获取==所有正在运行的==容器 ID，并且对每个 ID，使用`docker update`命令来设置重启策略。
请注意，`docker update`命令不会影响当前正在运行的容器的状态；它只会更新容器的配置，以便在下次 Docker 服务启动时应用。

#### Docker Compose
使用 `docker update` 命令直接修改容器的重启策略不会更改 Docker Compose 配置文件（`docker-compose.yml`）。`docker-compose.yml` 文件定义了如何构建和启动服务的指令，而 `docker update` 命令是直接影响运行中的容器。

如果使用了 ==Docker Compose== 并希望更改重启策略，你需要：

1. 在 `docker-compose.yml` 文件中为相关服务设置 `restart` 策略。例如：
```yml
services:   
  webapp:     
    image: example/webapp     
      restart: "no"
```

2. 之后运行 `docker-compose up -d` 来应用这些更改。Docker Compose 会根据 `docker-compose.yml` 文件中的定义来启动或重新创建服务。

请注意，如果你已经用 `docker update` 改变了容器的重启策略，但没有在 `docker-compose.yml` 中进行相应的更改，那么下次你使用 `docker-compose up` 或 `docker-compose down && docker-compose up` 命令时，`docker-compose.yml` 文件中的设置将会覆盖之前的更改。

因此，最好的做法是在 `docker-compose.yml` 文件中设置你想要的重启策略，并使用 Docker Compose 命令来管理容器。这样可以确保配置的一致性和可追踪性。