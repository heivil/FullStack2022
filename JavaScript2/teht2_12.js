const taulukko = [
    {"ma": 44}, 
    {"pe": 100}, 
    {"ke": 21}, 
    {"ti": 66},
    {"la": 22}
]

const eTaulukko = taulukko.filter(x => {
    const merkkiJono = Object.keys(x).toString()
    return merkkiJono.charAt(1) === "e"
})

console.log(eTaulukko)