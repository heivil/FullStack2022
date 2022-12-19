const pool = require("../db")

//jos antaa tentti id 0 niin otetaan uusin tentti id:n perusteella
const lataaTenttiIdllä = async (req, res) => {
  let tentti = {ten_nimi: "Nimetön tentti"}
  let kysymykset = []
  console.log("Ladataan dataa tietokannasta", req.params)
  try{
    let ten
    if(req.params.tentti_id > 0){
       ten = await pool.query(`SELECT * FROM tentti WHERE id = ${req.params.tentti_id}`)
    }else{
       ten = await pool.query(`SELECT * FROM tentti ORDER BY id DESC`)
    }

    if(ten.rows.length > 0){
      tentti = ten.rows[0]
    }else{
      res.status(404).send("Tenttiä ei löytynyt")
      console.log("häh")
    }
    
    const kys = await pool.query(`SELECT * FROM kysymys WHERE tentti_id = ${req.params.tentti_id} ORDER BY id ASC`)
    if(kys.rows.length > 0){
      kysymykset = kys.rows
    }
    const vas = await pool.query(`SELECT vastaus.id, kysymys_id, vas_nimi, pisteet, onko_oikein, tentti_id FROM vastaus INNER JOIN kysymys ON kysymys.id = vastaus.kysymys_id WHERE kysymys.tentti_id = ${req.params.tentti_id} ORDER BY id ASC`)
    let maxPisteet = 0
    if(vas.rows.length > 0){
      for(i = 0; i < vas.rows.length; i++){
        for(j = 0; j < kysymykset.length; j++){
          kysymykset[j].vastaukset === undefined && (kysymykset[j].vastaukset = [])
          if(kysymykset[j].id === vas.rows[i].kysymys_id){
            if(req.decoded.onko_admin == true){
              kysymykset[j].vastaukset.push(vas.rows[i])
            }else {
              kysymykset[j].vastaukset.push({
                id: vas.rows[i].id,
                kysymys_id: vas.rows[i].kysymys_id,
                tentti_id: vas.rows[i].tentti_id,
                vas_nimi: vas.rows[i].vas_nimi
              })
            }

            if(vas.rows[i].pisteet > 0) maxPisteet += vas.rows[i].pisteet
          }
        }
      } 
    }
    tentti.kysymykset = kysymykset
    tentti.maxPisteet = maxPisteet
    tentti.minPisteet = maxPisteet/2
    token = req.undecodedToken
    res.status(200).send({tentti, token})
  }catch(err){
    res.status(500).send(err)
  } 
}

const lataaTentit = async (req, res) => {
  let tentit = {tenttejä: 0, tenttiLista:[]}
  try{
    const result = await pool.query(`SELECT id, ten_nimi FROM tentti ORDER BY id ASC`) 
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
  console.log("Tenttiä lisäämässä")
  try{
    let result = await pool.query("INSERT INTO tentti (ten_nimi) VALUES ($1)", [req.params.nimi])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
}

const muutaTentti = async (req, res) => {
  console.log("Muutetaan tentin tietoja")
  try{
    let result = await pool.query(`UPDATE tentti SET ten_nimi = '${req.params.ten_nimi}' WHERE id = ${req.params.id}`)
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