/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models/book.js');
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

const CONNECTION_STRING = process.env.MONGO_URI;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, result) => {
        if (err) return console.log(err);
        return res.send(result.map(x =>({_id: x._id, title: x.title, commentcount: x.comments.length})));
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!title) return res.send('title is required');
      var book = Book({title:title, comments: []});
      book.save((err, doc) => {
        if (err) return console.log(err)
        return res.json(doc)
      })

      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
       Book.remove({}, (err) => {
        if (err) return console.log(err)
        return res.send({msg: 'complete delete successful'})
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
         return res.send('id not valid')
      }
      Book.findById(bookid, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
        return res.json(book)
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      if (!ObjectId.isValid(bookid)) {
         return res.send('id not valid')
      }
      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
        return res.send(book)
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
         return res.send('id not valid')
      }
      Book.findByIdAndRemove(bookid, (err, book) => {
        if (err) return console.error(err)
        if (!book) return res.send('no book exists')
        return res.send('delete successful')
      })
      //if successful response will be 'delete successful'
    });
  
};
