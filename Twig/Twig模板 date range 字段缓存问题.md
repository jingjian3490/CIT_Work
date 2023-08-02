使用 view 过滤出多个同 content type 的node时，一些字段使用 content. 来渲染输出时，会产生缓存问题，如date range 字段。
```twig
使用content.field_date_from_to.value产生缓存问题
{% if content.field_date_from_to %}  
  {{ content.field_date_from_to.value|date('d F Y') }}  
{% endif %}

使用node.field_date_from_to.value不产生缓存问题
{% if content.field_date_from_to %}  
  {{ node.field_date_from_to.value|date('d F Y') }}  
{% endif %}
```
![[Pasted image 20230731091949.png]]
![[Pasted image 20230731092121.png]]

