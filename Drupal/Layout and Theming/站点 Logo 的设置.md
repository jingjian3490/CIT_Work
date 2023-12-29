
 设置站点 Logo 有两种方法
#### Case 1 使用 Theme 文件夹中的文件

如果没有在 theme.info 文件中说明，默认只支持名为 logo.svg 的svg 格式的图片作为站点 logo. 图片路径为theme根目录下，与 .theme 文件统计。

如果要使用其他格式的图片，则要在 theme.info 文件中标明：
```yml
name: 'SG Know Pneumonia Theme'  
description: 'A theme for SG Know Pneumonia Website.'  
base theme: 'starterkit_theme'  
package: 'Core'  
  
core: 10.x  
type: theme  
core_version_requirement: ^10  
  
logo: logo.png

```

#### Case 2 在 CMS 中上传

次方法不知什么原因在MTD时Logo变为了临时图片显示不了，不推荐

