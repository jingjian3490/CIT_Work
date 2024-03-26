## npm install是什么命令
用于安装==Node.js项目==中的依赖项。这条命令是`npm`（Node Package Manager）的一部分，一个用于Node.js包管理和分发的工具，允许用户从npm仓库下载和安装第三方依赖包及其依赖。
`npm install`（或简写为`npm i`）将安装==package.jso==文件中列出的所有依赖项到`node_modules`目录。
## Node.js是干什么的
Node.js是一个开源和跨平台的JavaScript==运行时环境==，允许开发者在服务器端运行JavaScript代码。传统上，JavaScript主要在浏览器中作为客户端脚本语言被使用，但Node.js的出现改变了这一局面，让JavaScript也能在服务器端执行。

Node.js和JRE都提供了一个运行环境，允许开发者执行编写的代码。JRE允许运行Java字节码，而Node.js则允许运行JavaScript代码。
## npm run build的作用是什么
`npm run build`是一个在Node.js项目中使用的命令，其作用主要依赖于项目的`package.json`文件中定义的`scripts`属性。在这个`scripts`属性里，开发者可以定义多个脚本命令来执行各种任务，`build`只是其中一个常见的脚本命令名称。
```json
"scripts": {  
  "test": "echo \"Error: no test specified\" && exit 1",  
  "start": "webpack -w --config webpack.dev.js",  
  "build": "webpack --config webpack.prod.js",  
  "eslint": "eslint --cache --ext .js src --",  
  "stylelint": "stylelint **/*.scss",  
  "lint": "npm run eslint && npm run stylelint"  
},
```
#### 常见用途
- **编译或转译代码**：对于使用了现代JavaScript（ES6+）、TypeScript、JSX等需要编译或转译为浏览器能理解的JavaScript代码的项目，`npm run build`通常被用来执行这个编译或转译过程。
- **打包**：在使用诸如Webpack、Rollup或Parcel等模块打包工具的项目中，`npm run build`命令用来执行打包过程，将多个模块和资源（如CSS、图片）打包成少数的文件，通常为了生产环境的部署。
#### 如何工作
当运行`npm run build`命令时，npm会查找`package.json`文件中`scripts`对象下的`build`属性，然后执行它所对应的命令字符串。例如：
```json
"scripts": {
  "build": "webpack --mode production"
}
```
在这个例子中，执行`npm run build`会启动Webpack，并以生产模式==打包项目==。

"打包项目"（Project Bundling）是一个在软件开发中常见的术语，特别是在前端开发领域。这个过程涉及将项目中的多个文件和资源（如JavaScript、CSS、图片等）合并和优化为更少的文件，以便于部署到生产环境。
#### 打包工具
打包项目通常需要使用专门的工具，这些工具能自动完成上述的优化和转换工作。目前比较流行的打包工具包括：
- **Webpack**：一种广泛使用的现代JavaScript应用的静态模块打包器，可以处理应用程序的所有资源，如JavaScript、CSS、图片等。
## 打包过程
在使用Webpack进行项目打包时，其逻辑基于模块化的JavaScript开发方式，将项目的多个文件和资源合并成少数几个打包后的文件。Webpack通过以下几个核心概念来实现这一过程：
#### 核心概念
1. **入口（Entry）**：
   - Webpack需要知道从哪个文件开始打包，这个文件（或文件集合）被称为打包的“入口”。
   - 入口点告诉Webpack，根据哪个文件作为起点开始构建内部依赖图。

2. **输出（Output）**：
   - 定义打包后文件的输出位置以及如何命名这些文件。
   - 通常，打包后的资源会放在项目的特定目录下，如`dist/`或`build/`，并且包含一个或多个打包文件。

3. **加载器（Loaders）**：
   - Webpack本身只理解JavaScript。加载器能够让Webpack处理其他类型的文件，并将它们转换为有效的模块，加入到依赖图中。
   - 通过加载器，Webpack可以处理CSS、图片、TypeScript等非JavaScript文件。

4. **插件（Plugins）**：
   - 插件用于执行范围更广的任务，从打包优化和压缩，到重新定义环境变量。
   - 插件可以影响打包流程的每个阶段。

