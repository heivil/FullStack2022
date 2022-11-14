//const fs = require('fs');
//const { findSourceMap } = require('module');
//const bodyparser = require('body-parser');
//const { getByTestId } = require('@testing-library/react');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const komennot = require("./Komennot");

app.use(cors());
app.use(express.json());
/* app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()) */

app.get('/tentti/:tenttiId', (req, res,) => { 
  komennot.lataaTenttiIdllä(req, res)
})

app.get('/kirjaudu/:tunnus/:salasana', (req, res) => {
  komennot.kirjaudu(req, res)
})

app.get('/tarkistaTunnus/:tunnus', (req, res) => {
  komennot.tarkistaTunnus(req, res)
})

app.post('/rekisteroi', (req, res) => {
  komennot.rekisteröi(req, res)
})

app.post('/lisaaTentti', async (req, res) => {
  komennot.lisääTentti(req, res)
})

app.patch('/muutaTentti/:id', async (req, res) =>{
  komennot.muutaTentti(req, res)
})
 
app.delete('/poistaTentti/id/:id', async (req, res) => {
  komennot.poistaTentti(req, res)
})

app.get('/heaKysymysTenttiIdllä/:id', async (req, res) => {
  komennot.haeKysymysTenttiIdllä(req, res)
})

app.post('/lisaaKysymys/:kys_nimi/tentti/:tentti_id', async (req, res) => {
  komennot.lisääKysymys(req, res)
})

app.patch('/muutaKysymys/id/:id/kys_nimi/:kys_nimi/tentti_id', async (req, res) =>{
  komennot.muutaKysymys(req, res)
})

app.delete('/poistaKysymys/id/:id', async (req, res) => {
  komennot.poistaKysymys(req, res)
})

app.post('/lisaaVastaus/:vas_nimi/kysymys_id/:kysymys_id/pistemaara/:pistemaara/onko_oikein/:onko_oikein', async (req, res) => {
  komennot.lisääVastaus(req, res)
})

app.patch('/muutaVastaus/id/:id/vas_nimi/:vas_nimi/kysymys_id/:kysymys_id/pistemaara/:pistemaara/onko_oikein/:onko_oikein', async (req, res) =>{
  komennot.muutaVastaus(req, res)
})

app.delete('/poistaVastaus/id/:id', async (req, res) => {
  komennot.poistaVastaus(req, res)
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