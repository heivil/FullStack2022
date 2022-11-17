const pool = require("../db")

const haeKysymysTenttiIdllä = async (req, res) => {
  console.log("Palvelimelta kysytään kysymystä")
  try{
    let result = await pool.query(`SELECT * FROM kysymys WHERE tentti_id = ${req.params.tenttiId}`)
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  }
}

const lisääKysymys = async (req, res) => {
  console.log("kysymystä lisäämässä")
  try{
    let result = await pool.query("INSERT INTO kysymys (kys_nimi, tentti_id) VALUES ($1, $2)", [req.params.kys_nimi, req.params.tentti_id])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }

}

const muutaKysymys = async (req, res) => {
  console.log("Muutetaan kysymyksen tietoja")
  try{
    let result = await pool.query(`UPDATE kysymys SET kys_nimi='${req.params.kys_nimi}?', tentti_id=${req.params.tentti_id} WHERE id=${req.params.id}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaKysymys = async (req, res) => {
  console.log("poistamassa kysymystä")
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let delVas = await client.query(`DELETE FROM vastaus WHERE kysymys_id = ${req.params.id}`)
    let delKys = await client.query(`DELETE FROM kysymys WHERE id = ${req.params.id}`)
    res.status(200).send("Kysymys ja sen vastaukset poistettu")
    await client.query('COMMIT')
  }catch (err){
    res.status(500).send(err)
    await client.query('ROLLBACK')
  }finally{
    client.release()
  }
}

module.exports = {
  haeKysymysTenttiIdllä,
  lisääKysymys,
  muutaKysymys,
  poistaKysymys
  
}