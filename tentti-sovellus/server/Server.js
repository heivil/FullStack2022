//const fs = require('fs');
//const { findSourceMap } = require('module');
//const bodyparser = require('body-parser');
//const { getByTestId } = require('@testing-library/react');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const komennot = require("./Komennot");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors());
app.use(express.json());
/* app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()) */

// Handling post request
app.post("/rekisteröi", async (req, res, next) => {
  komennot.rekisteröi(req, res, next)
});

// Handling post request
app.post("/kirjaudu", async (req, res, next) => {
  komennot.kirjaudu(req, res, next)
});


const verifyToken = (req, res, next) =>{

  const token = req.headers.authorization?.split(' ')[1]; 
  //Authorization: 'Bearer TOKEN'
  if(!token)
  {
      res.status(200).json({success:false, message: "Error!Token was not provided."});
  }
  //Decoding the token
  const decodedToken = jwt.verify(token,"secretkeyappearshere" );
  req.decoded = decodedToken
  next() 
} 

app.use(verifyToken)


app.get('/tentti/id/:tentti_id', (req, res,) => { 
  komennot.lataaTenttiIdllä(req, res)
})

app.get('/kirjaudu/tunnus/:tunnus/salasana/:salasana', (req, res) => {
  komennot.kirjaudu(req, res)
})

app.get('/tarkistaTunnus/tunnus/:tunnus', (req, res) => {
  komennot.tarkistaTunnus(req, res)
})

app.post('/rekisteroi', (req, res) => {
  komennot.rekisteröi(req, res)
})

app.post('/lisaaTentti', (req, res) => {
  komennot.lisääTentti(req, res)
})

app.patch('/muutaTentti/id/:id', (req, res) =>{
  komennot.muutaTentti(req, res)
})
 
app.delete('/poistaTentti/id/:id', (req, res) => {
  komennot.poistaTentti(req, res)
})

app.get('/heaKysymysTenttiIdllä/id/:id', (req, res) => {
  komennot.haeKysymysTenttiIdllä(req, res)
})

app.post('/lisaaKysymys/kysymys/:kys_nimi/tentti/:tentti_id', (req, res) => {
  komennot.lisääKysymys(req, res)
})

app.patch('/muutaKysymys/id/:id/kys_nimi/:kys_nimi/tentti_id', (req, res) =>{
  komennot.muutaKysymys(req, res)
})

app.delete('/poistaKysymys/id/:id', (req, res) => {
  komennot.poistaKysymys(req, res)
})

app.post('/lisaaVastaus/vastaus/:vas_nimi/kysymys_id/:kysymys_id/pisteet/:pisteet/onko_oikein/:onko_oikein', (req, res) => {
  komennot.lisääVastaus(req, res)
})

app.patch('/muutaVastaus/id/:id/vas_nimi/:vas_nimi/kysymys_id/:kysymys_id/pisteet/:pisteet/onko_oikein/:onko_oikein', (req, res) =>{
  komennot.muutaVastaus(req, res)
})

app.delete('/poistaVastaus/id/:id', (req, res) => {
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