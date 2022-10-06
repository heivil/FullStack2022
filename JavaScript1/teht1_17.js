const karkausVuosiTarkastaja = (vuosi) => {
    let onkoKarkausVuosi = ""
    
    if(vuosi % 400 === 0 || vuosi % 4 === 0 && vuosi % 100 !== 0){
        onkoKarkausVuosi = "on"
    }else{
        onkoKarkausVuosi = "ei"
    }

    return onkoKarkausVuosi
}

console.log(karkausVuosiTarkastaja(1997))
