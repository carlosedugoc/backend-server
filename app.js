'use strict'
//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



//Inicializar variables
var app = express();



//Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//importar rutas

var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var busquedaRoutes = require('./routes/busqueda')


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://admin:admin@ds125578.mlab.com:25578/hospitaldb',(err, res)=>{
    if(err) throw err

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
})


//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/', appRoutes);



//Excuchar peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})



