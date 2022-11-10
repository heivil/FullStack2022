const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { findSourceMap } = require('module');
const app = express();
const port = 8080;
const { Pool } = require('pg');
const bodyparser = require('body-parser');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TenttiDB',
  password: 'admin',
  port: 5432,
})

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.get('/', (req, res) => {
  console.log("testaillaan")
  //const data = fs.readFileSync("./SaveData.json", { encoding: 'utf8', flag: 'r' }); 
  res.send("hello")
})

app.get('/lataaTentti/:tenttiId', async (req, res,) => { 
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
    for(i = 0; i < vas.rowCount; i++){
      for(j = 0; j < kysymykset.length; j++){
        if(kysymykset[j].id === vas.rows[i].kysymys_id){
          kysymykset[j].vastaukset === undefined && (kysymykset[j].vastaukset = [])
          kysymykset[j].vastaukset.push(vas.rows[i])
        }
      }
    } 
    res.send(tentti)
  }catch(err){
    res.status(500).send(err)
  } 
})

app.get('/kirjaudu/:tunnus/:salasana', async (req, res) => {
  console.log("kirjaudutaan", req.params.tunnus)
  try {
    let result = await pool.query(`SELECT tunnus, salasana, tentti_id, onko_admin FROM kayttaja WHERE tunnus = '${req.params.tunnus}' AND salasana = '${req.params.salasana}'`)
    if (result.rows[0].tunnus === req.params.tunnus && result.rows[0].salasana === req.params.salasana) {
      //voi kirjautua
      res.send(result.rows[0])
    }else{
      res.send("väärä tunnus tai salasana")
    }
  }catch (err){
    res.status(500).send(err)
  }
})

app.get('/tarkistaKayttaja/:tunnus' ,async (req, res) => {
  console.log("tarkistetaan käyttäjätunnus")
  try {
    let onVapaa = true
    let result = await pool.query(`SELECT tunnus FROM kayttaja`)
    if (result.rows.filter(käyttäjä => käyttäjä.tunnus === req.params.tunnus).length > 0) {
      onVapaa = false
    }
    res.send(onVapaa)
  }catch (err){
    res.status(500).send(err)
  }
})

app.post('/rekisteroi', async (req, res) => {
  console.log("lisätään käyttäjää")
  try {
    let result = await pool.query("INSERT INTO kayttaja (tentti_id, tunnus, salasana, onko_admin) VALUES ($1, $2, $3, $4)", 
    [req.body.tentti_id, req.body.tunnus, req.body.salasana, req.body.onko_admin])
    res.send(result.rows)
  } catch (err) {
    res.status(500).send(err)
  }
})

/* app.get('/tentti', async (req, res) => {
  console.log("Palvelimelta kysytään tenttiä")
  try{
    let result = await pool.query("SELECT * FROM tentti")
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  }
})

app.post('/tentti', async (req, res) => {
  console.log("Tenttiä lisäämässä")
  try{
    let result = await pool.query("INSERT INTO tentti (nimi, min_pisteet) VALUES ($1, $2)", [req.body.nimi, req.body.min_pisteet])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }
})

app.delete('/tentti', async (req, res) => {
  console.log("poistamassa tenttiä")
  try{
    let result = await pool.query("DELETE FROM tentti WHERE id = " + req.body.id )
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
})

app.get('/kysymys', async (req, res) => {
  console.log("Palvelimelta kysytään kysymystä")
  try{
    let result = await pool.query("SELECT * FROM kysymys")
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  }
})

app.post('/kysymys', async (req, res) => {
  console.log("kysymystä lisäämässä", req.body)
  try{
    let result = await pool.query("INSERT INTO kysymys (tentti_id, nimi) VALUES ($1, $2)", [req.body.tentti_id, req.body.nimi])
    res.status(200).send(result)
  }catch(err){
    res.status(500).send(err)
  }

})

app.delete('/kysymys', async (req, res) => {
  console.log("poistamassa kysymystä")
  try{
    let result = await pool.query("DELETE FROM kysymys WHERE id = " + req.body.id )
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
})

app.post('/vastaus', async (req, res) => {
  console.log("vastausta lisäämässä", req.body)
  try {
    let result = await pool.query("INSERT INTO vastaus (nimi, kysymys_id, pistemäärä, onko_oikein) VALUES ($1, $2, $3, $4)", [req.body.nimi, req.body.kysymys_id, req.body.pistemäärä, req.body.onko_oikein])
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.delete('/vastaus', async (req, res) => {
  console.log("poistamassa vastausta")
  try{
    let result = await pool.query("DELETE FROM kysymys WHERE id = " + req.body.id )
    res.send(result)
  }catch (err){
    res.status(500).send(err)
  }
})

app.post('/vastaus', async (req, res) => {
  console.log("vastausta lisäämässä", req.body)
  try {
    let result = await pool.query("INSERT INTO vastaus (nimi, kysymys_id, pistemäärä, onko_oikein) VALUES ($1, $2, $3, $4)", 
    [req.body.nimi, req.body.kysymys_id, req.body.pistemäärä, req.body.onko_oikein])
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/* app.post('/', (req, res) => {
  console.log("Palvelimelle tallennetaan dataa", req)
  fs.writeFileSync("./SaveData.json", JSON.stringify(req.body.data));
  res.send("Tallennetaan")
}) */

/* const lisääKysymys = (kysymysObjekti) => {
  values=[kysymysObjekti.tenttiId, kysymysObjekti.kysymys]
  try{
    pool.query("INSERT INTO kysymys (tentti_id, kysymys) VALUES ($1, $2)", values)
  }catch (err){
    console.log("Error:",err)
  }
} */

/* lisääKysymys() */