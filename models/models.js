const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	Email: String,
	Like: Array,
	Password: String,
	Username: String,
})

const Users = mongoose.model('users', userSchema, 'playstationapp')
module.exports =  Users;
