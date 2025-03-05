# 总览
一共3个页面，test-start、test、test-result。
#### test-start
所有 Access My Condition 的链接都会到这个页面，在此页面同意条款后才可以进入测试页面（检查是否选中了同意条款用的是HTML内置的属性）。点击同意测试并点击 `Start now` 按钮后会生成cookie：`Cookies.set('agreeDisclaimer', 'true');`
#### test
进入 test 页面就会设置cookie：poemTestResults 和 poemTestEmpty 默认值都是空数组和false。
```js
if (!Cookies.get('poemTestResults')) {  
  setCookie('poemTestResults', '[]');  
}  
if (!Cookies.get('poemTestEmpty')) {  
  setCookie('poemTestEmpty', 'false');  
}
```
poemTestResults 存储回答结果，poemTestEmpty 用于判断 用户回答数量是否大于等于6，小于则测试没有意义，需要重新测试。
#### test-result
主要是发送邮件按钮和生成PDF文件按钮，单机Email会弹出邮件输入框。
# Test-Start
主体是一个node，包括 top banner 和 bottom footer，中间是3个自定义 block，点击 `Start now` 按钮后会生成cookie：`Cookies.set('agreeDisclaimer', 'true');`。


###### 数据准备
```php
if (in_array($internal,  
[ALIAS_PATH_POEM_TEST_START, ALIAS_PATH_POEM_TEST_RESULT, ALIAS_PATH_MILD_AD])) {  
  $variables['alias_path'] = $internal;  
}
```
放置block使用 `twig_tweak` 模块在twig模板中放置，不在CMS的管理界面放置
```twig
{% if alias_path == '/assess-my-condition-start' %}  
  {{ drupal_entity('block', 'assess_my_condition_warning_message', check_access=false) }}  
  {{ drupal_entity('block', 'assess_my_condition_information', check_access=false) }}  
  {{ drupal_entity('block', 'assess_my_condition_how_to_answer', check_access=false) }}
```

###### 如果没有同意条款直接访问 Test 页面会跳转的 Start 页面逻辑：
在 `Drupal\pfadpsg_assess_my_condition\StackMiddleware;` 中实现
```php
// 检查是否同意条款  
$agreeDisclaimer = $service->checkAnswer($request, 'agreeDisclaimer');  
if ($requestPath == $alias_path_test && !$agreeDisclaimer) {  
  // 如果当前请求是test页面，并且不同意条款就重定向到start页面  
  return new RedirectResponse($alias_path_start);  
}
```

点击 `Start now` 按钮，去到 Test 页面。
# Test
主体也是一个node，就用了 Question 和 Questions 两个Paragraph 组成页面，对Paragraph模板进行复写来实现 `问题索引、问题选项和提交按钮`
###### 1. 准备数据：为每个 Question 段落 添加一个索引属性
```php
function adpsg_preprocess_field(&$variables) {  
  if (  
    $variables['field_type'] == 'entity_reference_revisions'  
    &&  
    $variables['element']['#items']->getItemDefinition()->getSetting('target_type') == 'paragraph'  
  ) {  
    foreach ($variables['items'] as $idx => $item) {  
      $variables['items'][$idx]['content']['#paragraph']->index = $idx;  
    }  
  }
}
```
###### 2. 复写 Question 模板
注意：每个 Question 都会执行这个模板
```twig

{% block content %} 
  {# 实现问题索引 #}
  <span class="question-index">{{ 'QUESTION' | t}} {{ paragraph.index + 1 }}</span>
  {# 字段内容（问题） #}  
  <div class="question-title color-purple">{{ content.field_single_question_text.0 }}</div>
    {# 给前端用 #}  
    <div class="selector-box" question-index="{{ paragraph.index }}">
      {# 添加问题选项 #}  
      <div class="progress-bar">  
        <div class="progress-item" data-value="0">  
          <span class="progress-check"></span>  
          <span class="{{labe_top_class}}">{{ 'NO' | t }}</span><br/>  
          <span class="{{labe_bottom_class}}">{{ 'DAYS' | t }}</span>  
        </div>
```

###### 3. 复写 Questions 模板
```twig
{% block content %}  
  {{ content }}
  {# 添加 Reset 和 Submit 按钮 #}  
  <div class="question-action-buttons">  
    <span class="button question-reset-button">Reset</span>  
    <a href="/assess-my-condition-result" class="button button-arrow question-submit-button">Submit</a>  
  </div>  
{% endblock %}
```

