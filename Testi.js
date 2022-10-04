/* const myFunction = (i) => {
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
 
const lukulista = () =>{
    let list = [];
    for(i = 7; i<=131; i++){
        list.push(i)
    }
    return list
}

const kymppiB = (a, b) =>{
    if(a>0 && b>0 && b>a){

    }else {
        console.log("syötä positiiviset luvut niin että ")
    }
}

const lista = lukulista();


const lukujenSumma = lista.reduce(
  (previous, current) => previous + current
);

console.log(lukujenSumma);
*/
let ihminen2 = {
    etunimi: "Ville",
    sukunimi: "Heikkinen",
    puhelimet: [] 
}

let ihminen = {
    etunimi: "Matti",
    sukunimi: "Heikkinen",
    puhelimet: [],
    sisar: ihminen2   
}




let ihminen3= {
    ...ihminen,
    etunimi: "Kalle",
    lempiruoka: "pizza"
}

let ihmisLista = []
ihmisLista.push(ihminen, ihminen2, ihminen3)

ihminen.puhelimet.push("040 777 6666")


let uusiLista = ihmisLista.map(henkilö => {
    return "<div>" + henkilö.etunimi + "</div>"
})


let html = ihmisLista.reduce((prev, current) => {
    return prev + "<div>" + current.etunimi + "</div>"
})
console.log(html)