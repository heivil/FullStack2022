var net = require('net');
var readline = require('readline');

var client = new net.Socket();
var rl = null;

client.connect(1337, '127.0.0.1', () => {
    console.log('Connected');
    console.log('Lähetä yksityisviesti kirjoittamalla viestin alkuun "*tunnus" esim: *erkki viesti');

    rl = readline.createInterface(process.stdin, process.stdout);

    rl.on('line', (teksti) => {
        client.write(teksti);
    });
    rl.setPrompt(`>`);

});

client.on('error', (err) => {
    console.log('Error tuli' + err);
});

client.on('data', (data) => {

    console.log('--' + data);

    rl.prompt();
});

client.on('close', () => {
    console.log('Connection closed');
});