const fs = require('fs');
const express = require('express')  //Jos ei toimi, niin "npm install express"
const cors = require('cors')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  // tiedon luku asynkronisesti
  res.send('Hello!')
})
app.post('/', (req, res) => {
  // tiedon kirjoitus asynkronisesti  req.body antanee tarvittavan datan
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})