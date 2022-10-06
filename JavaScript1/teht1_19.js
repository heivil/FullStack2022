const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function asteikkoMuuntaja(){
  rl.question("Anna asteikko ", function (ast) {
    if(ast === "C" || ast === "c" || ast === "F" || ast === "f"){
        rl.question("Anna lukema ", function (luk){
            if(luk <= 100 && luk > -101){
                if(ast === "C" || ast === "c"){
                    luk = 9/5 * luk + 32
                }else {
                    luk =5/9 *(luk -32)
                }
                console.log(luk)
                rl.close();
            }else{
                console.log("lukema virheellinen")
                rl.close();
            }
        })
    }else {
        console.log("asteikko tuntematon")
        rl.close();
    }
  });

}

asteikkoMuuntaja()
