
var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

// =====================================================
// Listar usuarios
// =====================================================

app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            })
        })
})


// =====================================================
// Actualizar usuario
// =====================================================


app.put('/', (req, res)=>{
    var body = req.body;
})

// =====================================================
// Crear un nuevo usuario
// =====================================================

app.post('/', (req, res) => {
    var body = req.body;
    var params = params.id

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        })

    })

})

module.exports = app;