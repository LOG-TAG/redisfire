#!/usr/bin/env node

'use strict';

var program = require('commander');

var _action,
  _opts = {};

program
  .version('0.0.1')
  .option('-p --port <port>', 'Server Port (default 10000)')
  .usage('<start|stop|status> [options]')
  // .option('-v --verbose', 'Verbose mode')
  .description('RedisFire manage server process')
  .action(function(action, options){

    _action = action;

    if (options.port) {
      _opts.port = options.port;
    }

    if (!process.argv.slice(2).length) {
      program.outputHelp();
      return;
    }


  });


program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ redisfire start -p 10001');
  console.log('');
});



program.parse(process.argv);

// console.log('ACTION:', _action);
// console.log('OPTS:', JSON.stringify(_opts, null, 2));

if (!/(start|stop|status)/.test(_action)) {
    program.help();
    return;
}

if (program.integer) {
    console.log('포트!:', program.integer);
}
switch(_action) {
  case 'start':
      var app = require('../app');
      var debug = require('debug')('server:server');
      var http = require('http');
      var port = _opts.port || 3000;
      app.set('port', port);
      var server = http.createServer(app);

      /**
       * inject socket.io
       */
      var io = require('socket.io')(server);
      require('../utils/socket.io-helper').io(io);

      server.listen(port);
      server.on('error', function(error) {
        switch (error.code) {
          case 'EACCES':
            console.error(port + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(port + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      });
    break;

  case 'stop':
    // TODO: implement stop feature
    break;
  case 'status':
    // TODO: implement status feature
    break;
}
