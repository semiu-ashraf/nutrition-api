const jwt = require("jsonwebtoken");
const fs = require("fs");

let secretKey = fs.readFileSync("./secret.txt","utf-8")

function verifyToken(req,res,next)
{

   let token = req.headers.authorization.split(" ")[1];

   jwt.verify(token,secretKey,(err,success)=>{
      if(!err)
      {
         next();
      }
      else
      {
         res.status(500).send({message:"Token is not useable"})

      }
   })
}

module.exports = verifyToken;
