const express = require('express'); 
const app = express();
const bcrypt = require('bcrypt');
const _ = require( 'underscore' );

const Usuario = require( '../models/usuario' );

const { verificaToken } = require('../middlewares/autenticacion');


app.get( '/usuario', verificaToken, ( req, res ) => {

  let desde = Number( req.query.desde ) || 0;

  Usuario.find({})
         .skip( desde )       // Salto los primero 5 registros
         .limit( 5 )          // solo veo 5 registros
         .exec( ( err, usuarios ) => {
            if( err ){
              return res.status( 400 ).json({
                ok: false,
                err
              });
            }

            Usuario.count( {}, ( err, cantidad ) => {
              
                  res.json({
                    ok: true,
                    cantidad,
                    usuarios
                  });

            });
         });

});

app.post( '/usuario', verificaToken, ( req, res ) => {

  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10 ),
    role: body.role
  });

  // Guardo los datos en la BBDD
  usuario.save( ( err, usuarioBD ) => {

    if( err ){
      return res.status( 400 ).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuarioBD
    });

  });

});

app.put( '/usuario/:id', ( req, res ) => {

  let id    = req.params.id;
  let body  = _.pick( req.body, [ 'nombre', 'email', 'img', 'role', 'estado' ]);
  
  // Busco el usuario por ID y si lo encuentro lo actualizo
  Usuario.findByIdAndUpdate( id, body, { new: true }, ( err, usuarioBD ) => {

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuarioBD
    });

  })

  
});


app.delete( '/usuario/:id', ( req, res ) => {

  let id = req.params.id;

  //Borra al usuario fisicamente
  //Usuario.findByIdAndRemove( id, ( err, ussEliminado ) => {

  Usuario.findByIdAndUpdate( id, { estado: false }, { new: true }, ( err, ussEliminado ) => {

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      ussEliminado
    });

  });
  
});



module.exports = app;