5. **模式（Mode）**：
   - Webpack提供了`development`、`production`和`none`模式，帮助自动启用相应模式下的Webpack内置优化。
#### 打包逻辑
1. **读取配置**：从==webpack.config.js==配置文件读取配置，包括入口、输出、加载器和插件等。
2. **构建依赖图**：从入口文件开始，分析项目中所有的模块依赖（JavaScript文件、CSS文件、图片等），形成一个依赖图。
3. **模块转换**：对每个模块使用相应的加载器进行处理，例如使用`babel-loader`将ES6转换为ES5，使用`css-loader`处理CSS文件等。
4. **打包**：将所有模块按照依赖关系合并到一个或多个文件中，通常是一个JavaScript文件（用于逻辑代码）和几个CSS文件（用于样式）。
5. **输出**：按照配置文件中的`output`部分指定的路径和文件名，将打包后的文件写入到文件系统。

通过这个过程，Webpack能够将项目中散落的多个资源文件整合为少数几个优化后的文件，大大提高了项目的加载速度和性能。
#### webpack.config.js
```javascript
// 引入Node.js的path模块，用于操作文件路径
const path = require('path');
// 引入MiniCssExtractPlugin插件，用于将CSS提取到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 引入StyleLintPlugin插件，用于对SCSS/CSS进行风格检查
const StyleLintPlugin = require('stylelint-webpack-plugin');
// 引入ESLintPlugin插件，用于对JS进行代码质量检查
const ESLintPlugin = require('eslint-webpack-plugin');

// 导出Webpack的配置对象
module.exports = {
  // 定义入口文件配置
  entry: {
    main: './src/index.js', // 入口文件设置为./src/index.js
  },
  // 定义输出文件配置
  output: {
    filename: '[name].js', // 输出文件名，[name]是占位符，对应于入口名称（这里是"main"）
    chunkFilename: '[name].bundle.js?h=[contenthash]', // 非入口chunk文件的命名规则
    path: path.resolve(__dirname, 'build'), // 输出文件的目标路径
    clean: true, // 在每次构建前清理/output目录
  },
  // 定义模块的处理规则
  module: {
    rules: [
      // 规则1: 处理.scss文件
      {
        test: /\.scss$/, // 用正则表达式匹配所有.scss文件
        use: [
          MiniCssExtractPlugin.loader, // 提取CSS到单独文件
          'css-loader', // 将CSS转换为CommonJS
          'postcss-loader', // 使用PostCSS加载器进行处理，通常用于自动添加浏览器前缀
          'sass-loader', // 将Sass/Scss转换为CSS
        ],
      },
      // 规则2: 处理图片文件
      {
        test: /\.(png|svg|jpg|gif)$/, // 匹配图片文件
        type: 'asset', // 根据导入资源的大小，自动选择是否将其转换为DataURL
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 小于8KB的图片将转换为DataURL
          },
        },
      },
      // 规则3: 处理.js文件
      {
        test: /\.js$/, // 匹配.js文件
        exclude: /(node_modules|bower_components)/, // 排除node_modules和bower_components目录
        use: [
          {
            loader: 'babel-loader', // 使用babel-loader进行转译
          },
        ],
      },
    ],
  },
  // 定义插件
  plugins: [
    new MiniCssExtractPlugin(), // 实例化MiniCssExtractPlugin
    new StyleLintPlugin({ // 实例化StyleLintPlugin
      context: 'src', // 指定检查的上下文目录
      configFile: path.resolve(__dirname, './.stylelintrc.json'), // 指定风格检查的配置文件
      files: ['**/*.scss'], // 指定要检查的文件模式
      fix: false, // 是否自动修复问题
      cache: true, // 是否启用缓存
      emitErrors: true, // 是否将风格问题作为错误输出
      failOnError: false, // 是否因风格问题导致构建失败
    }),
    new ESLintPlugin(), // 实例化ESLintPlugin
  ],
  // 定义优化配置
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有类型的chunk进行代码分割
    },
  },
};
```
此配置详细定义了Webpack如何处理项目中不同类型的文件和资源，包括JavaScript、CSS/SCSS和图像文件，以及如何通过插件进行代码风格和质量检查。此外，还包含了优化设置，比如代码分割，以提高最终应用的加载性能