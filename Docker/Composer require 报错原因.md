Pfizer 项目在 `composer.json` 文件配置了使用私有Packagist仓库`https://repo.packagist.com/pfizer/`
当拉取库时，没有正确的用户名、密码、网络等，将不能正常拉取。
```json
{  
    "name": "pfizer/edisonknowpneumoniasgsg",  
    "description": "Pfizer edisonknowpneumoniasgsg site project.",  
    "license": "GPL-2.0+",  
    "type": "project",  
    "repositories": [  
        {"type": "composer", "url": "https://repo.packagist.com/pfizer/"},  
        {"packagist.org": false}  
    ],
```

如果您的目标是改用官方Packagist仓库进行包的安装和管理，需要进行以下修改：
1. **移除私有仓库配置**：删除或注释掉对`https://repo.packagist.com/pfizer/`的引用。
2. **恢复对官方Packagist.org的使用**：将`{"packagist.org": false}`这一行删除或更改为启用官方仓库的配置。
修改后的`repositories`字段应该像这样，如果您想完全移除对私有仓库的引用并恢复到默认状态（即只使用官方Packagist）：
```json
"repositories": [ ]
```
