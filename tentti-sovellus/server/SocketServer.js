var readline = require('readline');

var net = require('net');
var serverinSoketti = null;

var chättääjät = []

var server = net.createServer((socket) => {
	
	socket.write('Echo server\r\n');
	socket.write('Syötä tunnus');
	chättääjät.push(socket)

	const heitäUlos = () => {
    socket.destroy()
	}
	socket.ajastin = setTimeout(heitäUlos, 20000);
	
	socket.on('error', (err) => {
		console.log("Socketissa error: " + err)
	})

	socket.on('data', (data) => {
		if(socket.ajastin) {
			clearTimeout(socket.ajastin);
			socket.ajastin = setTimeout(heitäUlos, 20000);
		}
		chättääjät.forEach((item) => {
			if(socket.tunnus === undefined){
				socket.tunnus = data
				console.log("tunnus:" + socket.tunnus)
				item.write(socket.tunnus + " liittyi chattiin: ")
			}else{ 
				item.write(socket.tunnus + " sanoo: " + data)
			}
		})
	});

	socket.on('close', () => {
		console.log('Connection closed');
	});

	//socket.pipe(socket);
});


server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, the *nix
utility for reading and writing across tcp/udp network connections.  I've only
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

/* Or use this example tcp client written in node.js.  (Originated with
example code from
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */