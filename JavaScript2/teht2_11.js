const taulukko = [
    {"ma": 44}, 
    {"pe": 100}, 
    {"ke": 21}, 
    {"ti": 66},
    {"la": 22}
]

const tasaLukuTaulukko = taulukko.filter(x => {
    return Object.values(x) % 2 === 0
})

console.log(tasaLukuTaulukko);