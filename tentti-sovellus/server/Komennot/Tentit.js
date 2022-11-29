const pool = require("../db")

const lataaTenttiIdllä = async (req, res) => {
  let tentti = {ten_nimi: "Nimetön tentti"}
  let kysymykset = []
  
  console.log("Ladataan dataa tietokannasta", req.params)
  try{
    const ten = await pool.query(`SELECT * FROM tentti WHERE id = ${req.params.tentti_id}`)
    if(ten.rows.length > 0){
      tentti = ten.rows[0]
    }else{
      res.status(404).send("Tenttiä ei löytynyt")
    }
    const kys = await pool.query(`SELECT * FROM kysymys WHERE tentti_id = ${req.params.tentti_id}`)
    if(kys.rows.length > 0){
      kysymykset = kys.rows
    }
    const vas = await pool.query(`SELECT vastaus.id, kysymys_id, vas_nimi, pisteet, onko_oikein, kys_nimi, tentti_id FROM vastaus INNER JOIN kysymys ON kysymys.id = vastaus.kysymys_id WHERE kysymys.tentti_id = ${req.params.tentti_id}`)
    if(vas.rows.length > 0){
      for(i = 0; i < vas.rows.length; i++){
        for(j = 0; j < kysymykset.length; j++){
          kysymykset[j].vastaukset === undefined && (kysymykset[j].vastaukset = [])
          if(kysymykset[j].id === vas.rows[i].kysymys_id){
            kysymykset[j].vastaukset.push(vas.rows[i])
          }
        }
      } 
    }
    tentti.kysymykset = kysymykset
    
    res.status(200).send(tentti)
  }catch(err){
    res.status(500).send(err)
  } 
}

const lataaTentit = async (req, res) => {
  let tentit = {tenttejä: 0, tenttiLista:[]}
  try{
    const result = await pool.query(`SELECT id, ten_nimi FROM tentti`) 
    tentit.tenttejä = result.rows.length
    if(result.rows.length > 0){
      for(let i = 0; i < result.rows.length; i++){
        tentit.tenttiLista.push(result.rows[i])
      }
    }
    res.status(200).send(tentit)
  }
  catch(err){
    res.status(500).send(err)
  }
}

const lisääTentti = async (req, res) => {
  console.log("Tenttiä lisäämässä", req.params)
  try{
    let result = await pool.query("INSERT INTO tentti (ten_nimi, min_pisteet) VALUES ($1, $2)", [req.params.nimi, req.params.min_pisteet])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const muutaTentti = async (req, res) => {
  console.log("Muutetaan tentin tietoja")
  try{
    let result = await pool.query(`UPDATE tentti SET ten_nimi = ${req.params.ten_nimi} WHERE tentti_id = ${req.params.id}`)
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const poistaTentti = async (req, res) => {
  console.log("poistamassa tenttiä")
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    uusiId = await client.query(`SELECT id FROM tentti`)
    await client.query(`UPDATE kayttaja SET tentti_id = ${uusiId.rows[0].id} WHERE tentti_id = ${req.params.id}`)
    await client.query(`DELETE FROM vastaus USING kysymys WHERE vastaus.kysymys_id = kysymys.id AND kysymys.tentti_id = ${req.params.id}`)
    await client.query(`DELETE FROM kysymys WHERE tentti_id = ${req.params.id}`)
    await client.query(`DELETE FROM tentti WHERE id = ${req.params.id}`)
    res.status(200).send("Tentti ja sen kysymykset ja vastaukset on poistettu")
    await client.query('COMMIT')
  }catch (err){
    res.status(500).send(err)
    await client.query('ROLLBACK')
  }finally{
    client.release()
  }
}

module.exports = {
  lataaTenttiIdllä,
  lisääTentti,
  muutaTentti,
  poistaTentti,
  lataaTentit
}