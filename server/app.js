/**
 * Main application file
 */

//Starting point of the server, called from an root/index.js
'use strict';

import express from 'express'; // express is a node server
import mongoose from 'mongoose'; // database connection layer
mongoose.Promise = require('bluebird');
var cors = require('cors')
import config from './config/environment'; //gets my configurations
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
app.use(cors());
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app); //get routes from root/routs.js
require('events').EventEmitter.prototype._maxListeners = 0;

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
