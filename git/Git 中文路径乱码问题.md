## Git的`core.quotepath`设置

- **当`core.quotepath`设置为`true`（默认值）时**，Git会将所有非ASCII文件路径和文件名转换为`\xxx`形式的ASCII表示，其中`\xxx`代表该字符的八进制ASCII码。这样做的初衷是为了避免在某些不支持非ASCII字符的终端或系统上显示问题，但是这会导致在支持UTF-8的现代系统上出现乱码。
- **当`core.quotepath`设置为`false`时**，Git会直接显示文件路径和文件名中的非ASCII字符（比如中文），而不进行转换。这意味着如果您的终端和操作系统配置为支持UTF-8，您就能正确看到中文文件名而不是乱码。
- 
==git config --global core.quotepath false==
```shell
caneg@WNB000194CHN MINGW64 ~/Documents/Obsidian Vault - Copy/ciandt (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   A Study/2023.08/23.08.28.md
        modified:   A Study/2023.09/23.09.12.md
        modified:   Drupal/Code Skill/Mail System.md
        deleted:    Drupal/Code Skill/Twig/Twig Tweak.md
        deleted:    "Drupal/Code Skill/Twig/\345\260\206PHP\347\261\273\347\232\204\345\207\275\346\225\260\346\263\250\345\206\214\345\210\260 Twig \346\250\241\346\235\277\345\274\225\346\223\216.md"
        modified:   "Drupal/Code Skill/\345\210\207\346\215\242\347\216\257\345\242\203/\345\207\206\345\244\207\344\270\212dev\346\225\260\346\215\256.md"
        modified:   "Drupal/Code Skill/\347\274\223\345\255\230/Cache tag \347\274\223\345\255\230\346\240\207\347\255\276.md"
        modified:   TODO.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        A Study/24.01.25.md
        A Study/24.02.01.md
        A Study/24.02.04.md
        "Drupal/Code Skill/Twig/Twig Tweak \346\250\241\345\235\227.md"
        "Drupal/Code Skill/Twig/Twig \350\277\207\346\273\244\345\231\250.md"
        "Drupal/Code Skill/Twig/\345\274\200\345\217\221\350\207\252\345\256\232\344\271\211 Twig \346\211\251\345\261\225.md"
        "Drupal/Code Skill/\347\274\223\345\255\230/Cache Contexts \347\274\223\345\255\230\344\270\212\344\270\213\346\226\207.md"
        "Drupal/Code Skill/\347\274\223\345\255\230/\347\274\223\345\255\230\346\240\207\347\255\276\345\222\214\347\274\223\345\255\230\344\270\212\344\270\213\346\226\207\345\214\272\345\210\253.md"
        "Drupal/Code Skill/\351\241\265\351\235\242\346\270\262\346\237\223/"
        "Drupal/\345\212\237\350\203\275\346\250\241\345\235\227/Token/"
        Project/

no changes added to commit (use "git add" and/or "git commit -a")

caneg@WNB000194CHN MINGW64 ~/Documents/Obsidian Vault - Copy/ciandt (master)
$ git config --global core.quotepath false

caneg@WNB000194CHN MINGW64 ~/Documents/Obsidian Vault - Copy/ciandt (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   A Study/2023.08/23.08.28.md
        modified:   A Study/2023.09/23.09.12.md
        modified:   Drupal/Code Skill/Mail System.md
        deleted:    Drupal/Code Skill/Twig/Twig Tweak.md
        deleted:    Drupal/Code Skill/Twig/将PHP类的函数注册到 Twig 模板引擎.md
        modified:   Drupal/Code Skill/切换环境/准备上dev数据.md
        modified:   Drupal/Code Skill/缓存/Cache tag 缓存标签.md
        modified:   TODO.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        A Study/24.02.01.md
        A Study/24.02.04.md
        Drupal/Code Skill/Twig/Twig Tweak 模块.md
        Drupal/Code Skill/Twig/Twig 过滤器.md
        Drupal/Code Skill/Twig/开发自定义 Twig 扩展.md
        Drupal/Code Skill/缓存/Cache Contexts 缓存上下文.md
        Drupal/Code Skill/缓存/缓存标签和缓存上下文区别.md
        Drupal/Code Skill/页面渲染/
        Drupal/功能模块/Token/
        Project/

no changes added to commit (use "git add" and/or "git commit -a")
```