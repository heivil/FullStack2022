//import LisääVastaus from './testi';

const fs = require('fs');
const express = require('express')  
const cors = require('cors');
const { findSourceMap } = require('module');
const app = express()
const port = 8080
const { Pool } = require('pg')
const bodyparser = require('body-parser')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TenttiDB',
  password: 'admin',
  port: 5432,
})

app.use(cors())  
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//const data = fs.readFileSync("./SaveData.json", { encoding: 'utf8', flag: 'r' }); 

//täältä on tarkoitus siirrellä metodit toisiin tiedostoihin kunhan kerkeää/saa toimimaan


app.get('/', async (req, res) => {
  console.log("palvelimelta kysellään dataa", req.body)
 /*  try{
    let result = await pool.query("SELECT * FROM" + req.body.)
    res.send(result.rows)
  }catch(err){
    res.status(500).send(err)
  } */
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