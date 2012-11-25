# remotelog


`console.log` is very helpful for debugging your node.js app, but there are situations where you find yourself without CLI access (e.g. in certain PaaS hosting environments).

remotelog uses socket.io to let you view the output of console.log via another web- or cli-client.

## Usage
### Server

In your node.js app, include the following code to start a remotelog server that listens on the default port 1807:
```js
var remote = require('./remotelog.js').createServer();
``` 
### Client
    
You can build a simple web client by including the following code in your client HTML (this assumes your node.js app runs on the same machine and the remotelog server uses the default port):

```html
<script src="http://localhost:1807/socket.io/socket.io.js"></script>
<script>
    var socket = io.connect('http://localhost:1807');
    socket.on('log', function (data) {
        document.write(data.message)
    });
</script>
```

Similarly, a node.js CLI-client would look like this:
```js
var socket = require('socket.io-client').connect('http://localhost:1807');
socket.on('log', function (data) {
    console.log(data.message);
});
```
## Options
When starting the remotelog server you can pass an object with options like this:
```js
var remote = require('./remotelog.js').createServer({
    "port":6543,
    "replaceFunctions": false
});
```
### `port`
This is the port the remotelog server listens on for connections from a client. The default port is 1807.

### `replaceFunctions`
By default starting the server substitutes all calls to `console.log`, so they can be viewed by a client (but keeping the original functionality). That means you just have to inclue remotelog and create the remotelog server without having to change the calls to `console.log`.
If you want to just transmit certain messages to a client, you have to set `replaceFunctions` to `false`. This way none of the messages supplied to `console.log` are transmitted. However, you can use the functionality of remotelog by calling `log()` on the remotelog object instead of `console`. Example:

```js
var remote = require('./remotelog.js').createServer({"replaceFunctions":"false"});
console.log("Lorem Ipsum"); // output only on the system where the app runs

remote.log("dolor sit amet") // output on the system via console.log(), as well as on the connected client

```

## info, warn, error
Calls to `console.info`, `console.warn` and `console.error` get treated the same way as `console.log`. That means that by default e.g. `console.error` gets transmitted to a client as an event `'error'`. You can also call `error()` on the remotelog object explicitly, e.g. when you set `replaceFunctions` to `false`.

