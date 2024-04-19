## ==功能测试具体方法==
#### 关于断言元素存在
```php
// 断言元素存在， id选择器
<div id="block-sitebranding">
    <a href="/" rel="home" undefined="1">
      <img src="/profiles/eventspfizerprocompk_profile/themes/evtpk/logo.svg" alt="Home">
    </a>     
</div>
$assert_session->elementExists('css', '#block-sitebranding');

// 断言元素存在， 类选择器，注意嵌套
<div class="start-quiz">
  <a class="button button-arrow agree-checked" href="/quiz-page" >Assess My Condition</a>
</div>
$assert_session->elementExists('css', '.start-quiz .button.button-arrow.agree-checked');
```
###### ==断言复选框存在==
`'input.form-checkbox[type="checkbox"]'`: 这是一个CSS选择器，用于指定要查找的元素。它查找所有的 `<input>` 元素，这些元素同时具有 `form-checkbox` 的类，并且它们的类型（`type`）是 `checkbox`。
```php
<input class="form-checkbox" type="checkbox">
$assert_session->elementExists('css', 'input.form-checkbox[type="checkbox"]');
```
#### 关于断言元素包含特定文本内容
```php
// 断言元素包含特定文本内容
<div class="start-quiz">
  <a class="button button-arrow agree-checked" href="/quiz-page" >Assess My Condition</a>
</div>

$assert_session->elementTextEquals('css', '.start-quiz .button.button-arrow.agree-checked', 'Assess My Condition');
```
#### 关于断言页面存在链接，特定文本&元素存在链接
```php
// 断言页面存在链接
$assert_session->linkByHrefExists('/quiz-page');

// 断言链接文本和 `href` 属性
// 查找文本为 "Assess My Condition" 的链接元素
$link_element = $assert_session->elementExists('named', ['link', 'Assess My Condition']);
// 获取该元素的 href 属性
$href = $link_element->getAttribute('href');
// 断言 href 属性是否正确
$this->assertEquals('/quiz-page', $href);


// 使用CSS选择器定位特定元素
$link_element = $assert_session->elementExists('css', '.start-quiz .button.button-arrow.agree-checked');
// 获取元素的 href 属性
$href = $link_element->getAttribute('href');
// 获取元素的文本
$link_text = $link_element->getText();
// 断言 href 属性和链接文本
$this->assertEquals('/quiz-page', $href);
$this->assertEquals('Assess My Condition', $link_text);
```

#### 设置Cookie

```php
$this->getSession()->setCookie('Cookie_key', 'Cookie_value');
```

