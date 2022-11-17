//const fs = require('fs');
//const { findSourceMap } = require('module');
//const bodyparser = require('body-parser');
//const { getByTestId } = require('@testing-library/react');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const login = require("./Komennot/Login");
const tentit = require("./Komennot/Tentit")
const kysymykset = require("./Komennot/Kysymykset")
const vastaukset = require("./Komennot/Vastaukset")
const verifoi = require("./Verifoi")

app.use(cors());
app.use(express.json());
/* app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()) */

app.post('/rekisteroi/tunnus/:tunnus/salasana/:salasana/tentti_id/:tentti_id/onko_admin/:onko_admin', (req, res) => {
  login.rekisteröi(req, res)
})

app.get('/kirjaudu/tunnus/:tunnus/salasana/:salasana', (req, res) => {
  login.kirjaudu(req, res)
})

//app.use(verifoi.verifyToken)

app.get('/tentti/id/:tentti_id', (req, res,) => { 
  tentit.lataaTenttiIdllä(req, res)
})

app.post('/lisaaTentti/nimi/:nimi/min_pisteet/:min_pisteet', (req, res) => {
  tentit.lisääTentti(req, res)
})

app.patch('/muutaTentti/id/:id', (req, res) =>{
  tentit.muutaTentti(req, res)
})
 
app.delete('/poistaTentti/id/:id', (req, res) => {
  tentit.poistaTentti(req, res)
})

app.get('/heaKysymysTenttiIdllä/id/:id', (req, res) => {
  kysymykset.haeKysymysTenttiIdllä(req, res)
})

app.post('/lisaaKysymys/kysymys/:kys_nimi/tentti/:tentti_id', (req, res) => {
  kysymykset.lisääKysymys(req, res)
})

app.patch('/muutaKysymys/id/:id/kys_nimi/:kys_nimi/tentti_id', (req, res) =>{
  kysymykset.muutaKysymys(req, res)
})

app.delete('/poistaKysymys/id/:id', (req, res) => {
  kysymykset.poistaKysymys(req, res)
})

app.post('/lisaaVastaus/vastaus/:vas_nimi/kysymys_id/:kysymys_id/pisteet/:pisteet/onko_oikein/:onko_oikein', (req, res) => {
  vastaukset.lisääVastaus(req, res)
})

app.patch('/muutaVastaus/id/:id/vas_nimi/:vas_nimi/kysymys_id/:kysymys_id/pisteet/:pisteet/onko_oikein/:onko_oikein', (req, res) =>{
  vastaukset.muutaVastaus(req, res)
})

app.delete('/poistaVastaus/id/:id', (req, res) => {
  vastaukset.poistaVastaus(req, res)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/* app.use(komennot.varasLähtö)

app.get("/testi", komennot.yksi , async (req, res) => {
  komennot.kaksi(req, res)
  console.log("kolme")
  res.send("päästiin perille")
}); */
