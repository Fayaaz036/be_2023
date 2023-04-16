// Require external data/functions
const express = require('express')
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const compression = require('compression')
const psnApi = require("psn-api")
const request = require('request');
const axios = require('axios');
const { getVideoGamesNews } = require('./public/js/api');

//Album en user model met hashpassword in db
const { Games, Users } = require('./models/models')
const {response} = require("express");
const saltRounds = 10


// Defining express as app
const app = express()

// Compress all HTTP responses
app.use(compression())

// creating a session
app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
)

// check if user is authorized (logged in) to visit a page
const authorizeUser = (req, res, next) => {
	if (!req.session.user) {
		res.status(401).render('401')
	} else {
		next()
	}
}

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

// Defing the storage object for Multer
const storage = multer.diskStorage({
	// Giving a destination to the uploaded images
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	// Giving a file name to the uploaded images
	// Added the current date to make sure their will be no duplicate images name
	filename: (req, file, cb) => {
		console.log('file', file)
		cb(null, Date.now() + '-' + file.originalname)
	},
})

const upload = multer({ storage: storage })

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
	res.render('login', {
		errorMessage: '',
		errorClass: '',
		emailInput: '',
		passwordInput: '',
	})

})
	.get('/results', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteGameTitles = currentUser[0].Played.map(item => item.Title)
		const fetchGames = await Games.find({})
		res.render('results', {
			data: fetchGames,
			user: favoriteGameTitles,
			userinfo: currentUser,
		})
	})
	.get('/all:id', authorizeUser, async (req, res) => {
		const fetchOneGame = await Games.find({ _id: req.params.id })
		res.render('detailPageAll', { data: fetchOneGame })
	})

	.get('/add', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		res.render('add', { userinfo: currentUser })
	})
	.get('/all', authorizeUser, async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteGameTitles = currentUser[0].Played.map(item => item.Title)
		const fetchGames = await Games.find({}).sort({ _id: -1 })
		res.render('all', { userinfo: currentUser, data: fetchGames, user: favoriteGameTitles  })
	})
	.get('/register', async (req, res) => {
		res.render('register', {
			errorMessage: '',
			errorClass: '',
		})
	})
	.get('/registerSucces', async (req, res) => {
		res.render('registerSucces')
	})
	.get('/home', async (req, res) => {
		try {
			const currentUser = await Users.find({ _id: req.session.user.userID })
			const newsArticles = await getVideoGamesNews();
			console.log(newsArticles);
			res.render('home', {  articles: newsArticles, userinfo: currentUser })
		} catch (error) {
			console.error(error);
			res.status(500).send('Oops! Something went wrong.');
		}
	})
	.get('*', (req, res) => {
		res.status(404).render('404')
	})

const errorlogin = req => {
	return {
		errorMessage: 'Email or password incorrect',
		errorClass: 'errorLogin',
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
			req.session.user = { userID: checkUser[0]['_id'] }
			const currentUser = await Users.find({ _id: req.session.user.userID })

			res.render('home', { userinfo: currentUser,  articles: response.data });
			///haal nieuws op via de api

			axios.request(getVideoGamesNews).then(function (response) {
				// console.log(response.data);
			}).catch(function (error) {
				console.error(error);
			});

		} else {
			// show error message when password is wrong
			res.render('logIn', errorlogin(req))
		}
	} else {
		// show error message when email is wrong
		res.render('logIn', errorlogin(req))
	}
})
	.post('/logout', (req, res) => {
		// when user logs out destroy the session
		req.session.destroy()
		// display success message in log in page
		res.render('login', {
			errorMessage: 'You are logged out',
			errorClass: 'successLogout',
			emailInput: '',
			passwordInput: '',
		})
	})
	.post('/results', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteGameTitles = currentUser[0].Played.map(item => item.Title)

		const fetchAlbums = await Games.find({ Year: req.body.year, Genre: req.body.genre })
		res.render('results', {
			data: fetchAlbums,
			user: favoriteGameTitles,
			userinfo: currentUser,
		})
	})
	.post('/add', upload.single('File'), async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })

		Games.insertMany([
			{
				Title: req.body.Title,
				Genre: req.body.Genre,
				Played: true,
				Description: req.body.Description,
				Image: { data: req.file.filename, contentType: 'image/png' },
			},
		]).then(() => console.log('game saved'))

		res.render('succesAdd', { userinfo: currentUser })
	})
	.post('/all', async (req, res) => {
		const currentUser = await Users.find({ _id: req.session.user.userID })
		const favoriteGameTitles = currentUser[0].Played.map(item => item.Title)

		const fetchAlbums = await Games.find({
			$or: [
				{ Title: req.body.search },
				{ Year: req.body.search },
				{ Genre: req.body.search },
			],
		})
		res.render('all', { data: fetchAlbums, user: favoriteGameTitles, userinfo: currentUser })
	})

	.post('/register', upload.single('Profilepic'), async (req, res) => {
		Users.findOne({ Email: req.body.email }, async (err, result) => {
			if (err) throw err
			if (result) {
				// doe hier iets om te melden dat het e-mailadres al in gebruik is
				res.render('register', {
					errorMessage: 'Email allready exist',
					errorClass: 'errorLogin',
				})
			} else {
				// als de email niet in gebruik is, voor onderstaande commando uit
				const hashedPwd = await bcrypt.hash(req.body.password, saltRounds)
				Users.insertMany([
					{
						Username: req.body.username,
						Password: hashedPwd,
						Email: req.body.email,
						Profilepic: { data: req.file.filename, contentType: 'image/png' },
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


// const options = {
// 	method: 'GET',
// 	url: 'https://videogames-news2.p.rapidapi.com/videogames_news/search_news',
// 	qs: {query: 'GTA'},
// 	headers: {
// 		'X-RapidAPI-Key': '92c911c05fmshf12c9b883dc8b01p195452jsna31390874f81',
// 		'X-RapidAPI-Host': 'videogames-news2.p.rapidapi.com',
// 		useQueryString: true
// 	}
// };
//
// request(options, function (error, response, body) {
// 	if (error) throw new Error(error);
//
// 	console.log(body);
// });

