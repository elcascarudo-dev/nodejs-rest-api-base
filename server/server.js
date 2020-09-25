/******************************************************************
 * Configuración Global
 */
require( './config/config' );

/******************************************************************
 * Paquetes
 */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 
const app = express();
 
// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );
 
// parse application/json
app.use( bodyParser.json() );

/******************************************************************
 * rutas
 */
app.use( require( './routes/index' ) );


/******************************************************************
 * Conexión a BBDD Mongo
 */

const mongoVar = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false};
mongoose.connect(
  'mongodb://localhost:27017/test', 
  mongoVar, 
  ( err, resp ) => {

    if ( err ) throw err;

    console.log( 'BBDD OnLine');

});

/******************************************************************
 * Porto por el cual expone el rest-server
 */

app.listen( process.env.PORT, () => {
  console.log( 'Escuchando en el puerto: ', process.env.PORT );
});