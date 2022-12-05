const pool = require("../db")

const tallennaVastaukset = async (req, res) => {
  try{
    await pool.query("INSERT INTO kayttajan_vastaus (kayttajan_id, vas_nimi, kysymys_id) VALUES ($1, $2, $3)", 
    [req.params.käyttäjän_id, req.params.vas_nimi, req.params.kysymys_id])
    next() 
  }catch(err){
    res.status(500).send(err)
  }
}

const tallennaSuoritus = async (req, res) => {
  console.log("Tallennetaan tenttisuoritusta")
  let meniköLäpi = false
  if(req.params.pisteet > req.params.minpisteet){
    meniköLäpi = true
  }
  try{
    let result = await pool.query("INSERT INTO kayttajan_tentit (kayttajan_id, tentti_id, onko_suoritettu, pisteet) VALUES ($1, $2, $3, $4)", 
    [req.params.käyttäjän_id, req.params.tentti_id, meniköLäpi, req.params.pisteet])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports = {
  tallennaVastaukset,
  tallennaSuoritus
}