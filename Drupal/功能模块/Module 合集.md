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

## Media & Media Library
用于创建 Media 字段和在文本编辑器中开启 drupal-media 标签

在Text format 的Full HTML中启用media，需要配置启用 Embed media: Config ---Content authoring --- Text formats and editors --- Full HTML --- Configure --- Embed media，启用之后还需要手动放置图标

For Drupal ==10==，need to create media type ==before== launch drupal-media tag to CKEditer ==5==.

## Geolocation & Geolocation - Google Maps API
Geolocation本身只存储经度和纬度，要结合 Map API才能显示地图。
安装Google Map API后要配置 Key。
创建字段类型为 Geolocation 的字段，display 要设置为 Geolocation Formatter - Map
#### 详解  Geolocation Formatter - Map 设置
##### 通用设置
###### ==1. Set map marker==
用来设置地图小按钮展示设置和点击地图小按钮后显示的信息
![[Pasted image 20230922173355.png]]
![[Pasted image 20230922173502.png]]

###### ==2. Centre override==
中心覆盖，启用 Fit location 后页面地图中心为字段的值， zoom 为缩放比例
![[Pasted image 20230922173811.png]]

##### Google Maps settings 
###### General
高度：像素， 宽度：屏幕比例， 默认地图类型
Zoom level：缩放聚焦等级，0最小，世界地图；20最大，街道级别
###### Behavior
控制mobile端地图行为，比如双手捏合缩放等

###### Map Features
==Map Control - StreetView==
控制是否出现小人，拖放到地图是可显示街景

==Map Control - Zoom==
控制地图比例按钮（+、-号）

## Redirect
==配置301重定向页面通==
1. **安装和启用Redirect模块：**

2. **配置重定向规则：**
    - 转到“`Configuration`”（配置）页面，然后选择“`Search and metadata`”（搜索和元数据）下的“URL redirects”（URL重定向）。
    - 点击“Add redirect”（添加重定向）按钮。
3. **填写重定向信息：**
    - 在"Redirect from"（重定向来源）中输入==原始URL==，别名不可以。
    - 在"Redirect to"（重定向到）中输入目标URL。
    - 在"Redirect status"（重定向状态）中选择"301 Moved Permanently"（301永久重定向）。
    - 点击“Save”（保存）按钮。


## Metatag Custom Routes (Paths)
单独为特定URL设置SEO数据
配置URI：`/admin/config/search/metatag/custom/create`

## Better Exposed Filters
为视图添加 reset 按钮，当暴露过滤器时。
1. **更多的显示选项**：BEF提供了额外的显示选项，如复选框、单选按钮、滑块等，以替代传统的下拉菜单或文本框。
    
2. **重置按钮**：如您所知，它允许添加一个重置按钮，使用户可以轻松清除所有过滤器设置并恢复到默认状态。
    
3. **自动提交过滤器**：可以设置视图在更改过滤器时自动提交，无需点击提交按钮。
    
4. **更好的过滤器分组**：BEF允许更灵活地对过滤器进行分组和排列，有助于创建更直观和用户友好的界面。
    
5. **高级过滤器样式**：提供了对过滤器元素的高级样式控制，比如自定义文本、属性等。
    
6. **过滤器依赖**：允许设置过滤器之间的依赖关系，例如，一个过滤器的选项可以基于另一个过滤器的选择动态变化。
    
7. **AJAX支持**：BEF支持使用AJAX更新视图，提高页面响应速度和用户体验。
    
8. **更好的移动设备支持**：BEF的UI元素通常对移动设备更友好。
    
9. **多选过滤器**：允许用户一次选择多个过滤器选项，特别适用于分类和标签等场景。
    
10. **URL处理**：BEF可以优化过滤器参数在URL中的显示，使其更易于理解和分享。



## Token filter
Token Filter 模块是Drupal的一个扩展模块，==它为文本字段和文本格式添加了一个额外的过滤器==。这个过滤器允许你在文本中使用代币（tokens），并在渲染内容时自动将这些代币替换为相应的值。
参考：[[自定义 Token]]