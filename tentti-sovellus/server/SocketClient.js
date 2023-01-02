var net = require('net');
var readline = require('readline');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', () => {
    console.log('Connected');

/*     var rl = readline.createInterface(
        process.stdin, process.stdout);
    rl.setPrompt(`Syötä tunnus:`);
    rl.prompt()

    rl.on('line', (tunnus) => {
        client.write(tunnus)
        rl.close();
    }); */
});

client.on('error', (err) => {
  console.log('Error tuli' + err);

});

client.on('data', (data) => {
    console.log('Received: ' + data);

    //lue komentoriviltä tekstiä ja lähetä se sockettiin. 
    //    client.write (komentoriviltäluettudata)

    var rl = readline.createInterface(
        process.stdin, process.stdout);

    rl.setPrompt(`>`);
    rl.prompt()

    rl.on('line', (teksti) => {
        //console.log(`teksti: ${teksti}`);
        client.write(teksti)
        rl.close();
    });
//    client.write("Viesti asiakkaalta")

    //	client.destroy(); // kill client after server's response
});

client.on('close', () => {
    console.log('Connection closed');
});