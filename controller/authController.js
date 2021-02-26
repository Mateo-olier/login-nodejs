const mysql = require('mysql');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api2'
});

exports.register = (req, res) => {

    const { nombre, email, password } = req.body;
    db.query('SELECT email FROM usuario WHERE email = ?', [email], async(error, result) => {
        if (error) {
            console.log(error)
        }
        if (result.length > 0) {
            console.log('correo existe')
        }
        let hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        db.query('INSERT INTO usuario SET ?', { nombre: nombre, email: email, password: hashedPassword }, (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log(result)
                res.json("registrado")
            } else {
                res.json("Ya existe")
            }
        })
    });



}
exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Agrega eso bien perro"
            })
        }
        db.query('SELECT * FROM usuario WHERE email = ?', [email], async(error, result) => {
            console.log(result)
            if (error) {
                res.json(error)
            }
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                res.status(401).json({
                    message: "email o password incorrecto"
                })
            } else {
                res.json("correcto cachon")
                const email1 = result[0].email1;
                const token = jwt.sign({ correo1 }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("Token is: " + token);
                const cokiee = {
                    expires: new Date(
                        Date.now + process.env.JWT_COKIEE_EXPIRES * 24 * 60 * 60 * 100
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cokiee);
                res.status(200).redirect('')
            }

        })
    } catch (error) {
        console.log(error)
    }
}