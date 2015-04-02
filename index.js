var pkg = require('./package.json');
var gits = (pkg.gitDependencies);

var get = function (name) {
    if (gits.hasOwnProperty(name)) {
        var rel_path = './' + gits[name].dir + '/';
        console.log(gits[name].dir);
        console.log(require(rel_path));
    } else {
        throw new Error('wtf?');
    }
}

get('gulp-git');