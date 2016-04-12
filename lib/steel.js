/**
 * steel file for cli-version
 * author: @Lonefy
 */
var path = require('path');
var gulp  = require('gulp');
var steelVersion = require('steel-version');
var _ = require('lodash');

function steelConfig(opt){
    
    tasks( _.extend({
        port: 8100,
        pathnamePrefix: '/dezhou_banck_map/',
        front_base: 'server_front',
        front_hostname: 'res.codezz.cn',
        back_base: 'server_back', //模拟后端的文件放置目录
        back_hostname: 'codezz.cn',
        build_path: 'build/',
        cssPostfix_filter: ["components/**/*.*"],
        cssBase: "",
        jsBase: "",
        htmlBase: "",
        version: '*'
    }, opt))    
}


function tasks(data){    
    _.extend(this, data)
    try{
        var lp = steelVersion(version).getLib();
        require(path.relative(__dirname, lp));
    }
    catch(e){}
}


module.exports = {
    gulp: gulp,
    config: steelConfig,
    task: function() {
        gulp.task.apply(gulp, arguments);
    }
};