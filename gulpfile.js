var gulp = require('gulp')
var yargs = require('yargs')
var Path = require('path');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var beautify = require('js-beautify').js_beautify;
var git = require('gulp-git');


//git clone -> get name of cloned package ->
//    -> append name of folder to main package.json into gitDependencies 
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

    if (module.indexOf('git+') === -1) {
        module = 'git+' + module;
    }



    var install = git.clone(
        //dest and module name here
    ).then(function (data) {

        var result = {
            module_name: //get module_name
            ,
            git_path: module_version.split('@')[1],
            dir: dest + Path.delimiter + this.module_name
        };
        return result;
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
                data.customDependencies = {};
            }

            data.customDependencies[result.installed.module_name] = {
                git_path: result.installed.git_path,
                dir: result.dir,

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