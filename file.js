/**
 * Created with JetBrains WebStorm.
 * User: KFisher
 * Date: 1/30/13
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

function read (filename, callback)
{
    console.log('reading file ' + filename);

    fs.readFile(filename, function(err, data)
    {
        if (err)
        {
            console.log('Error: ' + err);
            //return;
        }

        console.log('read data from file ' + filename);
        callback(data);
    });
}

exports.read = read;