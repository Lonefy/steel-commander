#!/usr/bin/env node

var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
var semver = require('semver');
var archy = require('archy');
var tildify = require('tildify');
var v8flags = require('v8flags');
//var completion = require('../lib/completion');
var argv = require('minimist')(process.argv.slice(2));
var taskTree = require('../lib/taskTree');

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

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
var configBase = path.join(CWD, "node_modules", "steel-commander");
var command = tasks[0];

if (checkInstall(command)) {
  
  var arr = command.split('@')
    , version = arr[1] || "*"
    , jsonPath = CWD + '/package.json';

  jsonOut(jsonPath, {} , function(e){
    installModule('steel-commander', function(){

      gutil.log(chalk.green('Start modules install'));
      
      try {
        var localSteelVersion = require.resolve(path.join(configBase, "node_modules", "steel-version"));
        steelVersion = require(localSteelVersion);
      } catch(e) {}

      jsonOut(jsonPath, steelVersion(version).getJSON() , function(e){
          if(e){
              console.log(e);
          }else{
            installModule("",function(){
              delFile(jsonPath);
              gutil.log(chalk.green('Steel Finish Install'));
            });
          }
      })

      var src = steelVersion(version).getFile();

      fs.writeFile(CWD + '/steelfile.js', fs.readFileSync(src), function(e){
        if(e){
          console.log(e);
        }
        gutil.log(chalk.green('...generate steelfile, done'));
      });
    })
  })
} else if (command === 'update') {
  console.log('comming soon');
} else {

    handleArguments({
      cwd: CWD,
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

function installModule(module, callback){
  child_process.exec('npm install' + module, callback).stdout.pipe(process.stdout);
}

function delFile(filepath){
    fs.existsSync(filepath) && fs.unlink(filepath);
}

function handleArguments(env) {

  // env.configBase = cwd + '/node_modules/steel-commander';
  // env.configPath = env.configBase + '/steelfile.js'; 
  // env.modulePath = env.configBase + '/index.js'

  if (versionFlag && tasks.length === 0) {
    gutil.log('Golbal version', cliPackage.version);
    if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
      gutil.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }

  if (!env.modulePath) {
    gutil.log(
      chalk.red('Local steel not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: steel install'));
    process.exit(1);
  }

  if (!env.configPath) {
    gutil.log(chalk.red('No steel found'));
    process.exit(1);
  }

  // check for semver difference between cli and local installation
  // if (semver.gt(cliPackage.version, env.modulePackage.version)) {
  //   gutil.log(chalk.red('Warning: gulp version mismatch:'));
  //   gutil.log(chalk.red('Global version is', cliPackage.version));
  //   gutil.log(chalk.red('Local version is', env.modulePackage.version));
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
  
  require(env.configPath);

  gutil.log('Using steelfile', chalk.magenta(tildify(env.configPath)));

  var inst = require(env.modulePath);
  logEvents(inst);

  process.nextTick(function () {
    if (simpleTasksFlag) {
      return logTasksSimple(env, inst);
    }
    if (tasksFlag) {
      return logTasks(env, inst);
    }
    inst.start.apply(inst, toRun);
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
