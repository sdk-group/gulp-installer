var Promise = require("bluebird");
var Path = require('path');
var _ = require('lodash');
var exec = require('child_process').exec;

module.exports = function shell(command, done) {

    var p = new Promise(function (resolve, reject) {
        options = {
            cwd: process.cwd(),
            maxBuffer: 16 * 1024 * 1024
        };

        var pathToBin = Path.join(process.cwd(), 'node_modules/.bin')
        var PATH = pathToBin + Path.delimiter + process.env.PATH
        options.env = _.extend({}, process.env, {
            PATH: PATH
        }, options.env)


        var child = exec(command, {
            env: options.env,
            cwd: options.cwd,
            maxBuffer: options.maxBuffer
        }, function (e, s, d) {
            if (e) {
                console.log('fck');
                throw new Error('something bad happens:' + e);
                reject('error happens');
                return;
            }

            resolve({
                e: e,
                s: s,
                d: d
            });
        });

    });
    return p;
}