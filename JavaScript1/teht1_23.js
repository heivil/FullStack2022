function laskuSuoritus(){
    let i = 0
    let pituus = 0.3
    let leveys = 0.5
    let korkeus = 0.5
    let reissujenMaara = 0
    let kokonaispaino = 0
    while(i < 50){
        const kuutioDm = (10 * pituus) * (10 * leveys) * (10 * korkeus)
        const paino = 2.5 * kuutioDm
        if(kokonaispaino + paino < 10500){
            kokonaispaino += paino
        }else{
            reissujenMaara++;
            kokonaispaino = 0 
            kokonaispaino += paino
        }
        pituus *= 1.02
        leveys *= 1.03
        korkeus *= 1.015
        i++
    }
    return reissujenMaara
}

console.log("Reissuja tulee yhteensä: " + laskuSuoritus())