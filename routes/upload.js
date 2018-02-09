var express = require('express');

var fileUpload = require('express-fileupload')
var fs = require('fs')

var app = express();

var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')

app.use(fileUpload())


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo
    var id = req.params.id

    //tipos de colección
    var tiposValidos = ['hospitales', 'usuarios', 'medicos']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de colección no válido',
            errors: { message: 'Tipo de colección no válido' }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }


    //Obtener nombre del archivo

    var archivo = req.files.imagen
    var nombreCortado = archivo.name.split('.')
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    //Solo estas extensiones aceptados
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no valida',
            errors: { message: 'Extensión no valida' }
        })
    }

    //Nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover archivo

    var path = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(path, err => {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                message: 'Error al mover el archivo',
                errors: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res)




    })


})

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            if(!usuario){
                return res.status(400).json({
                    ok: true,
                    message: 'Usuario no existe',
                    errors: {message:'Usuario no existe'}
                })

            }
            var pathViejo = './uploads/usuarios/' + usuario.img
            //Si existe lo elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            usuario.img = nombreArchivo

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)'

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })

            })
        })

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if(!medico){
                return res.status(400).json({
                    ok: true,
                    message: 'Medico no existe',
                    errors: {message:'medico no existe'}
                })

            }

            var pathViejo = './uploads/medicos/' + medico.img
            //Si existe lo elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            medico.img = nombreArchivo

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                })

            })
        })

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if(!hospital){
                return res.status(400).json({
                    ok: true,
                    message: 'Hospital no existe',
                    errors: {message:'Hospital no existe'}
                })

            }
            var pathViejo = './uploads/hospitales/' + hospital.img
            //Si existe lo elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            hospital.img = nombreArchivo

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado
                })

            })
        })

    }




}

module.exports = app;