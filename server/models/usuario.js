const mongoose = require( 'mongoose' );
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE' ],
  message: '{VALUE} no es un role valido'
}


let usuarioSchema = new Schema({

  nombre: {
    type: String,
    required: [ true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [ true, 'El Email es necesario']
  },
  password: {
    type: String,
    required: [ true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }

});

// Quito el campo password del objeto JSON de se devuelve
usuarioSchema.methods.toJSON = function () {
  
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}


// Devuelve un error personalizado para la unicidad del usuario
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );


module.exports = mongoose.model( 'Usuario', usuarioSchema );