const pool = require("../db")

const lisääVastaus = async (req, res) => {
  console.log("vastausta lisäämässä")
  try {
    let result = await pool.query("INSERT INTO vastaus (vas_nimi, kysymys_id, pisteet, onko_oikein) VALUES ($1, $2, $3, $4)", [req.params.vas_nimi, req.params.kysymys_id, req.params.pisteet, req.params.onko_oikein])
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
}

const muutaVastaus = async (req, res) => {
  console.log("Muutetaan vastauksen tietoja")
  try{
    let result = await pool.query
    (`UPDATE vastaus SET vas_nimi = '${req.params.vas_nimi}', kysymys_id = ${req.params.kysymys_id}, pisteet = ${req.params.pisteet}, onko_oikein = ${req.params.onko_oikein} WHERE id = ${req.params.id}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaVastaus = async (req, res) => {
console.log("poistamassa vastausta")
  try{
    let result = await pool.query(`DELETE FROM vastaus WHERE id = ${req.params.id}`)
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
}

module.exports = {
  lisääVastaus,
  muutaVastaus,
  poistaVastaus
}