#### ==如何打补丁（Patch）==
1. 安装`patch`工具。
2. 根据补丁信息到对应目录
3. 执行命令
```patch
patch -p1 < /var/www/xxx.patch
```

# Pfizer 项目
需要==手动==应用补丁后在 sub_profile 文件夹下的 composer.json 文件中的 `extra` 选项中添加 `patches` 信息。
```JSON
"extra": {
        "_readme": [
            "This project is for Pfizer private use only.",
            "Despite the GPL-2.0 license, under no circumstances should the contents of this project including code, documentation or any other file contained herein be distributed, copied, shared or transferred in electronic or other format."
        ],
        "pfizer": {
            "skel": {
                "package": "pfizer/pfizer-skel-profile",
                "version": "4.1.1.0"
            }
        },
        // Attention format
        "patches": {
            "drupal/external_link_popup": {
                "Support token replacement": "https://www.drupal.org/files/issues/2024-04-22/external-link-popup-token-replacement-3442717-2.patch"
            }
        }
    },
```
# 正常情况（非Pfizer项目）

参考 MasterCard 项目，会==自动==应用
### `composer.json` 文件中与补丁相关的部分解释

在这个 `composer.json` 文件中，有几部分与补丁相关联。这些部分用于配置 `cweagans/composer-patches` 插件，以便在每次运行 `composer install` 或 `composer update` 时自动应用补丁。

#### 1. 安装 `cweagans/composer-patches` 插件

```json
"require": {
    ...
    "cweagans/composer-patches": "^1.7",
    ...
}
```

这一行确保了 `cweagans/composer-patches` 插件被安装，它是用于应用补丁的 Composer 插件。

#### 2. 允许插件

```json
"config": {
    "allow-plugins": {
        ...
        "cweagans/composer-patches": true
    },
    ...
}
```

这一部分确保 Composer 允许使用 `cweagans/composer-patches` 插件。

#### 3. 额外的配置信息

```json
"extra": {
    ...
    "enable-patching": true,
    ...
    "patchLevel": {
        "drupal/core": "-p2"
    },
    "patches": {
        ...
    }
}
```

- `"enable-patching": true`：确保补丁功能被启用。
- `"patchLevel": { "drupal/core": "-p2" }`：指定 `drupal/core` 需要使用 `-p2` 选项来应用补丁，通常是因为补丁文件路径的层级结构。`-p2` 意味着忽略路径中的前两个目录。
- `"patches"`：这个部分包含了所有补丁的配置信息。每个补丁关联一个或多个项目。

#### 4. 补丁配置

```json
"patches": {
    "drupal/core": {
        "https://www.drupal.org/project/drupal/issues/2747749": "https://www.drupal.org/files/issues/2024-03-14/2747749-56.patch",
        "https://www.drupal.org/project/drupal/issues/3049332": "https://www.drupal.org/files/issues/2024-03-11/drupal-core--2024-01-09--3049332-87.patch"
    },
    "drupal/layout_builder_st": {
        "https://www.drupal.org/project/drupal/issues/2747749": "https://git.drupalcode.org/project/layout_builder_st/-/merge_requests/5.diff",
        "https://drupal.org/node/3067646": "https://www.drupal.org/files/issues/2020-05-15/layout_builder_st-3067646-10.patch",
        "https://drupal.org/node/3108056": "https://www.drupal.org/files/issues/2021-06-11/layout_builder_st-3108056-8.patch",
        "https://drupal.org/node/3119208": "https://www.drupal.org/files/issues/2020-12-09/layout_builder_st-more-defensive-handling-3119208-4.patch",
        "https://www.drupal.org/project/layout_builder_st/issues/3420063": "https://www.drupal.org/files/issues/2024-02-22/3420063-15.patch",
        "https://www.drupal.org/project/layout_builder_st/issues/3371578": "./patchs/layout_builder_st/layout_builder_st.patch"
    },
    "drupal/paragraphs": {
        "https://www.drupal.org/project/paragraphs/issues/3090200": "https://www.drupal.org/files/issues/2020-07-08/access-controll-issue-3090200-22.patch"
    },
    "drupal/restrict_ip": {
        "https://www.drupal.org/project/restrict_ip/issues/3023784": "https://git.drupalcode.org/project/restrict_ip/-/merge_requests/14.diff"
    }
}
```

- `"drupal/core"`、`"drupal/layout_builder_st"`、`"drupal/paragraphs"`、`"drupal/restrict_ip"`：这些是需要应用补丁的具体项目。
- 每个项目下列出了一个或多个补丁，每个补丁都有一个描述（通常是链接到相关的 issue 页面）和一个实际的补丁文件 URL。

### 补丁配置示例

1. **drupal/core**
    - **补丁1**：
      - 描述：`https://www.drupal.org/project/drupal/issues/2747749`
      - 补丁文件：`https://www.drupal.org/files/issues/2024-03-14/2747749-56.patch`
    - **补丁2**：
      - 描述：`https://www.drupal.org/project/drupal/issues/3049332`
      - 补丁文件：`https://www.drupal.org/files/issues/2024-03-11/drupal-core--2024-01-09--3049332-87.patch`

2. **drupal/layout_builder_st**
    - 多个补丁文件，包含了从外部 URL 和本地文件（如 `./patchs/layout_builder_st/layout_builder_st.patch`）的补丁。

### 总结

通过上述配置，每次运行 `composer install` 或 `composer update`，`cweagans/composer-patches` 插件将会自动下载并应用配置的补丁，从而保证你的 Drupal 项目包含了这些修复和改进。