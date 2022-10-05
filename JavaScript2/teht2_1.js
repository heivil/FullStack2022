//*tehtävä 2.1*
let työTuntiTaulukko = [
    {paiva: "maanantai", tunnit: 4}, 
    {paiva: "tiistai", tunnit: 6}, 
    {paiva: "keskiviikko", tunnit: 5}, 
    {paiva: "torstai", tunnit: 4}, 
    {paiva: "perjantai", tunnit: 3},
    {paiva: "lauantai", tunnit: 0},
    {paiva: "sunnuntai", tunnit: 1}
]

//console.log(työTuntiTaulukko)

//*tehtävä 2.2 a*
let keskiArvo = 0

const laskeKeskiarvo = () =>{
    for(i = 0; i< työTuntiTaulukko.length; i++){
        keskiArvo = (keskiArvo + työTuntiTaulukko[i].tunnit)
    }
    keskiArvo = keskiArvo / työTuntiTaulukko.length
    console.log(keskiArvo)
}

//laskeKeskiarvo();

//*tehtävä 2.2 b*
const laskeKeskiarvoReduce = () =>{
    keskiArvo = työTuntiTaulukko.reduce(
        (previous, current) => previous + current.tunnit, 0
      );
      keskiArvo = keskiArvo / työTuntiTaulukko.length
      console.log(keskiArvo)
}  

//laskeKeskiarvoReduce();

//*tehtävä 2.3 a*
let min = 0
let max = 0

const minJaMax = () => {
    min = työTuntiTaulukko[0].tunnit
    for(i = 0; i < työTuntiTaulukko.length; i++){
        if(työTuntiTaulukko[i].tunnit < min) {
            min = työTuntiTaulukko[i].tunnit
        }else if (työTuntiTaulukko[i].tunnit > max){
            max = työTuntiTaulukko[i].tunnit
        }
    }
    console.log("Minimi tunnit:", min, "ja maksimi tunnit:", max)
}

//minJaMax()

//*tehtävä 2.3 b*
const minJaMaxReduce = () => {
    min = työTuntiTaulukko[0].tunnit
    min = työTuntiTaulukko.reduce(
        (previous, current) => previous > current.tunnit ? min = current.tunnit : min = min, 0
      );

      max = työTuntiTaulukko.reduce(
        (previous, current) => previous < current.tunnit ? max = current.tunnit : max = max, 0
      );
      
      console.log("Minimi tunnit:", min, "ja maksimi tunnit:", max)
} 

minJaMaxReduce()