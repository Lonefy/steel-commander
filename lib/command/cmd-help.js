
var inquirer = require('inquirer');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(command, env) {

    // steel install <pkg>
    // steel install <pkg>@<tag>
    // steel install <pkg>@<version>
    // steel install <pkg>@<version range>
    // steel install <folder>
    console.log('help')
    var defaultChoices = [{
        name: 'all',
        value: 'all',
        default: true
    }, {
        name: 'install',
        value: 'install'
    }, {
        name: 'update',
        value: 'update'
    }, {
        name: 'exit',
        value: 'exit'
    }];


    inquirer.prompt([{
        name: 'whichCommander',
        type: 'list',
        message: 'Which commander?',
        choices: _.flatten([
            new inquirer.Separator(),
            defaultChoices,
            new inquirer.Separator()
        ])
    }], function(answer) {

        var answer = answer.whichCommander;
        if (answer === 'exit') {
            return;
        }
       
        if (answer === 'all') {

            console.log("steel install", "-- Install all dependences of steel project. If there's no package.json, steel will produce default package.json.If the project has a package.json file, steel will add it own dependences in the file.");

            console.log("steel update", "-- Update the golbal steel core package");

            console.log("steel init", "-- help you initialize a steel project");
            return;
        }

        // helpMap[answer];
        var str = 'steel ' + answer + " " + helpMap[answer];
        console.log(str);

    });

}

// var HelpMap = function() {
//     this.help = {}
// }

// HelpMap.prototype.add = function(name, handler) {
//     if (typeof handler !== 'function') return;
//     this.help[name] = handler;
// }

function initHelp() {
    // var helpMap = new HelpMap(),
    //     cmd = chalk.bold.cyan;

    // helpMap.add('install',function(){
    //     console.log(cmd("steel install"), "-- Install all dependences of steel project. If there's no package.json, steel will produce default package.json.If the project has a package.json file, steel will add it own dependences in the file.");       
    // })

    // helpMap.add('update',function(){
    //      console.log(cmd("steel update"), "-- Update the golbal steel core package");
    // })

    // helpMap.add('server',function(){
    //     console.log(cmd("steel server"), "-- if there's no pkg,json,produce default pkg.json");
    // })

    // helpMap.add('init',function(){
    //     console.log(cmd("steel init"), "-- help you initialize a steel project");
    // })
    // return helpMap;
    // return {
    //     'install': "-- Install all dependences of steel project. If there's no package.json, steel will produce default package.json.If the project has a package.json file, steel will add it own dependences in the file.",
    //     'steel update': "-- Update the golbal steel core package"
    // }
}