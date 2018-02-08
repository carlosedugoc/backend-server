
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res)=>{
    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        //Crear Token
        usuarioDB.password = ':)'
        var token = jwt.sign({usuario:usuarioDB},'@este-es@-un-seed-dificil',{expiresIn:14400}) //4 horas


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        })
    })

    
})


module.exports = app;