###### 4. 看一下数据流
正常情况下，假设现在所有问题都已经回答，则
agreeDisclaimer 为 true
poemTestEmpty 为 false
poemTestResults 为非空数组
点击 `Submit` 按钮，去到 Result 页面
###### 5. js数据处理
```php
1. 当点击选项
// 将当前点击的答案存储在 $selectedAnswers 数组的相应位置。  
$selectedAnswers[questionIndex] = _self;

// 调用 scoresSet 函数，并传递当前问题的索引和当前选择答案的数据值
scoresSet(questionIndex, $(_self)?.data('value'));
// 将选项代表的值存储带cookie：poemTestResult
function scoresSet(index, score) {  
  const poemTestResult = JSON.parse(Cookies.get('poemTestResults'));  
  poemTestResult[index] = score;  
  setCookie('poemTestResults', JSON.stringify(poemTestResult));  
}

2. 提交处理
// 将没有选择的选项设置为 n
for (let i = 0; i < 7; i++) {  
  if (!$selectedAnswers[i] || $selectedAnswers[i] === -1) {  
    scoresSet(i, 'n');  
    emptySum += 1;  
  }}
```


# Test-Result
主体还是一个node，包括 top banner 和 bottom footer，中间是3个自定义 block 和、2个form 和部分自定义复写组成.
###### 1.  .module 文件准备数据
```php
// 路径判断
if (in_array($internal,  
[ALIAS_PATH_POEM_TEST_START, ALIAS_PATH_POEM_TEST_RESULT, ALIAS_PATH_MILD_AD])) {  
  $variables['alias_path'] = $internal;  
}
// 关于测试结果的数据
if ($internal == ALIAS_PATH_POEM_TEST_RESULT) {  
  $service = Drupal::service('pfadpsg_assess_my_condition.service');  
  $terms = $service->getResultByTotalScore();  
  if (!empty($terms)) {  
    $terms['description'] = str_replace("?cmp=ADCampaign2022_PDF", "", $terms['description']);  
    $variables['min_score'] = $terms['min_score'];  
    $variables['max_score'] = $terms['max_score'];  
    $variables['description'] = $terms['description'];  
    $variables['check_empty'] = $service->checkAnswer(NULL, TEST_CHECK_KEY);  
    $variables['#cache']['max-age'] = 0;  
  }
}
```
###### 2. 模板结果渲染
结果相关：
```twig
<div class='container-test-result'>  
  <p class='title-test-result'>  
    {# 如果回答有效 #}  
    {% if check_empty == false %}  
      {{ 'Your score is between' | t}} {{ min_score }} {{ 'to' | t }} {{ max_score }}  
    {% else %}  
      {{ 'Not applicable' | t }}  
    {% endif %}  
  </p>  
  <p class='desc'>{{ description | raw  }}</p>  
</div>
```

功能相关：
```php
<div class="container-button-email-and-pdf">  
  {% if check_empty == false %}  
    {{ drupal_form('\\Drupal\\pfadpsg_assess_my_condition\\Form\\SendEmailForm')}}  
    {{ drupal_form('\\Drupal\\pfadpsg_assess_my_condition\\Form\\GeneratePdfForm')}}  
    <span class="button button-email send-email-button">{{ 'Email' | t}}</span>  
    <a href="Assess-My-Condition-Result.pdf" class="button button-pdf save-to-pdf">{{ 'Save as PDF' | t }}</a>  
    <a class="button button-search icon-search" href="/clinic-locator" sc:linkname="">{{ 'Find a medical specialist' | t }}</a>  
  {% else %}  
    {# 结果无效则不显示 email 和 PDF 按钮，显示重新测试按钮 #}
    <a class="button button-retake" href="/assess-my-condition-test" >{{ 'Retake the test' | t }}</a>  
  {% endif %}  
</div>
```

###### 3. 研究邮件弹窗问题
form被复写了。
js控制弹窗
```js
$sendEmailBtn.on('click', function () {  
  $sendEmailPopup.removeClass('hidden');  
  $emailForm.css('display', 'block');  
  postCheckProcessing(true);  
  disabledSubmit(false);  
  $text.attr('value', '');  
  $emailInput.prop('value', '');  
  pfAnalyticsAttrData('home | content | POEM | email');  
  pfAnalyticsAttrFormData('POEM result email');  
});
```
js控制值替换
```js
$submit.on('click', function (e) {  
  e.preventDefault();  
  const value = $emailInput.prop('value');  
  const isCorrect = emailCheck(value);  
  $text.attr('value', value);
```

###### 4. 研究PDF链接路由问题`/Assess-My-Condition-Result.pdf`

