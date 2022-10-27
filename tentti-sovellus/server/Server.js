const fs = require('fs');
const express = require('express')  
const cors = require('cors');
const { findSourceMap } = require('module');
const app = express()
const port = 8080

app.use(cors())  

/* app.use(cors({
  origin: "http://localhost:3000"
}))*/

app.use(express.json());

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Palvelimeen tultiin kysymään dataa")
  const data = fs.readFileSync("./SaveData.json", { encoding: 'utf8', flag: 'r' }); 
  res.send(data)
})

app.post('/', (req, res) => {
  console.log("Palvelimeen tultiin tallentamaan dataa")
  fs.writeFileSync('kouludata.json', JSON.stringify(req.body));
  res.send('Tallennetaan')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})