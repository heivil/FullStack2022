const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function litraKulutusLaskin(){
    rl.question("Anna litrat ", function (litr) {
        if(litr > 0){
            rl.question("Anna kilometrit ", function (km) {
                if(km > 0){
                    let sadalla = litr * 100 / km
                    console.log(sadalla)
                    rl.close();
                }else{
                    console.log("Virhesyöttö")
                    rl.close();
                }
            })
        }else {
            console.log("Virhesyöttö")
            rl.close();
        }
    })
}


litraKulutusLaskin()