```js
/**  
 * $('.container-button-email-and-pdf')：  
 * 这是一个使用jQuery选择器的语句，它选择了页面上所有具有container-button-email-and-pdf类的元素。  
 *  
 * .on('click', '.save-to-pdf', function () {...})：  
 * 这是jQuery的on方法，用于绑定事件处理程序。此处，它正在为container-button-email-and-pdf内的  
 * 所有.save-to-pdf元素绑定一个点击事件处理程序。  
 *  
 * function () {...}：  
 * 当.save-to-pdf元素被点击时，这个匿名函数将会执行。  
 */  
$('.container-button-email-and-pdf').on('click', '.save-to-pdf', function () {  
  /**  
   * $('.generate-pdf-form .form-submit')：  
   * jQuery选择器。这次我们选择了所有带有generate-pdf-form类的元素内部的.form-submit子元素。  
   *  
   * .trigger('click')：  
   * 对于上一步中选中的.form-submit元素，我们使用jQuery的trigger方法模拟了一个点击事件。  
   * 这意味着当我们点击.save-to-pdf元素时，任何绑定到.generate-pdf-form .form-submit元素上的  
   * 点击事件处理程序也都会被执行。  
   */  
  $('.generate-pdf-form .form-submit').trigger('click');  
});
```

```js
/**  
 * $buttonPdf：  
 * 这应该是一个预先定义的变量，它包含了使用jQuery选择器选取的某些DOM元素。  
 *  
 * .on('click', function (e) {...})：  
 * 这是jQuery的on方法，用于为$buttonPdf元素绑定一个点击事件处理程序。  
 *  
 * function (e) {...}：  
 * 当$buttonPdf元素被点击时，这个匿名函数将会执行。此函数接收一个参数e，代表事件对象。这个事件对象包含了关于该事件的所有信息。  
 *  
 * e.preventDefault()：  
 * 这是事件对象的一个方法，用于阻止事件的默认行为。在本例中，如果$buttonPdf是一个链接元素（例如<a>标签），  
 * 点击它的默认行为通常是导航到其href属性所指向的URL。通过调用e.preventDefault()，  
 * 这个导航行为会被取消，因此链接不会导航到其目标URL。  
 */  
$buttonPdf.on('click', function (e) {  
  e.preventDefault();  
});
```

```php

$fields['label'] = BaseFieldDefinition::create('string')  
  ->setLabel(t('MIDAS GRADE'))  
  ->setRequired(TRUE)  
  ->setSetting('max_length', 255)  
  ->setDisplayOptions('form', [  
    'type' => 'string_textfield',  
    'weight' => -5,  
  ])  ->setDisplayConfigurable('form', TRUE)  
  ->setDisplayOptions('view', [  
    'label' => 'hidden',  
    'type' => 'string',  
    'weight' => -5,  
  ])  ->setDisplayConfigurable('view', TRUE);  
  
$fields['description'] = BaseFieldDefinition::create('text_long')  
  ->setLabel(t('MIDAS DESCRIPTION'))  
  ->setDisplayOptions('form', [  
    'type' => 'text_textarea',  
    'weight' => 10,  
  ])  ->setDisplayConfigurable('form', TRUE)  
  ->setDisplayOptions('view', [  
    'type' => 'text_default',  
    'label' => 'above',  
    'weight' => 10,  
  ])  ->setDisplayConfigurable('view', TRUE);  
  
$fields['score'] = BaseFieldDefinition::create('string')  
  ->setLabel(t('MIDAS SCORE'))  
  ->setRequired(TRUE)  
  ->setSetting('max_length', 255)  
  ->setDisplayOptions('form', [  
    'type' => 'string_textfield',  
    'weight' => -5,  
  ])  ->setDisplayConfigurable('form', TRUE)  
  ->setDisplayOptions('view', [  
    'label' => 'hidden',  
    'type' => 'string',  
    'weight' => -5,  
  ])  ->setDisplayConfigurable('view', TRUE);  
  
$fields['count'] = BaseFieldDefinition::create('integer')  
  ->setLabel(t('COUNT'))  
  ->setRequired(FALSE)  
  ->setDefaultValue(0)  
  ->setSetting('min', 0)  
  ->setDisplayOptions('form', [  
    'type' => 'number',  
    'weight' => 16,  
  ])  ->setDisplayConfigurable('form', TRUE)  
  ->setDisplayOptions('view', [  
    'label' => 'above',  
    'type' => 'number',  
    'weight' => 16,  
  ])  ->setDisplayConfigurable('view', TRUE);
```