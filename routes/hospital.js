
var express = require('express');
var bcrypt = require('bcryptjs');


var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Hospital = require('../models/hospital');

// =====================================================
// Listar usuarios
// =====================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0
    desde = Number(desde)

    Hospital.find({})
    .skip(desde)
    .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        (err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando hospitales',
                    errors: err
                })
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    total: conteo
                })
            })
        })
})






// =====================================================
// Actualizar usuario
// =====================================================


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el id' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            })
        }

        hospital.nombre = body.nombre
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                })
            }

            hospitalGuardado.password = ':)'

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            })
        })
    })
})

// =====================================================
// Crear un nuevo usuario
// =====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuariotoken: req.hospital
        })

    })

})

// =====================================================
// Borrar usuario
// =====================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            })
        }


        res.status(201).json({
            ok: true,
            hospital: hospitalBorrado
        })
    })
})
module.exports = app;