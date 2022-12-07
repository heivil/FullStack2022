const pool = require("../db")

/* const tallennaVastaukset = async (req, res) => { 
  try{
    await client.query('BEGIN')
    for(let i = 0; i < req.params.vastaukset.length; i++){
      await pool.query("INSERT INTO kayttajan_vastaus (kayttajan_id, vastaus_id) VALUES ($1, $2)", 
      [req.params.käyttäjän_id, req.params.vastaukset[i].vastaus_id])
    }
    await client.query('COMMIT')
    console.log("Käyttäjän vastaukset lisätty tietokantaan.")
    next()
  }catch (err){
    res.status(500).send(err)
    await client.query('ROLLBACK')
  }finally{
    client.release()
  }
} */

const laskePisteet = async (req, res) => {
  try {
    if (req.params.vastaukset.length > 0) {
      for (let i = 0; i < req.params.vastaukset.length; i++) {
        req.params.pisteet += await pool.query(`SELECT pisteet FROM vastaus WHERE id = ${req.params.vastaukset[i]}`)
      }
      next()
    } else {
      res.status(400).send("Vastauksia ei annettu")
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const tallennaSuoritus = async (req, res) => {
  console.log("Tallennetaan tenttisuoritusta")
  console.log("id", req.decoded.id)
  let meniköLäpi = false
  if (req.params.pisteet > req.params.min_pisteet) {
    meniköLäpi = true
  }
  try {
    let result = await pool.query("INSERT INTO kayttajan_tentit (kayttajan_id, tentti_id, onko_suoritettu, pisteet) VALUES ($1, $2, $3, $4)",
      [req.decoded.id, req.params.tentti_id, meniköLäpi, req.params.pisteet])
    res.status(200).send("Tenttisuoritus tallennettu: " + result)
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = {
  /*   tallennaVastaukset, */
  laskePisteet,
  tallennaSuoritus
}