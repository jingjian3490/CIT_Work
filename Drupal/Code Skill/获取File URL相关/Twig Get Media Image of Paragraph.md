
![[Pasted image 20231114164149.png]]
###### 这是我创建的Paragraph，field_video_image 的 Entity reference 是media，media只有一个Image类型的字段field_media_image。 现在我==复写Paragraph的twig模板==文件，我需要获取 field_video_image字段图片的路径，应该怎么办

在Drupal 8 及以上版本中，要获取媒体实体中的图片字段的URL，通常需要使用`file`对象的`createFileUrl`方法。以下是一个在Twig模板中获取图片URL的示例：

```twig
{% if content.field_video_image is not empty %}
  {% set image_entity = content.field_video_image['#items'].entity %}
  {% if image_entity.field_media_image is not empty %}
    {% set image_file = image_entity.field_media_image.entity.fileuri %}
    {% set image_url = file_url(image_file) %}
    {{ image_url }}
  {% endif %}
{% endif %}
```
这段代码首先检查`field_video_image`字段是否不为空。如果不为空，它获取字段指向的媒体实体。然后，它检查媒体实体上的`field_media_image`字段是否存在，并获取与之关联的文件URI。最后，`file_url`函数用于转换文件URI为一个完整的URL。