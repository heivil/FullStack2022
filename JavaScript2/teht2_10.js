const taulukko = [
    {"ma": 44}, 
    {"pe": 100}, 
    {"ke": 21}, 
    {"ti": 66},
    {"la": 22}
]

const oikeaJarjestys =  {
    "ma": 1,
    "ti": 2,
    "ke": 3,
    "to": 4,
    "pe": 5,
    "la": 6,
    "su": 7
}


taulukko.sort(compare = (a, b) => {
    return oikeaJarjestys[Object.keys(a)] - oikeaJarjestys[Object.keys(b)] 
}) 
console.log(taulukko)