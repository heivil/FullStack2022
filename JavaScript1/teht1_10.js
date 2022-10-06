
//tehtävä 1.10 a
const lukulista = () =>{
    let list = [];
    for(i = 7; i<=131; i++){
        list.push(i)
    }
    return list
}

const lista = lukulista();

const lukujenSumma = lista.reduce(
  (previous, current) => previous + current
);

console.log(lukujenSumma);

//1.10 b
const summaLaskuri = (a, b) =>{

    let summa = 0

    //for laskin
    /* if(a>0 && b>0 && b>a){
        for(i = a; i <= b; i++){
            summa += i;
        }
    }else {
        console.log("syötä *positiiviset* luvut niin, että toisena syötetty luku on suurempi kuin ensimmäisenä syötetty luku.")
        return summa
    }
    */

    //reduce laskin
    let list = [];
    for(i = a; i<=b; i++){
        list.push(i)
    }

    summa = list.reduce(
        (previous, current) => previous + current
      );

    return summa 
}


console.log(summaLaskuri(5, 11))