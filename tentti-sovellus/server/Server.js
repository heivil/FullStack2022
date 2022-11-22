process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const fs = require('fs');
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
const https = require("https");
//const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());
/* app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json()) */


https.createServer(
  // Provide the private and public key to the server by reading each
  // file's content with the readFileSync() method.
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
).listen(port, () => {
  console.log(`Server is runing at port ${port}`);
});

app.post('/rekisteroi/tunnus/:tunnus/salasana/:salasana/tentti_id/:tentti_id/onko_admin/:onko_admin', login.tarkistaTunnus, (req, res, next) => {
  login.rekisteröi(req, res)
})

app.get('/kirjaudu/tunnus/:tunnus/salasana/:salasana', (req, res) => {
  login.kirjaudu(req, res)
})

//app.use(login.verifoiToken)

app.get('/tentti/id/:tentti_id/token/:token', login.verifoiToken, (req, res,) => { 
  tentit.lataaTenttiIdllä(req, res)
})

app.use(login.onkoAdmin)

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


/* app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) */

/* var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'heivil88@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'heivil88@gmail.com',
  to: '',
  subject: 'Sending Email using Node.js',
  text: 'asd, Ville Heikkinen'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  */