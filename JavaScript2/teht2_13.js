const objekti = {
    "ma": 44, 
    "pe": 100, 
    "ke": 21, 
    "ti": 66,
    "la": 22
}

let lista = []

const teeLista = (obj) => {
    for(i = 0; i < Object.keys(obj).length; i++){
        const uusiObjekti = {} 
        uusiObjekti[Object.keys(obj)[i].toString()] = Object.values(obj)[i]
        lista.push(uusiObjekti)
    }
}

teeLista(objekti) 

console.log(lista);