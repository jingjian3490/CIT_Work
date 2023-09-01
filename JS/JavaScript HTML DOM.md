#### 文档<mark style="background-color: #1EFF00; color: black">对象</mark>模型
==当网页被加载时，浏览器会创建页面的文档对象模型==
#### 对象的 HTML DOM 树
![[ct_htmltree.gif]]


```php
/* 设置普通文本的高亮背景颜色为黄色 */
::selection {
    background-color: #3165CF !important;
}


/* Highlight EDITOR */
/* Color also can: transparent */

.cm-s-obsidian span.cm-formatting-highlight, .cm-s-obsidian span.cm-highlight {
    background-color: #1EFF00;
    color: black;
    font-weight: bold;
}


/* Highlight PREVIEW */

.markdown-preview-view mark {
    background-color: #1EFF00;
    color: black;
    font-weight: bold;
}


```