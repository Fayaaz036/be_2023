// Require external data/functions
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//Album en user model met hashpassword in db
const  Users = require('./models/models')
const saltRounds = 5;

// Defining express as app
const app = express()

// Compress all HTTP responses


// check if user is authorized (logged in) to visit a page

// env variables
const userName = process.env.USERNAME
const passWord = process.env.PASSWORD
const port = process.env.PORT

// Mongodb url
const url = `mongodb+srv://${userName}:${passWord}@bloktech.6qhartg.mongodb.net/?retryWrites=true&w=majority`

// Making connection with Mongodb
mongoose.set('strictQuery', false)
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(e => {
		console.log('error', e)
	})


// Set the view engine to ejs
app.set('view engine', 'ejs')

// app .use
app.use(express.static(__dirname + '/public'))
	.use(expressLayouts)
	.use(
		bodyParser.urlencoded({
			extended: true,
		})
	)

// All Get requests
app.get('/', (req, res) => {
	res.render('logIn', {
		errorMessage: '',
		errorClass: '',
		emailInput: '',
		passwordInput: '',
	})
})
	.get('/register', async (req, res) => {
		res.render('register', {
			errorMessage: '',
			errorClass: '',
		})
	})
	.get('/registerSucces', async (req, res) => {
		res.render(
			'registerSucces')
	})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

const errorlogin = req => {
	return {
		errorMessage: 'Email or password incorrect',
		errorClass: 'errorlogin',
		emailInput: req.body.email,
		passwordInput: req.body.password,
	}
}

// All Post requests
app.post('/home', async (req, res) => {
	// check if email exist in database
	const checkUser = await Users.find({ Email: req.body.email })
	// if user with this email exist check if given password is correct
	if (checkUser.length !== 0) {
		const dbpw = checkUser[0]['Password']
		const cmp = await bcrypt.compare(req.body.password, dbpw)
		// when password is identical with the one in the database, create a session with user ID
		if (cmp) {
			res.render('preference')
		} else {
			// show error message when password is wrong
			res.render('login', errorlogin(req))
		}
	} else {
		// show error message when email is wrong
		res.render('login', errorlogin(req))
	}
})
	.post('/logout', (req, res) => {
		// display success message in log in page
		res.render('login', {
			errorMessage: 'You are logged out',
			errorClass: 'successLogout',
			emailInput: '',
			passwordInput: '',
		})
	})
	.post('/register', async (req, res) => {
		// const checkUser = await Users.find({ Email: req.body.email })
		// const uname = checkUser['Username']
		Users.findOne({ Email: req.body.email }, async (err, result) => {
			if (err) throw err
			if (result) {
				// doe hier iets om te melden dat het e-mailadres al in gebruik is
				res.render('register', {
					errorMessage: 'Email allready exist',
					errorClass: 'errorlogin',
				})
			} else {
				// als de email niet in gebruik is, voor onderstaande commando uit
				const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
				Users.insertMany([
					{
						Username: req.body.username,
						Password: hashedPwd,
						Email: req.body.email,
					},
				]).then(() => console.log('user saved'))
				res.redirect('registerSucces')
			}
		})
	})

// Making sure the application is running on the port I defined in the env file
app.listen(port, () => {
	console.log(`server running on ${port}`)
})
