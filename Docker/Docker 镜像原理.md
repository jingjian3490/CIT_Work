
## 操作系统组成部分

- 进程调度子系统
- 进程通信子系统
- 内存管理子系统 
- 设备管理子系统 
- 文件管理子系统 
- 网络通信子系统 
- 作业控制子系统 

==Linux文件系统==由bootfs和rootfs两部分组成（fs=file system）
-  bootfs：包含bootloader（引导加载程序）和 kernel（内核） 
-  rootfs： root文件系统，包含的就是典型 Linux 系统中的/dev， /proc，/bin，/etc等标准目录和文件
不同的linux发行版，==bootfs基本一样==，而rootfs不同，如ubuntu ，centos（因为Linux底层boostfs系统且被容器复用，而win底层文件管理系统不一样，所以Docker不可能有win系统容器）

## Docker 镜像原理

- Docker镜像是由特殊的文件系统叠加而成
- 最底端是 bootfs，并使用宿主机的bootfs 
- 第二层是 root文件系统rootfs,称为base image
- 然后再往上可以叠加其他的镜像文件
- 统一文件系统（Union File System）技术能够将不同的 层整合成一个文件系统，为这些层提供了一个统一的视角 ，这样就隐藏了多层的存在，在用户的角度看来，只存在 一个文件系统。
- 一个镜像可以放在另一个镜像的上面。位于下面的镜像称 为父镜像，最底部的镜像成为基础镜像。
当从一个镜像启动容器时，Docker会在最顶层加载一个读写文件系统作为容器新的镜像

###### Docker 镜像本质是什么？
是一个==分层==文件系统 
###### Docker 中一个centos镜像为什么只有200MB，而一个centos操作系统的iso文件要几个个G？
Centos的iso镜像文件包含bootfs和rootfs，而docker的centos镜像==复用宿主操作系统的bootfs==，只有rootfs和其他镜像层
###### Docker 中一个tomcat镜像为什么有500MB，而一个tomcat安装包只有70多MB？
由于docker中镜像是分层的，tomcat虽然只有70多MB，但他需要==依赖于父镜像和基础镜像==，所有整个对外暴露的 tomcat镜像大小500多MB

## docker容器虚拟化 与 传统虚拟机比较

相同：
- 容器和虚拟机具有相似的资源隔离和分配优势 

不同： 
- 容器==虚拟化==的是==操作系统==，虚拟机虚拟化的是==硬件==。 
- 传统虚拟机可以==运行不同的操作系统==，容器只能运行==同一类型操作系（Linux）==