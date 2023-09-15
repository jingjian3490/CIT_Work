## Classy Paragraphs
Drupal的Classy Paragraphs模块是为Drupal Paragraphs模块设计的，旨在提供一种更灵活的方法来`添加和修改段落的CSS类`。
Drupal 9.5使用Classy Paragraphs模块的简要指导：
1. **安装Classy Paragraphs模块**：
    - 首先，您需要下载和安装Classy Paragraphs模块。这可以通过Drupal的管理界面或使用Drush/Composer来完成。
2. **配置Classy Paragraphs模块**：
    - 安装模块后，导航到管理> 结构> 段落类型。
    - 选择要添加CSS类的段落类型。
    - 在“管理字段”选项卡下，点击“添加字段”。
    - ==选择“引用” - > “其他” - > “Classy paragraphs”==作为您的字段类型。
    - 为此字段命名并配置任何其他设置。
    - 然后，您可以为该段落类型定义特定的CSS类。
3. **为内容添加Classy Paragraphs**：
    - 当编辑或创建内容时，您可以选择特定的段落并为其分配前面定义的CSS类。
4. **定制样式**：
    - 一旦为特定段落分配了CSS类，您可以在网站的主题中为这些类添加特定的样式。

## Paragraph View Mode
为Paragraph添加一个字段，用来选择要渲染的Paragraph View Mode。
1. 安装
2. 为Paragraph添加除default外的其他view mode。
3. 在 Paragraph 的edit 页面勾选 `Enable Paragraph view mode field on this paragraph type`.

## Responsive Image
Responsive Image模块是Drupal的核心模块之一，旨在帮助网站开发者更好地处理不同屏幕大小和设备分辨率下的图像显示问题。
###### 1. Install the Responsive Image module (using Composer or Drupal UI).
###### 2. Setup the breakpoints.
在主题的根目录下创建 `themeName.breakpoints.yml` 文件
```yml
adpsg.small:  # adpsg is themeName, 定义了一个名为"small"的断点
  label: small  
  # 媒体查询，指定应用该断点的条件, 为空字符串，没有具体的媒体查询条件。意味着在所有屏幕宽度下都生效。
  mediaQuery: '' 
  # 断点的权重,用于确定响应式设计中哪个断点应该在其他断点之前应用。这里的权重是0，断点的优先级较低。
  weight: 0  
  # 断点的多重性。这里包括1x和2x,表示这个断点将根据设备的像素密度（DPI）来适应不同分辨率的屏幕
  multipliers:  
    - 1x  # 这是普通分辨率图像，通常用于标准分辨率设备
    - 2x  # 这是高分辨率图像，通常用于高DPI（Dots Per Inch）设备
adpsg.medium:  
  label: medium  
  # 这个断点将在屏幕宽度至少为768像素的条件下生效
  mediaQuery: 'all and (min-width: 768px)'  
  weight: 2  
  multipliers:  
    - 1x  
    - 2x  
adpsg.large:  
  label: large  
  # 这个断点将在屏幕宽度至少为1200像素的条件下生效
  mediaQuery: 'all and (min-width: 1200px)'  
  weight: 2  
  multipliers:  
    - 1x  
    - 2x
```
关于断点多重性：
- 当用户访问网站时，浏览器会检测用户设备的像素密度或分辨率。
- 根据检测结果，浏览器会选择加载适合用户设备的图像版本。
- 如果用户使用标准分辨率设备（1x DPI），浏览器将加载1x 图像以确保加载速度和带宽效率。
- 如果用户使用高DPI设备（2x DPI），浏览器将加载2x 图像，以提供更清晰的图像质量，但可能需要更多带宽和加载时间。
这种机制确保了用户在不同设备上获得最佳的图像显示质量，同时尽量减少了资源的浪费。网站开发人员需要为每个图像创建不同分辨率的版本，并将它们与相应的多重性断点相关联，以使浏览器能够根据用户设备的要求选择正确的图像版本。
###### 3. Create image styles.
去模块的设置页面创建。
###### 4. Set up the responsive image.
根据断点文件创建需要的Image Style
###### 5. Assign the responsive image style to the image field.
在 Content type、Paragraph的 `Manage display` 页面设置image 字段的 Format 为 Responsive image style 并配置