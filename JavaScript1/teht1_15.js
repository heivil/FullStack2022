//tehtävä 1.15 a
const tulostin = () => {
    for(x = 0; x <= 3; x++){
        if(x != 0)console.log("")

        for(y = 0; y < x; y++){
            console.log("*")
        }
    }
}

//tulostin()

//tehtävä 1.15 b
const suoraKulmaTulostin = (korkeus, leveys) => {
    let merkkiJono = ""
    for(i = 0; i < leveys; i++){
        merkkiJono += "*"
    }

    for(i = 0; i < korkeus; i++){
        console.log(merkkiJono)
    }
}

suoraKulmaTulostin(3,4)