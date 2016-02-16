# Steel-Commander
> 

###Commander Support
* 1.`steel install`.
* 2.`steel upgrade`.
* 3.`steel init`.
* 4.`steel server --pm2` (--pm2 for Linux).
* 5.`steel build`.
* 6.`steel dist`.


### How to use

1. Install globally with `npm install -g steel`.
2. Run `steel install` in your project directory.
3. Run `steel server`.
4. Write your own task.

###Demo

1. Project Config
```javascript
steel.config({
    port: 80,
    pathnamePrefix: '/t6/apps/weibo_sell/',
    cssPostfix_filter: ["css/pages/*.*"],
    front_base: 'server_front',
    front_hostname: 'js.t.sinajs.cn img.t.sinajs.cn',
    back_base: 'server_back', //模拟后端的文件放置目录
    back_hostname: 'shop.sc.weibo.com shop1.sc.weibo.com', //后端的HOST，目的是真实模拟后端的页面路由请求，提供出前端可仿真的功能，比如 /index 对应 /html/index.html
    jsFilter_of_lib: ['js/lib/zepto.js'],
    cssBase: "css/",
    jsBase: "js/",
    version: '0.1.0'
})
```

2.Add Tasks
```javascript
steel.task("hw", function(){
    console.log("hola datevid");
})
```



