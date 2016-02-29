/**
 * steel file for cli-version
 * author: @Lonefy
 */
var path = require('path');
var gulp  = require('gulp');
var merge = require('merge');
var steelVersion = require('steel-version');

function steelConfig(opt){
    
    var buildParam = merge({
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
    }, opt);
    
    port = buildParam.port ;
    pathnamePrefix = buildParam.pathnamePrefix;
    front_base = buildParam.front_base;
    front_hostname = buildParam.front_hostname;
    back_base = buildParam.back_base; 
    back_hostname = buildParam.back_hostname;
    cssPostfix_option = buildParam.cssPostfix_option;
    
    build_path = buildParam.build_path;
    jsLib = buildParam.jsFilter_of_lib; 

    cssBase = buildParam.cssBase;
    jsBase = buildParam.jsBase;
    htmlBase = buildParam.htmlBase;
    version = buildParam.version;
    tasks();
}


function tasks(){    

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