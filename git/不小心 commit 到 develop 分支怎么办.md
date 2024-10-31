## 问题描述

在开发过程中，开发者不小心直接在 develop 分支上进行了提交（commit）。这违反了团队的开发规范，正确的做法应该是：

1. 创建新的 feature 分支
2. 在 feature 分支上进行开发和提交
3. 创建 Pull Request 进行代码审查
4. 审查通过后合并到 develop 分支

## 解决方案

```bash
git checkout develop
git reset HEAD~1
```
### ==这会撤销最后一次提交，但保留更改在工作目录中。==

