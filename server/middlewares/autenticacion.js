const jwt = require('jsonwebtoken');

let verificaToken = ( req, res, next ) => {

  let token = req.query.token;

  jwt.verify( token, process.env.SEED, ( err, decod ) => {

    if( err ){
      return res.status(401).json({
        ok: false,
        err
      });
    }


    req.usuario = decod;

    next();
  });
  
};


module.exports = {
  verificaToken
};