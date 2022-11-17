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
    existingUser = {salasana:result.rows[0].salasana, tunnus:result.rows[0].tunnus, id:result.rows[0].id};
    passwordMatch = await bcrypt.compare(salasana, existingUser.salasana)

  } catch(err) {
    const error = new Error("Error! Jotain meni vikaan.", err);
    return next(error);
  }


  if (!existingUser || !passwordMatch) {
    const error = Error("Väärä tunnus tai salasana");
    return next(error);
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { id: existingUser.id, tunnus: existingUser.tunnus },
      "secretkeyappearshere",    //dotenv! -> tätä hyvä käyttää!! 
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
 
  res.status(200).json({
      success: true,
      data: {
        id: existingUser.id,
        tunnus: existingUser.tunnus,
        token: token,
      },
    });

}

const rekisteröi = async (req, res, next) =>{
  const { tunnus, salasana, tentti_id, onko_admin } = req.params;
  let result; 
  try {

    let hashed = await bcrypt.hash(salasana, saltRounds)
    result = await pool.query("INSERT INTO kayttaja (tunnus, salasana, tentti_id, onko_admin) VALUES ($1,$2,$3,$4) RETURNING id",
    [tunnus, hashed, tentti_id, onko_admin])

  } catch (err){
    
    //const error = new Error("Error! Something went wrong.");
    return next(err);
  }
  let token;
  try {
    token = jwt.sign(
      { id: result.rows[0].id, tunnus: tunnus },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(201).json({
      success: true,
      data: { id: result.rows[0].id,
        tunnus: tunnus, token: token },
    });
} 

module.exports={
  kirjaudu,
  rekisteröi 
}