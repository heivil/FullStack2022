let palkat = [ 
    {kuu: "tammi", bruttopalkka: 2000, veroProsentti: 0.20},
    {kuu: "helmi", bruttopalkka: 1900, veroProsentti: 0.20},
    {kuu: "maalis", bruttopalkka: 2200, veroProsentti: 0.20},
    {kuu: "huhti", bruttopalkka: 2100, veroProsentti: 0.20},
    {kuu: "touko", bruttopalkka: 2500, veroProsentti: 0.20},
    {kuu : "kesa", bruttopalkka: 2000, veroProsentti: 0.20},
    {kuu: "heina", bruttopalkka: 2300, veroProsentti: 0.20},
    {kuu: "elo", bruttopalkka: 2300, veroProsentti: 0.20},
    {kuu: "syys", bruttopalkka: 1950, veroProsentti: 0.20},
    {kuu: "loka", bruttopalkka: 2400, veroProsentti: 0.20},
    {kuu: "marras", bruttopalkka: 2340, veroProsentti: 0.20},
    {kuu: "joulu", bruttopalkka: 2200, veroProsentti: 0.20}
]

const palkatVerojenJälkeen = palkat.map(x => {
    const temp = {};

    temp.kuu = x.kuu;
    temp.nettoPalkka = x.bruttopalkka - (x.bruttopalkka * x.veroProsentti);

    return temp;
})

console.log(palkatVerojenJälkeen);