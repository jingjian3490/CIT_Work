在Drupal中，“Entity reference”和“Entity reference revisions”字段类型都用于创建实体之间的引用关系，但它们在处理实体版本（revisions）时有所不同。

1. **Entity reference (实体引用)**:
    
    - 这个字段类型用于引用其他实体，比如内容（节点）、用户、术语等。
    - 它只关联到被引用实体的当前激活版本。
    - 当您更新被引用的实体时，引用该实体的所有内容将自动显示最新的内容。
    - 这是Drupal核心提供的标准字段类型，适用于大多数引用需求。
2. **Entity reference revisions (实体引用修订版本)**:
    
    - 这个字段类型是由“Paragraphs”模块提供的，用于引用其他实体，并且可以指向特定的实体修订版本。
    - 它允许您引用并保持对旧版本的引用，即使该实体有了更新的版本。
    - 这对于需要追踪或回滚到特定版本的内容管理系统非常有用，例如在一个严格的审批流程中，或者当内容的每个变更都需要被记录和可追溯时。
    - 如果您使用“Paragraphs”模块创建复杂布局或组合内容片段，通常会用到这个字段类型。

简而言之，如果您需要保持对旧版本的引用或在内容更新时保持某些内容不变，则应使用“Entity reference revisions”。如果您只需要引用当前版本的内容，并且希望引用始终反映最新内容，则应使用“Entity reference”。

#### 创建字段
在Drupal中，当您创建一个Entity reference或Entity reference revisions字段，并选择通过视图（View）来过滤引用实体时，"View used to select the entities"下拉框应该会显示出所有符合条件的视图。但在此之前想要创建符合添加的视图。
**==创建一个符合条件的视图==** `1.创建视图` `2.添加Entity Reference显示`
