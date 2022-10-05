//tehtävä 2.6
const luvut = [1,4,100,2,5,4]

luvut.sort(compare = (a, b) => {
    if(a<b){
        return -1
    }else if(a>b){
        return 1
    }else {
        return 0
    }
})

console.log(luvut)

//Tehtävä 2.7
const luvut2 = ["1","4","100","2","5","4"]

luvut2.sort()

console.log(luvut2)

/*Tehtävä 2.8
Selitys kuinka sort funktio toimii:
    Sort funktion avulla taulukon elementit voidaan järjestellä uudelleen. 
    Sort funktio muuttaa taulukon elementit merkkijonoksi ja vertaa merkkijonon ensimmäisiä merkkejä keskenään.
    Vakiona sort funktio järjestelee taulukon elementit nousevassa järjestyksessä (0,1,2,3 jne / a,b,c,d,e jne).
    Koska sort funktio vertailee merkkijonojen ensimmäisiä merkkejä, ei esim kokonaisluvut järjesty aina pienimmästä suurimpaan,
    vaan esimerkiksi luku "100" tulee järjestyksessä ennen lukua "2" koska, luvun "100" ensimmäinen merkki on "1" joka on pienempi kuin "2"

Compare funktio:
    Compare funktion avulla voidaan määritellä kuinka taulukko järjestellään.
    Compare funtiolla on kaksi parametria (esim. a ja b) joita vertaamalla järjestys määritellään.
    Compare funktiolla palauttaa luvun joka on joko negatiivinen, positiivinen tai 0. 
    Jos funktio palauttaa negatiivisen luvun, funktio järjestää ensimmäisen parametrin (a) ensimmäiseksi.
    Jos funktio palauttaa positiivisen luvun, funktio järjestää toisen parametrin (b) ensimmäiseksi.
    Jos funktio palauttaa luvun 0, funktio ei muuta alkuperäistä järjestystä.
*/