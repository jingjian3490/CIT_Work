Drupal 通过在`#attached`属性中使用`html_head`设置SEO信息
###### ==返回不同内容==
```php
public function attendPage(int $node) {  
  $event = Node::load($node);  
  
  $site_name = \Drupal::configFactory()->get('system.site')->get('name');  
  // Check if user is registered.  
  if ($this->registerService->isRegistered($event) == EVENT_TYPE_PHYSICAL) {  
    // --------
    return [  
      '#theme' => 'welcome_page',  
      '#event' => $event,  
      '#welcome_block' => $block_content ? $block_content->get('body')->value : '',  
      '#event_speaker' => $speakers,  
      '#cache' => [  
        'tags' => $cache_tags,  
      ],      
      '#attached' => [  
        'html_head' => [  
          [            
            [              
              '#tag' => 'title',  
              '#value' => t('Welcome | @site_name', ['@site_name' => $site_name]),  
            ],            
            'seo_title',  
          ],        
        ],      
      ]    
    ];  
  }  
  elseif (in_array(GRV_ROLE_ID, $this->account->getRoles())) {  
    // -------
    return [  
      '#theme' => 'hold_on_page',  
      '#event' => $event,  
      '#hold_on_block' => $block_content ? $block_content->get('body')->value : '',  
      '#cache' => [  
        'tags' => $cache_tags,  
      ],      
      '#attached' => [  
        'html_head' => [  
          [            
            [              
              '#tag' => 'title',  
              '#value' => t('Hold on | @site_name', ['@site_name' => $site_name]),  
            ],            
            'seo_title',  
          ],        
        ],      
      ]    
    ];  
  }  
  
  $form = \Drupal::formBuilder()->getForm(AttendForm::class, [  
    'event' => $event  
  ]);  
  if (isset($form['#attached'])) {  
    $form['#attached']['html_head'] = [  
      [        
        [          
          '#tag' => 'title',  
          '#value' => t('Attendance Information | @site_name', ['@site_name' => $site_name]),  
        ],        
        'seo_title',  
      ],    
    ];  
  }  
  return $form;  
}
```
###### ==提供 SEO 信息==
```php
public function build() {  
  
  $build = [];  
  
  $build['#attached']['html_head'][] = [  
    [      
      '#type' => 'html_tag',  
      '#tag' => 'meta',  
      '#attributes' => [  
        'name' => 'description',  
        'content' => 'Migraines are often misunderstood & migraine sufferers may not realise its severity. Managing Migraines is complex and requires a continuous process.',  
      ],    
    ],    
    'description'  
  ];  
  
  $build['#attached']['html_head'][] = [  
    [      
      '#type' => 'html_tag',  
      '#tag' => 'meta',  
      '#attributes' => [  
        'name' => 'abstract',  
        'content' => 'Migraines are often misunderstood & migraine sufferers may not realise its severity. Managing Migraines is complex and requires a continuous process.',  
      ],    
    ],    
    'abstract'  
  ];  
  
  $build['#attached']['html_head'][] = [  
    [      
      '#type' => 'html_tag',  
      '#tag' => 'meta',  
      '#attributes' => [  
        'name' => 'keywords',  
        'content' => 'Migraines, Migraine information, Migraine help, Migraine resources, Migraine community, Migraine sufferers',  
      ],    
    ],    
    'keywords'  
  ];  
  return $build;  
}
```

###### Form
```php
public function buildForm(array $form, FormStateInterface $form_state, $event = NULL) {
  // Assume $event is an entity loaded and passed as an argument to the form.

  // Your existing form building code here.

  // Set the page title dynamically based on the event.
  $site_name = \Drupal::configFactory()->get('system.site')->get('name');
  $event_title = $event->label(); // Example of getting the event title.

  $form['#attached']['html_head'][] = [
    [
      '#tag' => 'title',
      '#value' => t('@event_title | @site_name', ['@event_title' => $event_title, '@site_name' => $site_name]),
    ],
    'seo_title',
  ];

  return $form;
}

```