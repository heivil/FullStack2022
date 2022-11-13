const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TenttiDB',
  password: 'admin',
  port: 5432,
})

const lataaTenttiIdllä = async (req, res) => {
  let tentti = {}
  let kysymykset = []
  
  console.log("Ladataan dataa tietokannasta")
  try{
    const nimi = await pool.query(`SELECT ten_nimi FROM tentti WHERE id = ${req.params.tenttiId}`)
    tentti.ten_nimi = nimi.rows[0].ten_nimi
    const kys = await pool.query(`SELECT kys_nimi, id FROM kysymys WHERE tentti_id = ${req.params.tenttiId}`)
    kysymykset = kys.rows
    const vas = await pool.query(`SELECT vas_nimi, kysymys_id FROM vastaus INNER JOIN kysymys ON kysymys.id = vastaus.kysymys_id WHERE kysymys.tentti_id = ${req.params.tenttiId}`)
    tentti.kysymykset = kysymykset
    for(i = 0; i < vas.rows.length; i++){
      for(j = 0; j < kysymykset.length; j++){
        if(kysymykset[j].id === vas.rows[i].kysymys_id){
          kysymykset[j].vastaukset === undefined && (kysymykset[j].vastaukset = [])
          kysymykset[j].vastaukset.push(vas.rows[i])
        }
      }
    } 
    res.status(200).send(tentti)
  }catch(err){
    res.status(500).send(err)
  } 
}

const kirjaudu = async (req, res) => {
  console.log("kirjaudutaan")
  try {
    let result = await pool.query(`SELECT tunnus, salasana, tentti_id, onko_admin FROM kayttaja WHERE tunnus = '${req.params.tunnus}' AND salasana = '${req.params.salasana}'`)
    if (result.rows[0].tunnus === req.params.tunnus && result.rows[0].salasana === req.params.salasana) {
      //voi kirjautua
      res.status(200).send(result.rows[0])
    }else{
      res.status(200).send("väärä tunnus tai salasana")
    }
  }catch (err){
    res.status(500).send(err)
  }
}

const tarkistaTunnus = async (req, res) => {
  console.log("tarkistetaan käyttäjätunnus")
  try {
    let onVapaa = true
    let result = await pool.query(`SELECT tunnus FROM kayttaja`)
    if (result.rows.filter(käyttäjä => käyttäjä.tunnus === req.params.tunnus).length > 0) {
      onVapaa = false
    }
    res.status(200).send(onVapaa)
  }catch (err){
    res.status(500).send(err)
  }
}

const rekisteröi = async (req, res) =>{
  console.log("lisätään käyttäjää")
  try {
    let result = await pool.query("INSERT INTO kayttaja (tentti_id, tunnus, salasana, onko_admin) VALUES ($1, $2, $3, $4)", 
    [req.params.tentti_id, req.params.tunnus, req.params.salasana, req.params.onko_admin])
    res.status(200).send(result.rows)
  } catch (err) {
    res.status(500).send(err)
  }
} 

const lisääTentti = async (req, res) => {
  console.log("Tenttiä lisäämässä")
  try{
    let result = await pool.query("INSERT INTO tentti (nimi, min_pisteet) VALUES ($1, $2)", [req.params.nimi, req.params.min_pisteet])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaTentti = async (req, res) => {
  console.log("poistamassa tenttiä")
  try{
    let result = await pool.query("DELETE FROM tentti WHERE id = " + req.params.id )
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
}

const muutaTentti = async (req, res) => {
  console.log("Muutetaan tentin tietoja")
  try{
    let result = await pool.query(`UPDATE tentti SET ten_nimi = ${req.params.ten_nimi} WHERE tentti_id = ${req.params.tenttiId}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

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
    let result = await pool.query("INSERT INTO kysymys (tentti_id, nimi) VALUES ($1, $2)", [req.params.tentti_id, req.params.nimi])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }

}

const muutaKysymys = async (req, res) => {
  console.log("Muutetaan kysymyksen tietoja")
  try{
    let result = await pool.query(`UPDATE vastaus SET kys_nimi = ${req.params.vas_nimi} WHERE tentti_id = ${req.params.tenttiId}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaKysymys = async (req, res) => {
  console.log("poistamassa kysymystä")
  try{
    let result = await pool.query("DELETE FROM kysymys WHERE id = " + req.params.id )
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
}

const lisääVastaus = async (req, res) => {
  console.log("vastausta lisäämässä", req.params)
  try {
    let result = await pool.query("INSERT INTO vastaus (nimi, kysymys_id, pistemäärä, onko_oikein) VALUES ($1, $2, $3, $4)", [req.params.nimi, req.params.kysymys_id, req.params.pistemäärä, req.params.onko_oikein])
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
}

const muutaVastaus = async (req, res) => {
  console.log("Muutetaan vastauksen tietoja")
  try{
    let result = await pool.query(`UPDATE vastaus SET vas_nimi = ${req.params.vas_nimi} INNER JOIN kysymys ON kysymys.id = vastaus.kysymys_id WHERE kysymys.tentti_id = ${req.params.tenttiId}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaVastaus = async (req, res) => {
console.log("poistamassa vastausta")
  try{
    let result = await pool.query(`DELETE FROM kysymys WHERE id = ${req.params.id} AND kysymys_id = ${req.params.kysymysID} `)
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
}

/* const esmerkki = async (req, res) => {

} */

module.exports = {
  lataaTenttiIdllä,
  kirjaudu,
  tarkistaTunnus,
  rekisteröi, 
  lisääTentti,
  muutaTentti,
  poistaTentti,
  haeKysymysTenttiIdllä,
  lisääKysymys,
  muutaKysymys,
  poistaKysymys,
  lisääVastaus,
  muutaVastaus,
  poistaVastaus
}