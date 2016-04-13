
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var spawn = require('cross-spawn-async');
var chalk = require('chalk');
var merge = require('merge');
// var log = require('fancy-log');

var rg = require('ria-generator');

module.exports = function(command, env) {

    var CWD = env.cwd
        , projectPkg
        , cmd = env.cmd || ""
        , arr = cmd.split('@')
        , jsonPath = CWD + '/package.json'
        , riaType = env.argv.t;
    console.log(chalk.green('Start install'));

    try {
        projectPkg = require(jsonPath);
    } catch (e) {
        rg.templateMatch(riaType, CWD, '*.json');
    }

    // jsonOut(jsonPath, projectPkg, function(e) {
    installCore(function() {

        try {

            var local = require.resolve(path.join(env.cwd, "node_modules", "steel-commander", "node_modules", "ria-generator"));//npm2
            rg = require(local);
        } catch (e) {
            try {
                var local = require.resolve(path.join(env.cwd, "node_modules", "ria-generator"));
                rg = require(local);
            } catch (e) {
                rg = require('ria-generator');
                console.log('global rg')
            }

        }

        var localpackage = require(jsonPath);
        if (localpackage['ria-type']) {
            riaType = localpackage['ria-type']
            var mergePackage = merge.recursive(true, rg.getJSON(riaType), localpackage);
            jsonOut(jsonPath, mergePackage, function(e) {
                if (e) {
                    console.log(e);
                } else {
                    installModule();
                }
            })
        }
        else {
            installModule();
        }
    })
    // })

}


function jsonOut(filePath, json, callback) {
    //if (fs.existsSync(filePath)) return;
    fs.writeFile(filePath, JSON.stringify(json), callback);
}

function installCore(callback) {
    spawn('npm', ['install', 'steel-commander'], { stdio: 'inherit' })
        .on('error', function(err) {
            console.log(err)
        })
        .on('close', function() {
            console.log('installed core-package');
            callback && callback();
        })
}

function installModule(callback) {
    spawn('npm', ['install'], { stdio: 'inherit' })
        .on('error', function(err) {
            console.log(err)
        })
        .on('close', function() {
            callback && callback();
            console.log(chalk.green('Steel Finish Install'));
        })
}

function delFile(filepath) {
    fs.existsSync(filepath) && fs.unlink(filepath);
}

function getCmdType(argv) {

}