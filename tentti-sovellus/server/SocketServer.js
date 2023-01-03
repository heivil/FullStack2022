var readline = require('readline');

var net = require('net');
var serverinSoketti = null;

var chättääjät = []
const kiroSanat = ["vittu", "perkele", "saatana", "kyrpä", "homo", "huora", "paska", "kusi", "jumalauta", "helvetti", "johanna tukiainen" ]

var server = net.createServer((socket) => {
	
	socket.write('Echo server\r\n');
	socket.write('Syötä tunnus');
	chättääjät.push(socket)

	const heitäUlos = () => {
		clearTimeout(socket.ajastin);
		console.log("heitetään ulos")
    socket.destroy()
	}
	socket.ajastin = setTimeout(heitäUlos, 30000);
	
	socket.on('error', (err) => {
		console.log("Socketissa error: " + err)
	})

	socket.on('data', (data) => {
		for(i = 0; i < kiroSanat.length; i++){
			if(data.toString().toLowerCase().includes(kiroSanat[i])){
				console.log("Kiroilu ei ole sallittu")
				socket.write('Eipä kiroilla');
				heitäUlos()
				return
			}
		}
		if(socket.ajastin) {
			clearTimeout(socket.ajastin);
			socket.ajastin = setTimeout(heitäUlos, 30000);
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
