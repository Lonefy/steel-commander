#!/usr/bin/env node

var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');
var inquirer = require('inquirer');
var argv = require('minimist')(process.argv.slice(2));

var path = require('path');

var tasksFlag = argv.T || argv.tasks;
var tasks = argv._;


var Command = require('../lib/command');

var CWD = process.cwd();
var configBase = path.join(CWD, "node_modules", "steel-commander");
var cmd = tasks[0];


main();

function main() {
    var env = steelEnv();
    handle(env);
}

function handle(env) {
    var mainCmd = _.split(cmd, '@', 1)[0];

    if (env.command.isHas(mainCmd)) {
        env.command.excute(mainCmd, env);
    }
    else if (cmd !== undefined) {
        //taskfile tasks
        env.command.excute('task', env);
    }
    else {

        interactiveCli(env);
    }
}


function commandInst() {

    var command = new Command(),
        cmdPath = '../lib/command';

    command.add('install', require(cmdPath + '/cmd-install'));
    command.add('update', require(cmdPath + '/cmd-update'));
    command.add('help', require(cmdPath + '/cmd-help'));
    command.add('init', require(cmdPath + '/cmd-init'));
    command.add('task', require(cmdPath + '/cmd-task'));

    return command;
}


function steelEnv() {
    var env = {};

    env.command = commandInst();
    //command-line
    env.cmd = cmd;
    env.argv = argv;
    //Paths
    env.cwd = CWD;
    env.configBase = configBase;
    env.configPath = CWD + '/steelfile.js';
    env.modulePath = configBase + '/index.js';
    // env.configBase = CWD + '/node_modules/steel-commander';
    // env.configPath = env.configBase + '/steelfile.js';
    // env.modulePath = env.configBase + '/index.js'

    return env;
}

function interactiveCli(env) {

    var defaultChoices = [{
        name: 'install',
        value: 'install'
    }, {
            name: 'init',
            value: 'init'
        }, {
            name: 'update',
            value: 'update'
        }, {
            name: 'help',
            value: 'help',
        }, {
            name: 'exit',
            value: 'exit',
            message: "ByeBye",
            default: true
        }];


    inquirer.prompt([{
        name: 'whatToDo',
        type: 'list',
        message: 'What would you like to do?',
        choices: _.flatten([
            new inquirer.Separator()
            , defaultChoices
            , new inquirer.Separator()
        ])
    }], function(answer) {

        if (answer.whatToDo === 'exit') {
            return process.exit(0);
        }
        env.command.excute(answer.whatToDo, env);

    });
}