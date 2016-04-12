// var fs = require('fs');
// var path = require('path');
// var child_process = require('child_process');
var spawn = require('cross-spawn-async');

module.exports = function(env) {
    // return child_process.exec('npm install', function(){
    //      console.log('ssnpm')
    //  }).stdout.pipe(process.stdout);;

    return spawn('npm', ['update','steel-commander', '-g'], { stdio: 'inherit' })
        .on('error', function(err) {
            console.log(err);
        })
        .on('close', function() {
            console.log('close')
        })
}




