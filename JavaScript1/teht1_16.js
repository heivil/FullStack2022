const painoIndeksi = (paino, pituus) => {
    let pituusNelio = Math.pow(pituus, 2)
    return paino / pituusNelio
}

console.log(painoIndeksi(79, 1.77))
