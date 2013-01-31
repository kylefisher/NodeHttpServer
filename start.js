/**
 * Created with JetBrains WebStorm.
 * User: KFisher
 * Date: 1/30/13
 * Time: 10:01 AM
 * To change this template use File | Settings | File Templates.
 */

// try to start server and inject all dependencies
// create file reader
// create router
// create server, inject router, file reader

var fileReader = require('./file');
var server = require('./server');

server.start(fileReader);