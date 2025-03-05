
###### 在feature分支完成代码后落后于develop分支，需要进行rebase。
###### git checkout develop 
###### git pull
###### git checkout feature
###### git rebase develop
###### git push origin feature/PACP  -f
## 多次提交问题
###### 在本地featurecommit了多次，最后push到远程是不行，需要rebase -i
###### rebase -i HEAD~2  2就是在本地commit的次数
