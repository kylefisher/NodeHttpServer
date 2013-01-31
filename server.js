/**
 * Created with JetBrains WebStorm.
 * User: KFisher
 * Date: 1/29/13
 * Time: 7:46 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var url = require('url');
var mime= require('./modules/mime');

function start(fileReader)
{
    var onRequest = function(request, response) {
        var filename = url.parse(request.url).pathname.substr(1);
        var mimeType = mime.lookup(filename);
        console.log('filename = ' + filename + ", mimeType = " + mimeType);

        fileReader.read(filename, function(output)
        {
            console.log('writing response');

            var headerContent = {"Content-Type": mimeType };

            if (output)
            {
                response.writeHead(200, headerContent);
                response.write(output);
            }
            else
            {
                response.writeHead(404, headerContent);
                response.write('<html><head><title>file not found!</title><body><h1>file not found!</h1></body></head></html>')
            }

            response.end();
        });
    };

    http.createServer(onRequest).listen(8888);
    console.log("server listening at port 8888")
}

exports.start = start;