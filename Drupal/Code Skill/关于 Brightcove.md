#### 1. 复写模板根据 Brightcove id 显示video

在CMS中只需要输入 Brightcove video id 即可，然后通过复写相关 twig 模板拿到id填入固定位置即可。

```twig
{# 这里复写的是Paragraph的模板 #}

{# 获取media类型 Paragraph 字段 图片URL，用来给 Brightcove video 做封面，提高网站性能 #}
{% if content.field_video_image is not empty %}  
  {% set image_entity = content.field_video_image['#items'].entity %}  
  {% set image_file = image_entity.field_media_image.entity.fileuri %}  
  {% set image_url = file_url(image_file) %}  
{% endif %}

{# data-video-id 正确在网页即可渲染出 video。poster 这个参数就是用来提供封面的，可以不用。同时要注意 data-account 这个参数，需要询问#}  
{% if content.field_video_id is not empty %}  
  <video-js id="pfizer-player" data-video-id="{{ content.field_video_id.0['#context'].value }}"  
            data-account="1852113022001"  
            data-player="iJst0J4zh"  
            data-embed="default"  
            data-application-id  
            class="video-js"  
            controls  
            poster="{{ image_url }}"></video-js>  
{% endif %}
```

==相关链接==
https://docs.videojs.com/docs/guides/options.html