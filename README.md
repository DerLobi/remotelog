# remotelog #


`console.log` is very helpful for debugging your node.js app, but there are situations where you find yourself without CLI access (e.g. in certain PaaS hosting environments).

remotelog uses socket.io to let you view the output of console.log via another web- or cli-client.

## Usage ##
In your node.js app, include the following code to start a remotelog-server that listens on the default port 1807:

	var remote = require('./remotelog.js').createServer();
	
You can build a simple client by including the following code in your client HTML (this assumes your node.js app runs on the same machine and te remotelog-server uses the default port):

	<script src="http://localhost:1807/socket.io/socket.io.js"></script>
	<script>
		var socket = io.connect('http://localhost:1807');
	  	socket.on('log', function (data) {
			document.write(data.message)
		});
	</script>

