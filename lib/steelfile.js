/**
 * steel file for cli-version
 * author: @Lonefy
 */
// var path = require('path');
// var steel = require('gulp');
// var del = require('del');
// var merge2 = require('merge2');
// var r = require("./src/js/router")();
module.exports = {
    port: 80,
    pathnamePrefix: '/t6/apps/weibo_sell/',
    front_base: 'server_front',
    front_hostname: 'js.t.sinajs.cn img.t.sinajs.cn',
    back_base: 'server_back', //模拟后端的文件放置目录
    back_hostname: 'shop.sc.weibo.com shop1.sc.weibo.com', //后端的HOST，目的是真实模拟后端的页面路由请求，提供出前端可仿真的功能，比如 /index 对应 /html/index.html
    tasks:{
        hello: function(){
            console.log("Hello steel");
        }
    }
}