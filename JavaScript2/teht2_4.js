let palkat = [ 
    {kuu: "tammi", palkka: 2000},
    {kuu: "helmi", palkka: 1900},
    {kuu: "maalis", palkka: 2200},
    {kuu: "huhti", palkka: 2100},
    {kuu: "touko", palkka: 2500},
    {kuu : "kesa", palkka: 2000},
    {kuu: "heina", palkka: 2300},
    {kuu: "elo", palkka: 2300},
    {kuu: "syys", palkka: 1950},
    {kuu: "loka", palkka: 2400},
    {kuu: "marras", palkka: 2340},
    {kuu: "joulu", palkka: 2200}
]

const korotetutPalkat = palkat.map(x => {
    const temp = {};

    temp.kuu = x.kuu;
    temp.palkka = x.palkka * 1.5;

    return temp;
})

console.log(korotetutPalkat);