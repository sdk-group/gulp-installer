var gulp = require('gulp')
var yargs = require('yargs')
var Path = require('path');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var beautify = require('js-beautify').js_beautify;
var shell = require('./shell.js');

gulp.task('install', function () {
    var arg = yargs.argv;
    var module = arg.m;
    var dest = arg.d;
    var path = Path.join('.', dest);

    var package = 'package.json';


    var install = shell(
        'npm install ' + module + ' --prefix ' + path
    ).then(function (data) {

        var module_version = data.s.split(' ')[0];
        var result = {
            module: module_version.split('@')[0],
            version: module_version.split('@')[1]
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
            if (!data.hasOwnProperty('customDependencies')) {
                data.customDependencies = {};
            }

            data.customDependencies[result.installed.module] = {
                ver: '^' + result.installed.version,
                dir: dest
            };

            var str_data = JSON.stringify(data);
            str_data = beautify(str_data, {
                indent_size: 2
            });

            return fs.writeFileAsync(package, str_data);
        }).then(function () {
            return fs.readFileAsync('routs.json', 'utf8');
        }).then(function (d) {
            var data = d === '' ? {} : JSON.parse(d);
            data[module] = {
                dir: dest
            };
            var str_data = JSON.stringify(data);
            str_data = beautify(str_data, {
                indent_size: 2
            });
            fs.writeFileAsync('routs.json', str_data).then(function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
        });
});