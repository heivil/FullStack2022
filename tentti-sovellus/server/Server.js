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

app.post('/lisääTentti', async (req, res) => {
    komennot.lisääTentti(req, res)
})

app.delete('/poistaTentti', async (req, res) => {
  poistaTentti(res, req)
})

app.get('/heaKysymysTenttiIdllä', async (req, res) => {
  komennot.haeKysymysTenttiIdllä(res, req)
})

app.post('/lisääKysymys', async (req, res) => {
  komennot.lisääKysymys(res, req)
})

app.delete('/poistaKysymys', async (req, res) => {
  komennot.poistaKysymys(res, req)
})

app.post('/lisääVastaus', async (req, res) => {
  komennot.lisääVastaus(res, req)
})

app.delete('/poistaVastaus', async (req, res) => {
  komennot.poistaVastaus(res, req)
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