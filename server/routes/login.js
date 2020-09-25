const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require( 'underscore' );

const app = express();

const Usuario = require( '../models/usuario' );


app.post( '/login', ( req, res ) => {


  let body = req.body;

  Usuario.findOne( { email: body.email }, ( err, usuarioDB ) => {

    if( err ){
      return res.status( 500 ).json({
        ok: false,
        err
      });
    }

    // Si no encuentra ningun usuario en la BBDD entra acá
    if ( !usuarioDB ) {
      return res.status( 400 ).json({
        ok: false,
        error: {
          message: '(Usuario) o Contraaseña incorrectos'
        }
      });
    }
    // Si la contraseña no es correcta entra acá
    if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
      return res.status( 400 ).json({
        ok: false,
        error: {
          message: 'Usuario o (Contraaseña) incorrectos'
        }
      });
    }

    //Devuelvo solo los campos que yo indico
    let ussPailot = _.pick( usuarioDB, [ '_id', 'role', 'nombre', 'email' ] );

    let token = jwt.sign(
      { usuario: ussPailot },
      process.env.SEED,
      { expiresIn: process.env.EXPIRA }
    );

    res.json({
      ok: true,
      usuario: ussPailot,
      token
    });
  })

});





module.exports = app;