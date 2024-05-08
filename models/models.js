const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
	Title: String,
	Genre: String,
	Image: {
		data: String,
		contentType: String,
	},
	Description: String,
	Played: Boolean,
})

const userSchema = new mongoose.Schema({
	Email: String,
	Played: Array,
	Password: String,
	Profilepic: {
		data: String,
		contentType: String,
	},
	Username: String,
})

const Games = mongoose.model('Games', gameSchema, 'Games')
const Users = mongoose.model('Users', userSchema, 'Users')
module.exports = { Users, Games }
