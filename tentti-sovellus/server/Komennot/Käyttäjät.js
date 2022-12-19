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

const laskePisteet = async (req, res, next) => {
  dataObj = JSON.parse(req.body.data)
  console.log("Lasketaan pisteitä")
  try {
    if (dataObj.vastaukset.length > 0) {
      for (let i = 0; i < dataObj.vastaukset.length; i++) {
        vastPisteet = await pool.query(`SELECT pisteet FROM vastaus WHERE id = ${dataObj.vastaukset[i]}`)
        dataObj.pisteet += vastPisteet.rows[0].pisteet
      }
      req.body.data = JSON.stringify(dataObj)
      next()
    } else {
      res.status(400).send("Vastauksia ei annettu")
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const tallennaSuoritus = async (req, res,) => {
  dataObj = JSON.parse(req.body.data)
  let meniköLäpi = false
  if (dataObj.pisteet >= dataObj.min_pisteet) {
    meniköLäpi = true
  }
  try {
    await pool.query("INSERT INTO kayttajan_tentit (kayttajan_id, tentti_id, onko_suoritettu, pisteet) VALUES ($1, $2, $3, $4)",
    [req.decoded.id, dataObj.tentti_id, meniköLäpi, dataObj.pisteet])
    res.status(200).send({pisteet: dataObj.pisteet, läpi: meniköLäpi})
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = {
  /*   tallennaVastaukset, */
  laskePisteet,
  tallennaSuoritus
}