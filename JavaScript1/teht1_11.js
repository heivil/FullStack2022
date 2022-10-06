let list = [];

for(i = 1; i<=10; i++){
    list.push(i)
}

const kertoma = list.reduce(
    (previous, current) => previous * current
);

console.log(kertoma)