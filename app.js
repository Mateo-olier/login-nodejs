const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const cokieParser = require('cookie-parser')

dotenv.config({ path: './env' })

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
});
//URL Encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cokieParser())


db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("DB Conection")
    }
})
app.get('/', (req, res) => {
    res.send("Welcome")
});


app.use('/api/usuario', require('./routes/authRoutes'))

app.listen(3000, () => {
    console.log('Server');
});

/* var bcrypt = require('bcrypt');

let password1 = "12345";


var hashPassword = async function() {
    console.log(bcrypt.hash(password1, 10));
    var hashPwd = await bcrypt.hash(password1, 10);
    console.log(hashPwd);
}
hashPassword(); */