const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require ('../models/producto');

const fs = require('fs');
const path =  require ('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({

            ok: false,
            err:{
                message: 'Las tipos válidos son ' + tiposValidos.join(', ')
            }
        }
        );
    }


    let archivo = req.files.archivo;

    let extensionesValidas = ['png','jpg','gif','jpeg'];

    let nombreArchivo = archivo.name.split('.');

    let extension = nombreArchivo[1];

    if (extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({

            ok: false,
            err:{
                message: 'Las extensiones válidas son ' + extensionesValidas.join(', ')
            }
        }
        );
    }

    //cambiamos el nombre del archivo
    let nuevoNombre = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        tipo == 'usuarios' ? imagenUsuario(id, res, nuevoNombre) :imagenProducto(id, res, nuevoNombre);
        

       
    });
});


function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB)=> {

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            res.status(400).json({
                ok: false,
                err:{
                    message: 'El usuario no existe',
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado)=> {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });
        

    });

}


function imagenProducto(id, res, nombreArchivo){


    Producto.findById(id, (err, productoDB)=> {

        if(err){
            borraArchivo(nombreArchivo, 'productos');
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            res.status(400).json({
                ok: false,
                err:{
                    message: 'El producto no existe',
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');
        

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado)=> {

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });

        });
        

    });

}

function borraArchivo(nombreImagen, tipo){

    
    let pathImagen =  path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync (pathImagen)){            
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;