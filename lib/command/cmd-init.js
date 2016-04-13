/*
 * init the steel project
 * output steelVersion template
 * 
 * 
 */
var rg = require('ria-generator');
var inquirer = require('inquirer');
var _ = require('lodash');


module.exports = function(command, env) {
    var cwd = env.cwd;
    var argv = argvchange(env.argv);

    if (argv.t) {
        _writingTemplate(argv.type);
    }
    else {
        var defaultChoices = choice(rg.getType())

        inquirer.prompt([{
            name: 'whichCommander',
            type: 'list',
            message: 'Choose type',
            choices: _.flatten([
                new inquirer.Separator(),
                defaultChoices,
                new inquirer.Separator()
            ])
        }], function(answer) {

            var type = answer.whichCommander;

            inquirer.prompt([{
                name: 'overwritten',
                type: 'list',
                message: 'over-written existed files',
                choices: _.flatten([
                    new inquirer.Separator(),
                    [{
                        name: "yes",
                        value: true,
                        default: true
                    }, {
                        name: "no",
                        value: false
                    }],
                    new inquirer.Separator()
                ])
            }], function(answer) {
                 argv.f = answer.overwritten;
                _writingTemplate(type);
            });

        });
    }

    function _writingTemplate(type) {
        rg.template(type, cwd, argv.f);
    }

    function argvchange(argv) {
        var t, f, type;
        if (typeof argv._[1] === 'string') {
            type = argv._[1];
        }
        if (argv.hasOwnProperty('t')) {
            t = argv.t;
            if (typeof argv.t === 'string') {
                type = t
            }
        }
        if (argv.hasOwnProperty('f')) {
            f = argv.f;
            if (typeof argv.f === 'string') {
                type = f
            }
        }

        return {
            t: !!t,
            f: !!f,
            type: type
        };
    }

    function choice(types) {
        var a = [];
        for (var i = 0, l = types.length; i < l; i++) {
            var t = types[i];
            a.push({
                name: t,
                value: t
            })
        }
        return a;
    }
}