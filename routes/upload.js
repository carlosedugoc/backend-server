var express = require('express');

var fileUpload = require('express-fileupload')

var app = express();

app.use(fileUpload())


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo
    var id = req.params.id

    //tipos de colección
    var tiposValidos = ['hospitales', 'usuarios', 'medicos']
    if(tiposValidos.indexOf(tipo)< 0){
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
    var extensionArchivo = nombreCortado[nombreCortado.length -1]

    //Solo estas extensiones aceptados
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if(extensionesValidas.indexOf(extensionArchivo)< 0){
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

    archivo.mv(path, err =>{
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                message: 'Error al mover el archivo',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            message: 'Archivo movido',
            extensionArchivo: extensionArchivo
        })


    })

  
})

module.exports = app;