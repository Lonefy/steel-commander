var chalk = require('chalk');
var err = chalk.red

var Command = module.exports = function() {
    this.cmd = {};
}

Command.prototype.add = function(name, handler) {
    if (typeof handler !== 'function') {
        console.log(err('<' + name + '> is not Function'));
        return;
    }
    this.cmd[name] = handler;
}

Command.prototype.excute = function(name, args) {
    if (typeof this.cmd[name] === 'function') {
        return this.cmd[name].call(null, this, args);
    }
    console.log(err('not found <' + name + '>'));
}

Command.prototype.isHas = function(name, args) {
    if (!this.cmd[name]) return false;
    return true;
}