const taulukko = [
    {"ma": 44}, 
    {"pe": 100}, 
    {"ke": 21}, 
    {"ti": 66},
    {"la": 22}
]

taulukko.sort(compare = (a, b) => {
    if(Object.values(a) < Object.values(b)){
        return -1
    }else if(Object.values(a) > Object.values(b)){
        return 1
    }else {
        return 0
    }
}) 
console.log(taulukko)