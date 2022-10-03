const myFunction = (i) => {
    if(i <= 100 ){
        return ""
    } else {
        return "syötit luvun joka on suurempi kuin 100"
    }
}

const viikonpäivä = (päiväNumero) => {
    switch (päiväNumero){
        case 1:
            return "maanantai"
        case 2:
            return "tiistai"
        case 3:
            return "keskiviikko"
        case 4:
            return "torstai"
        case 5:
            return "perjantai"
        case 6:
            return "lauantai"
        case 7:
            return "sunnuntai"
        default:
            console.log("en tunnista päivää");
    }
}

console.log(viikonpäivä(4))