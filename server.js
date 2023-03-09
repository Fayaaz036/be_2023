

require('dotenv').config()

const express = require('express')
const app = express()

const port = 3000


app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    res.render('info.ejs', { username, password }); // toont de data op showData.ejs
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

