var readline = require('readline');

var net = require('net');
var serverinSoketti = null;

var chättääjät = []
const kiroSanat = ["vittu", "perkele", "saatana", "kyrpä", "homo", "huora", "paska", "kusi", "jumalauta", "helvetti", "johanna tukiainen" ]
const ulostautumisAika = 120000

var server = net.createServer((socket) => {
	
	socket.write('Echo server\r\n');
	socket.write('Syötä tunnus');
	chättääjät.push(socket)

	const heitäUlos = () => {
		clearTimeout(socket.ajastin);
		console.log(socket.tunnus + " heitetään ulos")
    socket.destroy()
	}

	const nollaaPuheLaskuri = () => {
		socket.puheLaskuri = 0;
	}

	const puhuuLiikaa = () => {
		clearTimeout(socket.puhuuLiikaaAjastin);
		chättääjät.forEach((item)=>{
			item.write(socket.tunnus + " heitetään ulos, koska hän puhuu liikaa!")
		})
		socket.destroy();
	}


	socket.puhuuLiikaaAjastin = setTimeout(nollaaPuheLaskuri, 1000);
	socket.puheLaskuri = 0;

	socket.ajastin = setTimeout(heitäUlos, ulostautumisAika);
	
	
	socket.on('error', (err) => {
		console.log("Socketissa error: " + err)
	})

	socket.on('data', (data) => {

		//katsotaan puhuuko joku liikaa
		clearTimeout(socket.puhuuLiikaaAjastin);
    socket.puhuuLiikaaAjastin = setTimeout(nollaaPuheLaskuri, 1000);
    socket.puheLaskuri++;
    if (socket.puheLaskuri >= 10) {
        puhuuLiikaa();
        return;
    }

		//kirosanafiltteri
		for(i = 0; i < kiroSanat.length; i++){
			if(data.toString().toLowerCase().includes(kiroSanat[i])){
				console.log("Kiroilu ei ole sallittu")
				socket.write('Eipä kiroilla');
				heitäUlos()
				return
			}
		}

		//aloitetaan ajastin, joka mittaa kuinka kauan käyttäjä on ollut hiljaa, uudelleen 
		if(socket.ajastin) {
			clearTimeout(socket.ajastin);
			socket.ajastin = setTimeout(heitäUlos, ulostautumisAika);
		}

		//salaisella stringillä saa potkuoideuden
		if(data.toString() === "Anna minulle potkuoikeudet pliis!"){
			socket.kickAuth = true
			socket.write("Potkuoikeus myönnetty.")
			return
		}
		
		//yksityisviesti tai kickpyyntö
		for(i = 0; i < chättääjät.length; i++){
			if(socket.tunnus !== undefined && data.toString().startsWith("*" + chättääjät[i].tunnus)){
				chättääjät[i].write(socket.tunnus + " lähetti yksityisviestin: " + data.toString().replace("*" + chättääjät[i].tunnus, ""))
				return;
			}	else if(socket.kickAuth === true && data.toString().startsWith("KICK: " + chättääjät[i].tunnus)){
				console.log(chättääjät[i].tunnus + " heitetään ulos käyttäjän " + socket.tunnus + " pyynnöstä")
				chättääjät.forEach((item)=>{
					item.write(chättääjät[i].tunnus + " heitetään ulos käyttäjän " + socket.tunnus + " pyynnöstä")
				})
				chättääjät[i].destroy()
				return;
			}
		}

		//ensimmäinen palvelimelle tullut viesti asetetaan käyttäjätunnukseksi, muuten lähetetään viesti kaikille käyttäjille
		for(i = 0; i < chättääjät.length; i++){
			if(socket.tunnus === undefined){
				socket.tunnus = data
				console.log("tunnus:" + socket.tunnus)
				chättääjät.forEach((item)=>{
					item.write(socket.tunnus + " liittyi chattiin.")
				})
				return
			}else{ 
				chättääjät[i].write(socket.tunnus + " sanoo: " + data)
			}
		}

	});


	socket.on('close', () => {
		console.log('Connection closed');
	});

});

server.listen(1337, '127.0.0.1');