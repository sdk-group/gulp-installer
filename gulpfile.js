var gulp = require('gulp')
var yargs = require('yargs')
var Path = require('path');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var beautify = require('js-beautify').js_beautify;
var git = Promise.promisifyAll(require('gulp-git'));
var del = require('del');
var shell = require('./shell.js');



//git clone -> get name of cloned package ->
//    -> append name of dest to main package.json into gitDependencies 
//-> add there directory of installed package

gulp.task('install', function () {
    var arg = yargs.argv;
    var module = arg.m;
    var dest = arg.d;
    var path = Path.join('.', dest);

    var package = 'package.json';

    if (module.indexOf('https') === -1) {
        module = 'https:\\' + module;
    }



    var module_name = module.split('/').pop();
    var module_path = Path.join(dest, module_name);

    var install = fs.mkdirAsync(dest).catch(function () {
        return true;
    }).then(function () {
        return del.sync(module_path);
    }).catch(function (arguments) {
        return true;
    }).then(function () {
        return git.cloneAsync('https://github.com/stevelacy/gulp-git', {
            cwd: dest,
            quiet: false
        });
    }).then(function () {
        return shell('npm install', {
            cwd: module_path
        });
    }).then(function () {
        console.log('done');
        return true;
    });

    var read_package = fs.readFileAsync(package, 'utf8');
    Promise.props({
            installed: install,
            red: read_package
        })
        .then(function (result) {
            console.log(result.installed);

            var data = JSON.parse(result.red);
            if (!data.hasOwnProperty('gitDependencies')) {
                data.gitDependencies = {};
            }

            data.gitDependencies[module_name] = {
                git_path: module,
                dir: module_path.replace('\\', "/")
            };

            var str_data = JSON.stringify(data);
            str_data = beautify(str_data, {
                indent_size: 2
            });

            return fs.writeFileAsync(package, str_data);
        });
    //    routs.json doesn 't need any more
    //        .then(function () {
    //            return fs.readFileAsync('routs.json', 'utf8');
    //        }).then(function (d) {
    //            var data = d === '' ? {} : JSON.parse(d);
    //            data[module] = {
    //                dir: dest
    //            };
    //            var str_data = JSON.stringify(data);
    //            str_data = beautify(str_data, {
    //                indent_size: 2
    //            });
    //            fs.writeFileAsync('routs.json', str_data).then(function (err) {
    //                if (err) throw err;
    //                console.log('It\'s saved!');
    //            });
    //    });
});

//test task
gulp.task('clone', function () {
    var dest = './test';
    var module = 'https://github.com/stevelacy/gulp-git';
    var module_name = module.split('/').pop();
    var module_path = Path.join(dest, module_name);

    fs.mkdirAsync(dest).catch(function () {
        return true;
    }).then(function () {
        return del.sync(module_path);
    }).catch(function (arguments) {
        return true;
    }).then(function () {
        return git.cloneAsync('https://github.com/stevelacy/gulp-git', {
            cwd: dest,
            quiet: false
        });
    }).then(function () {
        return shell('npm install', {
            cwd: module_path
        });
    }).then(function () {
        console.log('done');
    });

});