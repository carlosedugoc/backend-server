
var express = require('express');

var app = express();

var Hospital = require('../models/hospital')
var Medico = require('../models/medico')
var Usuario = require('../models/usuario')

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda
    var regexp = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(busqueda, regexp), 
        buscarMedicos(busqueda, regexp),
        buscarUsuarios(busqueda,regexp)]).
        then((respuestas)=>{
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })
    })

    buscarHospitales(busqueda, regexp).then((hospitales)=>{
   
    })
})

function buscarHospitales(busqueda, regexp){
    return new Promise((resolve, reject)=>{
        Hospital.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
            if (err){
                reject('Error al consultar los hospitales')
            }else{
                resolve(hospitales)
            }
        })
    })
}

function buscarMedicos(busqueda, regexp){
    return new Promise((resolve, reject)=>{
        Medico.find({ nombre: regexp })
            .populate('usuario', 'nombre mail')
            .populate('hospital ')
            .exec((err, medicos) => {
            if (err){
                reject('Error al consultar los medicos')
            }else{
                resolve(medicos)
            }
        })
    })
}

function buscarUsuarios(busqueda, regexp){
    return new Promise((resolve, reject)=>{
        Usuario.find({}, 'nombre email role')
            .or([{'nombre':regexp}, {'email':regexp}])
            .exec((err,usuarios)=>{
                if(err){
                    reject('Error al cargar los usuarios')
                }else{
                    resolve(usuarios)
                }
            })
    })
}

module.exports = app;