const MongoClient = require('mongodb').MongoClient
const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");
require('dotenv').config();

const DbUsername = process.env.DB_USERNAME;
const DbPassword = process.env.DB_PASSWORD;

const url = "mongodb+srv://" + (DbUsername) + ":" + (DbPassword) + "@credentials.6qhartg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const db = client.db("playstationapp");
const col = db.collection("users");







async function connect() {
    try {
        await client.connect(url);
        console.log("Connection made");
        const findResult = await col.find({}).toArray();
        console.log(findResult);

    } catch (err) {
        console.error(err);
    }
}



app.get('/', async (req, res) => {
    res.render('home.ejs')
});

app.get('/login', (req, res) => {
    res.render('login.ejs')
});


app.post('/login-validate',   (req, res) => {
    const formData = req.body;
    const username = req.body.username;
    const password = req.body.password;
    const collection = db.collection('users');

    // res.render('login-validate.ejs', formData, async (req, res) =>{
    //
    // collection.find({
    //     name: username ,
    //     pass: password
    // })
    // if( formData.password !== pass ) {
    //     console.log('niet ingelogd')
    // } else {
    //     res.redirect('login-sucess.ejs')
    // }



});



app.get('/register', async (req, res) => {
 res.render('register.ejs')
});

app.get('/login-sccess', async (req, res) => {
    res.render('login-sucess.ejs')
});

app.post('/info', async (req, res) => {

    //benodigde variabelen
    const formData = req.body;
    const username = req.body.username;
    const password = req.body.password;
    const game = req.body.game;
    const collection = db.collection('users');
    const collection2 = db.collection('games');

    res.render('info.ejs',  formData  )

        await collection.insertOne(
            {
                name: username,
                pass: password,
                game: game
            }
        )
            console.log('Account aangemaakt door', username );

    });





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

