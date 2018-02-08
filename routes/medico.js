
var express = require('express');
var bcrypt = require('bcryptjs');


var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// =====================================================
// Listar usuarios
// =====================================================

app.get('/', (req, res, next) => {
    Medico.find({})
        .exec(
        (err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando medicos',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                medicos
            })
        })
})






// =====================================================
// Actualizar usuario
// =====================================================


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: 'El medico con el id' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            })
        }

        medico.nombre = body.nombre
        medico.usuario = req.usuario._id
        medico.hospital = req.usuario._id

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar medico',
                    errors: err
                })
            }

            medicoGuardado.password = ':)'

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })
        })
    })
})

// =====================================================
// Crear un nuevo usuario
// =====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: ''
    })

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.medico
        })

    })

})

// =====================================================
// Borrar usuario
// =====================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            })
        }


        res.status(201).json({
            ok: true,
            medico: medicoBorrado
        })
    })
})
module.exports = app;