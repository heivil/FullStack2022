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

app.get('/lataa/:tenttiId', async (req, res,) => {
  let tentti
  let kysymykset
  let vastaukset

  const tenttiId = Number(req.params.tenttiId)
  //const kysymysId = Number(req.params.kysymysId)

  console.log("Ladataan dataa tietokannasta")

  //vähän kuumottaa noin monta awaitia putkeen
  try{
    //result = await pool.query("SELECT ten_nimi, kys_nimi, vas_nimi FROM tentti INNER JOIN kysymys ON tentti.id = kysymys.tentti_id INNER JOIN vastaus ON kysymys.id = vastaus.kysymys_id" )
    let result = await pool.query("SELECT ten_nimi FROM tentti WHERE id = 1")
    tentti = result.rows
    result = await pool.query("SELECT kys_nimi FROM kysymys WHERE tentti_id = 1")
    kysymykset = result.rows
    result = await pool.query("SELECT vas_nimi FROM vastaus WHERE kysymys_id = 12 OR kysymys_id = 13 OR kysymys_id = 18")
    vastaukset = result.rows
    console.log(tentti, kysymykset, vastaukset)
    res.send({tentti, kysymykset, vastaukset})
  }catch(err){
    res.status(500).send(err)
  } 
})

app.get('/tentti', async (req, res) => {
  console.log("Palvelimelta kysytään tenttiä")
  try{
    let result = await pool.query("SELECT * FROM tentti")
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  }
})

app.get('/testi/', async (req, res) => {
  console.log("testi")
  res.send("kukkuu")
  /* try{
    let result = await pool.query("SELECT * FROM tentti")
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  } */
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
})

app.post('/kayttaja', async (req, res) => {
  console.log("lisätään käyttäjää")
  try {
    let result = await pool.query("INSERT INTO käyttäjä (tentti_id, nimi, käyttäjätunnus, salasana, onko_admin) VALUES ($1, $2, $3, $4, $5)", 
    [req.body.tentti_id, req.body.nimi, req.body.käyttäjätunnus, req.body.salasana, req.body.onko_admin])
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})

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