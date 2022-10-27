const fs = require('fs');
const express = require('express')  
const cors = require('cors');
const { findSourceMap } = require('module');
const app = express()
const port = 8080

app.use(cors())  

app.use(express.json());

app.get('/', (req, res) => {
  console.log("Palvelimelta kysytään dataa ")
  const data = fs.readFileSync("./SaveData.json", { encoding: 'utf8', flag: 'r' }); 
  res.send(data)
})

app.post('/', (req, res) => {
  console.log("Palvelimelle tallennetaan dataa", req)
  fs.writeFileSync("./SaveData.json", JSON.stringify(req.body.data));
  res.send("Tallennetaan")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})