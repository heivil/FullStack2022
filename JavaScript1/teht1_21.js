const mikaNimiIf = (nimi) => {
    if(nimi === "Pekka" || nimi === "Liisa" || nimi ===  "Jorma"){
        console.log("Minustakin " + nimi + " on kiva.");
    }else{
        console.log("En tunne henkilöä.")
    }
    
}

const mikaNimiSwitch = (nimi) => {
    switch(nimi){
        case "Pekka":
            console.log("Minustakin " + nimi + " on kiva.")
            break;
        case "Liisa":
            console.log("Minustakin " + nimi + " on kiva.")
            break;
        case "Jorma":
            console.log("Minustakin " + nimi + " on kiva.")
            break;
        default:
            console.log("En tunne henkilöä.")
            break;
    }
}

mikaNimiSwitch("Pekka")