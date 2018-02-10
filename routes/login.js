
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED

var app = express();

var Usuario = require('../models/usuario');

var GoogleAuth = require('google-auth-library');
// var auth = new GoogleAuth;

// var auth = new GoogleAuth.OAuth2Client(
//     config.GOOGLE_CLIENT_ID,
//     config.GOOGLE_SECRET,
//     ""
//     );

var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID
var GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET

//Autenticacion GOOGLE

app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX'
    var client = new GoogleAuth.OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID },
        function (err, login) {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    mesaje: 'Token no valido',
                    errors: err
                })
            }

            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            res.status(200).json({
                ok: true,
                payload
            })

        }
    );

})

//Autenticacion Normal

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        //Crear Token
        usuarioDB.password = ':)'
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        })
    })


})


module.exports = app;