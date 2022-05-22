
const mongoose = require('mongoose')

let listItemSchema = new mongoose.Schema({

    item: {
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    quantity: {
        type: Number
    }, 
    unit: {
        type: String
    },
    owner: {
        type: String
    },
    addedOn: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('listItem', listItemSchema)