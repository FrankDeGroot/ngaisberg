// Cloud 9 does not support setting your own environment variables
// so they're added from directory env.
// filename = variable name, file contents = variable value.
var fs = require('fs'),
    dir = __dirname + '/../env/';
    
module.exports = function (callback) {
    fs.readdir(dir, function (err, files) {
        if(err) {
            console.log(err);
            return;
        }
        setEnv(files, 0);
    });
    
    function setEnv(files, i) {
        var file;
        if (i === files.length) {
            callback();
            return;
        }
        file = files[i];
        fs.readFile(dir + file, function (err, data) {
            if(err) {
                console.log(err);
                return;
            }
            if (file.substr(0) !== '.') {
                process.env[file] = data;
                setEnv(files, ++i);
            }
        });
    }
};
