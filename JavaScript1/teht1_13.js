let list = [];

for(i = 0; i<=1000; i++){
    if(i % 2 === 0) list.push(i)
}

const kertoma = list.reduce(
    (previous, current) => previous + current
);

console.log(kertoma)