const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');

const users = require('./src/fake-db')

const jwt = require('jsonwebtoken');
let jwtSecret = 'supersecret123'

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

// Provide boostrap files
app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
// Provide resources files
app.use("/resources", express.static(path.join(__dirname, '/src/resources')));

// ----------
// View calls
// ----------

app.get('/', (req,res) => {
    res.sendFile('./src/views/index.html', {root : __dirname});
})

app.get('/dashboard', (req,res) => {
    if (!req.headers.cookie) {
        res.cookie("error", "Unauthorized access. JWT was not found.")
        return res.status(400).redirect("/")
    }
    const token = req.headers.cookie.split("=")[1]
    var decoded = jwt.verify(token, jwtSecret);
    // check if token is successfully decoded
    if (!decoded) {
        res.cookie("error", "Unauthorized access. Invalid JWT.")
        return res.redirect("/")
    }
    // check if user has permission
    if (!decoded.admin){
        res.cookie("error", "Unauthorized access. Admin access is required to access this page.")
        return res.redirect("/")
    }
    res.sendFile('./src/views/dashboard.html', {root : __dirname})
})

// ----------
// API  calls
// ----------

app.post('/api/login', (req, res) => {
    let user = null
    users.forEach(element => {
        if (element.email==req.body.email && element.password==req.body.password){
            user = element
        }
    });
    if (!user) {
        return res.status(400).json({message: "Incorrect username or password."})
    }
    const token = jwt.sign(user, jwtSecret);
    return res.status(200).json({message: "Login successful.", jwt: token})
})

app.post('/api/validade', (req, res) => {
    try{
        jwt.verify(req.body.jwt, jwtSecret);
        return res.status(200).json({message: "Valid JWT."})
    }catch(e){
        return res.status(400).json({message: "Invalid JWT."})
    }
    
})

app.post('/api/secret', (req, res) => {
    jwtSecret = req.body.secret
    return res.status(200).json({message: "JWT secret key was updated successfully."})
})

app.get('/api/secret', (req, res) => {
    return res.status(200).json({jwtSecret})
})

// ----------
//  Express
// ----------

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
