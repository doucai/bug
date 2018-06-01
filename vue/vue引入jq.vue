1.npm install jquery --save-dev  
2、在项目根目录下的build/webpack.base.conf.js文件中：
先写以下代码
var webpack = require("webpack")   
在module.exports的最后写
plugins: [  
    new webpack.optimize.CommonsChunkPlugin('common.js'),  
    new webpack.ProvidePlugin({  
      jQuery: "jquery",  
      $: "jquery"  
    })  
  ]  
3.在根目录下的\src\main.js中引入
import $ from 'jquery'  