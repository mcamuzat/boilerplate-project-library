/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let Book = require('../models/book')
chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /**
   * Fixture
   */
  let idBookToDelete;
  before(function () {
      testBook = Book({title: 'deleteme', comments: ['liked a lot!']})
      testBook.save((err, doc) => {
        if (err) return console.error(err)
        idBookToDelete = doc._id
      })
  })
  /**
   * Clean the fixture
   */
  after((done) => {
    Book.remove({}, (err) => {
          done()
    })
  })

  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai.request(server)
          .post('/api/books')
          .send({title: 'test'})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            done()
          })

      });
      
      test('Test POST /api/books with no title given', function(done) {
         chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'title is required')
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
            assert.property(res.body[0], 'title', 'Books in array should contain title')
            assert.property(res.body[0], '_id', 'Books in array should contain _id')
            done()
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
          .get('/api/books/test')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'id not valid')
            done()
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + idBookToDelete)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            done()
          })
      })
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' +idBookToDelete)
          .send({comment: 'test comment'})
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            assert.equal(res.body.comments[res.body.comments.length - 1], 'test comment', 'added comment should be there')
            done()
          })
      });


  });

});
