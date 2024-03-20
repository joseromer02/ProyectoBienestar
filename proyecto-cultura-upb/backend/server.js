const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567",
    database: "signupp"
});

app.post('/signup' , (req, res) => {
    const { name, codigo, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const sql = "INSERT INTO login (`name`, `codigo`, `email`, `password`) VALUES ?";
        const values = [[name, codigo, email, hash]];
        db.query(sql, [values], (err, data) => {
            if(err){
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "User created successfully" });
        });
    });
});

app.post('/login' , (req, res) => {
    const { codigo, password } = req.body;
    const sql = "SELECT * FROM login WHERE `codigo` = ?";
    db.query(sql, [codigo], (err, data) => {
        if(err){
            return res.status(500).json({ error: err });
        }
        if(data.length === 0){
            return res.json("Fail");
        }
        const user = data[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (result) {
                return res.json("Success");
            } else {
                return res.json("Fail");
            }
        });
    });
});

app.listen(8081, ()=> {
    console.log("listening")
});




/*const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567",
    database: "signupp"
,})

app.post('/signup' , (req, res) => {
    const sql = "INSERT INTO login (`name`,`codigo` ,`email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.codigo,
        req.body.email,
        req.body.password
    ]

    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login' , (req, res) => {
    const sql = "SELECT * FROM login WHERE `codigo` =? AND `password` =?";
    db.query(sql, [req.body.codigo,req.body.password ], (err, data) => {
        if(err){
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("Success");
        } else {
            return res.json("Faile");
        }
    })
})

app.listen(8081, ()=> {
    console.log("listening")
})*/