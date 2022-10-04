//tehtävä 2.1
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

//tehtävä 2.2 a
let keskiArvo = 0

const laskeKeskiarvo = () =>{
    for(i = 0; i< työTuntiTaulukko.length; i++){
        keskiArvo = (keskiArvo + työTuntiTaulukko[i])
    }
    keskiArvo = keskiArvo / työTuntiTaulukko.length
    console.log(keskiArvo)
}

//laskeKeskiarvo();

//tehtävä 2.3.
const laskeKeskiarvoReduce = () =>{
    keskiArvo = työTuntiTaulukko.reduce(
        (previous, current) => previous + current.tunnit, 0
      );
      keskiArvo = keskiArvo / työTuntiTaulukko.length
      console.log(keskiArvo)
}  

laskeKeskiarvoReduce();