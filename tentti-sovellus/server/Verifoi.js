const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{
  
  const token = req.headers.authorization?.split(' ')[1]; 
  //Authorization: 'Bearer TOKEN'
  if(!token)
  {
      res.status(200).json({success:false, message: "Error!Token was not provided."});
  }
  //Decoding the token
  const decodedToken = jwt.verify(token,"secretkeyappearshere" );
  //console.log(decodedToken)
  req.decoded = decodedToken
  console.log("saasdsfs", req.decoded)
  next() 
} 

module.exports = {
  verifyToken
}