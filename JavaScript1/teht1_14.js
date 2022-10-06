const kertotaulut = (a, b) => {
    for(x = a; x <= b; x++){
        for(y = 1; y <= b; y++){
            console.log(x + "*" + y + "=" + (x*y) )
        }
    }
}

kertotaulut(1, 10)