const express = require('express');

let {verificaToken} = require ('../middlewares/autenticacion');

let app = express();

let Producto = require ( '../models/producto');


app.get('/producto', verificaToken, (req, res)=> {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true})
     .skip(desde)
     .limit(5)
     .populate('usuario', 'nombre email')
     .populate('categoria' ,'descripcion')
     .exec( (err, productos)=> {
         if(err){
             return res.status(500).json({
                ok: false,
                err
             });
         }
         
         res.json({
             ok: true,
             productos
         })

     });
    


});


app.get('/producto/:id', verificaToken, (req, res)=> {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err){
                return res.status(500).json({
                ok: false,
                err
                });        
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'El id de producto no existe'
                    }
                    });        
            }

            res.json({
                ok: true,
                productoDB
            })

        });
    

});

app.get('/producto/buscar/:query',verificaToken, (req,res)=> {

    let query = req.params.query;

    let regEx = new RegExp(query, 'i');


    Producto.find({nombre: regEx})
    .exec((err, productos) => {
        if(err){
            return res.status(500).json({
            ok: false,
            err
            });        
        }

        res.json({
            ok: true,
            productos
        })

    });

});

app.post('/producto/', verificaToken, (req, res)=> {

    let body = req.body;

    let producto = new Producto({        
        nombre : body.nombre,
        precioUni: body.precioUni,        
        descripcion : body.descripcion,
        categoria: body.categoria,
        usuario : req.usuario._id,
    });

    

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
      

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});


app.put('/producto/:id', (req, res)=> {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if( err){
           res.status(500).json({
            ok: false,
            err
           });
        }

        if (!productoDB){
            res.status(400).json({
                ok: false,
                err:{
                    message: 'El producto no existe'
                }
               });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;


        productoDB.save((err, productoDB) => {

            if( err){
                res.status(500).json({
                 ok: false,
                 err
                });
             }
             
             res.status(201).json({
                 ok: true,
                producto: productoDB
             });

        });

    });

});


app.delete('/producto/:id', (req, res)=> {

    let id = req.params.id;
   

    Producto.findById(id, (err, productoDB) => {

        if( err){
           res.status(500).json({
            ok: false,
            err
           });
        }

        if (!productoDB){
            res.status(400).json({
                ok: false,
                err:{
                    message: 'El producto no existe'
                }
               });
        }

        productoDB.disponible = false;



        productoDB.save((err, productoDB) => {

            if( err){
                res.status(500).json({
                 ok: false,
                 err
                });
             }
             
             res.status(201).json({
                 ok: true,
                producto: productoDB
             });

        });

    });

});


module.exports = app;

