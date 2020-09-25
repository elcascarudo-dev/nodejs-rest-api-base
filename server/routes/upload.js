const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {  
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se cargo ningun archivo'
      }
    });
  }


  // Obtengo el archivo enviado
  let archivo = req.files.archivo;
  // Lo convierto en un array para conseguir la extención
  let arrayArchivo = archivo.name.split( '.' );
  // Obtengo la extención del archivo que se subio
  let extencion = arrayArchivo[ arrayArchivo.length - 1 ].toLocaleLowerCase();


  // Si no es JPG o JPEG o PNG no la subo
  let extencionesValidas = [ 'jpg', 'jpeg', 'png' ];
  if( extencionesValidas.indexOf( extencion ) === -1 ){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No es un archivo permitido'
      }
    });
  }


  // Creo un nuevo nombre para el archivo que se resibe para que sea unico
  let nombreArchivo = arrayArchivo['0'] + '_' + new Date().getMilliseconds() + '.' + extencion;


  archivo.mv(`upload/${ nombreArchivo }`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });

    res.json({
      ok:true,
      message: 'Imagensubida correctamente'
    });

  });

});


module.exports = app;