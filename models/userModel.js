
const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({

    name:{
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    username: {
        type: String,
        minlength: 3,
        required: true
    }, 
    password: {
        type: String,
        minlength: 10,
        max: 100,
        required: true
    }
})

module.exports = mongoose.model('users', userSchema)