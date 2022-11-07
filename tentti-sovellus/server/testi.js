const LisääVastaus = () => {
  app.post('/vastaus', async (req, res) => {
    console.log("vastausta lisäämässä", req.body)
    try {
      let result = await pool.query("INSERT INTO vastaus (nimi, pistemäärä, onko_oikein) VALUES ($1, $2, $3)", [req.body.nimi, req.body.pistemäärä, req.body.onko_oikein])
      res.status(200).send(result)
    } catch (err) {
      res.status(500).send(err)
    }

  })
}

export default LisääVastaus;