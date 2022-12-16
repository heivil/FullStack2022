const dotenv = require('dotenv');
dotenv.config({path: './../.env'})
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require("../db")


const kirjaudu = async (req, res, next) => {
  console.log("kirjaudutaan")

  let { tunnus, salasana } = req.params;
 
  let existingUser;
  let passwordMatch=false;
  try {
    let result = await pool.query(`SELECT * FROM kayttaja WHERE tunnus = '${tunnus}'`)
    existingUser = {salasana:result.rows[0].salasana, tunnus:result.rows[0].tunnus, tentti_id:result.rows[0].tentti_id, id:result.rows[0].id, onko_admin:result.rows[0].onko_admin};
    passwordMatch = await bcrypt.compare(salasana, existingUser.salasana)

  } catch(err) {
    const error = new Error("Error! Jotain meni vikaan.", err);
    return res.status(500).send(err)
  }


  if (!existingUser || !passwordMatch) {
    console.log("väärä tunnuus tai salasana")
    res.status(500).send("väärä tunnuus tai salasana")
  } else {
    let token;
    let refreshToken;
    try {
      //Creating jwt token
      token = jwt.sign(
        { id: existingUser.id, tunnus: existingUser.tunnus, onko_admin: existingUser.onko_admin },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      refreshToken = jwt.sign(
        { id: existingUser.id, tunnus: existingUser.tunnus, onko_admin: existingUser.onko_admin },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2h" }
      ); 

      res.status(200).json({
        success: true,
        data: {
          id: existingUser.id,
          tunnus: existingUser.tunnus,
          tentti_id: existingUser.tentti_id,
          onko_admin: existingUser.onko_admin,
          token: token,
          refreshToken: refreshToken
        },
    });

    } catch (err) {
      console.log(err);
      const error = new Error("Error! Something went wrong.");
      res.status(500).send(err)
    }
  }
}

const verifoiToken = (req, res, next) =>{
  //const token = req.params.token
  const token = req.headers.authorization?.split(' ')[1];

  //Authorization: 'Bearer TOKEN'
  if(!token)
  {
    return res.status(200).json({success:false, message: "Error!Token was not provided."});
  }
  //Decoding the token
  var decodedToken=jwt.decode(token, {complete: true});
  var dateNow = new Date();

  if(decodedToken.payload.exp < dateNow.getTime() / 1000){
    //uusi token jos refreshtoken on validi
  }else{
    req.decoded = decodedToken.payload
    console.log("token: ", req.decoded)
    next() 
  }
} 

const onkoAdmin = async (req, res, next) => {
  try {
    result = await pool.query("SELECT * FROM kayttaja WHERE tunnus = $1 ", [req.decoded?.tunnus])
    let admin = result.rows[0].onko_admin
    admin ? next() : res.status(403).send("Ei oikeudet riitä")
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const tarkistaTunnus= async(req, res, next) => {
  let result;
  try{
    result = await pool.query(`SELECT * FROM kayttaja WHERE tunnus = '${req.params.tunnus}'`)
    if(result.rowCount > 0){
      res.status(403).send("Käyttäjätunnus varattu")
    }else {
      next()
    }
  }catch(err){
    res.status(500).send(err)
  }
}

const rekisteröi = async (req, res, next) =>{
  const { tunnus, salasana, onko_admin } = req.params;
  let result; 
  const client = await pool.connect()
  try {
    let hashed = await bcrypt.hash(salasana, saltRounds)
    await client.query('BEGIN')
    const tentti_id = await client.query(`SELECT id FROM tentti ORDER BY id ASC`)
    result = await pool.query("INSERT INTO kayttaja (tunnus, salasana, tentti_id, onko_admin) VALUES ($1,$2,$3,$4) RETURNING id",
    [tunnus, hashed, tentti_id.rows[0].id, onko_admin])
    res.status(200).send(result.rows)
    await client.query('COMMIT')
  } catch (err){
    //const error = new Error("Error! Something went wrong.");
    res.status(500).send(err)
    await client.query('ROLLBACK')
  }finally{
    client.release()
  }
} 

module.exports={
  kirjaudu,
  rekisteröi,
  verifoiToken,
  onkoAdmin,
  tarkistaTunnus
}