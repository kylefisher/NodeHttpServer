/**
 * Created with JetBrains WebStorm.
 * User: KFisher
 * Date: 1/29/13
 * Time: 7:46 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var fs = require('fs');

var file;

fs.readFile('index.html', function(err, data) {
    if (err) {
        console.log('Error: ' + err);
    }

//    console.log(data);
    file = data;
});

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(file);
    response.end();
    console.log(file);
}).listen(8888);