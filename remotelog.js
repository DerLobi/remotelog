/**
 * remotelog.js
 * Copyright (c) 2012 Christian Lobach <Christian.Lobach@gmail.com>
 * MIT licensed
 */

var util = require('util');

var remotelog = {

    _options: {
        port: 1807,
        replaceFunctions: true
    },

    // keep existing functionality
    _oldlog: console.log,
    _oldinfo: console.info,
    _oldwarn: console.warn,
    _olderror: console.error,

    // remote logging functions
    log: function() {
        var d = new Date();
        var t = d.getTime();
        remotelog.socket.emit('log', {
            type: 'log',
            timestamp: t,
            message: util.format.apply(this, arguments)
        });
    },

    info: function() {
        var d = new Date();
        var t = d.getTime();
        remotelog.socket.emit('info', {
            type: 'info',
            timestamp: t,
            message: util.format.apply(this, arguments)
        });
    },

    warn: function() {
        var d = new Date();
        var t = d.getTime();
        remotelog.socket.emit('warn', {
            type: 'warn',
            timestamp: t,
            message: util.format.apply(this, arguments)
        });
    },

    error: function() {
        var d = new Date();
        var t = d.getTime();
        remotelog.socket.emit('error', {
            type: 'error',
            timestamp: t,
            message: util.format.apply(this, arguments)
        });
    },

    // define console.log with new remote logging functionality
    // and keep old behaviour
    replaceOriginalFunctions: function() {
        
        console.log = function() {

            remotelog._oldlog.apply(this, arguments);
            remotelog.log.apply(this, arguments);

        };

        console.info = function() {

            remotelog._oldinfo.apply(this, arguments);
            remotelog.info.apply(this, arguments);

        };

        console.warn = function() {

            remotelog._oldwarn.apply(this, arguments);
            remotelog.warn.apply(this, arguments);

        };

        console.error = function() {

            remotelog._olderror.apply(this, arguments);
            remotelog.error.apply(this, arguments);

        };

    },


    createServer: function(options) {

        if(options) {
            if(typeof options.port !== 'undefined') {
                remotelog._options.port = options.port;
            }
            if(typeof options.replaceFunctions !== 'undefined') {
                remotelog._options.replaceFunctions = options.replaceFunctions;
            }
        }

        remotelog.io = require('socket.io').listen(remotelog._options.port);
        remotelog.io.set('log level', 0);

        remotelog._oldlog("Server gestartet");
        remotelog.io.sockets.on('connection', function(socket) {
            socket.emit('status', {
                status: 'connected'
            });
            remotelog.socket = socket;

            if(remotelog._options.replaceFunctions) {
                remotelog.replaceOriginalFunctions();
            }

        });
    }


};

module.exports = {
    log : remotelog.log,
    info : remotelog.info,
    warn : remotelog.warn,
    error : remotelog.error,
    createServer: remotelog.createServer
}