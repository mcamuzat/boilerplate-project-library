
const mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
})

module.exports = mongoose.model('book', bookSchema)