#!/usr/bin/env node

var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
var semver = require('semver');
var archy = require('archy');
var tildify = require('tildify');
var v8flags = require('v8flags');
var completion = require('../lib/completion');
var argv = require('minimist')(process.argv.slice(2));
var taskTree = require('../lib/taskTree');

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var child_process = require('child_process');
// parse those args m8

var versionFlag = argv.v || argv.version;
var tasksFlag = argv.T || argv.tasks;
var tasks = argv._;
var toRun = tasks.length ? tasks : ['default'];


// this is a hold-over until we have a better logging system
// with log levels
var simpleTasksFlag = argv['tasks-simple'];
// var shouldLog = !argv.silent && !simpleTasksFlag;

var steelVersion = require('steel-version');
var cliPackage = require('../package');
var merge = require('merge');
var CWD = process.cwd();
var command = tasks[0];

if (checkInstall(command)) {
  
  var arr = command.split('@')
    , version = arr[1] || "*";
  
  jsonOut(CWD + '/package.json', steelVersion(version) , function(e){
      if(e){
          console.log(e);
      }else{
        console.log('start modules install');
        execInstall(function(){
          console.log(chalk.green("Steel Finish Install"));
          delJsonFile();
        });
      }
  });
  
} else if (command === 'update') {
  console.log(process.argv);
} else if(command === 'upgrade'){

} else {

    console.log(argv);
    console.log(configBase);
    var configBase = process.cwd() + '/node_modules/steel-commander';

    handleArguments({
      configBase : configBase,
      configPath : configBase + '/steelfile.js',
      modulePath : configBase + '/index.js'
    })
}
function checkInstall(text){
  return /^install/.test(text);
}

function jsonOut(filePath, json, callback){
    //if (fs.existsSync(filePath)) return;
    fs.writeFile(filePath, JSON.stringify(json), callback);
}

function execInstall(callback){
  child_process.exec('npm install', callback).stdout.pipe(process.stdout);
}

function delJsonFile(){
    var file = CWD + '/package.json';
    fs.existsSync(file) && fs.unlink(file);
}

function handleArguments(env) {

  // var cwd = process.cwd().replace(/\\/g, "/");
  // env.configBase = cwd + '/node_modules/steel-commander';
  // env.configPath = env.configBase + '/steelfile.js'; 
  // env.modulePath = env.configBase + '/index.js'

  if (versionFlag && tasks.length === 0) {
    gutil.log('CLI version', cliPackage.version);
    if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
      gutil.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }
  // console.log('tks',tasks);
  // if(tasks.indexOf('install')!= -1 || tasks.indexOf('update')!= -1 || tasks.indexOf('upgrade')!= -1){
  //     console.log(tasks);
  //     return;
  // }

  if (!env.modulePath) {
    gutil.log(
      chalk.red('Local steel not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if (!env.configPath) {
    gutil.log(chalk.red('No steel found'));
    process.exit(1);
  }

  // check for semver difference between cli and local installation
  // if (semver.gt(cliPackage.version, env.modulePackage.version)) {
  //   gutil.log(chalk.red('Warning: gulp version mismatch:'));
  //   gutil.log(chalk.red('Global gulp is', cliPackage.version));
  //   gutil.log(chalk.red('Local gulp is', env.modulePackage.version));
  // }

  // chdir before requiring gulpfile to make sure
  // we let them chdir as needed
  // if (process.cwd() !== env.cwd) {
  //   process.chdir(env.cwd);
  //   gutil.log(
  //     'Working directory changed to',
  //     chalk.magenta(tildify(env.cwd))
  //   );
  // }

  // this is what actually loads up the gulpfile
  // 
  
  require(env.configPath);

  gutil.log('Using gulpfile', chalk.magenta(tildify(env.configPath)));

  var gulpInst = require(env.modulePath);
  logEvents(gulpInst);
  // console.log(env.configPath);
  // console.log(env.modulePath);
  // console.log(gulpInst);
  process.nextTick(function () {
    if (simpleTasksFlag) {
      return logTasksSimple(env, gulpInst);
    }
    if (tasksFlag) {
      return logTasks(env, gulpInst);
    }
    gulpInst.start.apply(gulpInst, toRun);
  });
}

function logTasks(env, localGulp) {
  var tree = taskTree(localGulp.tasks);
  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
  archy(tree)
    .split('\n')
    .forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}

function logTasksSimple(env, localGulp) {
  console.log(Object.keys(localGulp.tasks)
    .join('\n')
    .trim());
}

// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}

// wire up logging events
function logEvents(gulpInst) {

  // total hack due to poor error management in orchestrator
  gulpInst.on('err', function () {
    failed = true;
  });

  gulpInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
  });

  gulpInst.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    );
  });

  gulpInst.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log(
      '\'' + chalk.cyan(e.task) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    gutil.log(msg);
  });

  gulpInst.on('task_not_found', function (err) {
    gutil.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    gutil.log('Please check the documentation for proper gulpfile formatting');
    process.exit(1);
  });
}

