var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Book = require('../models').Book;


/* GET home page. */
router.get('/', async function(req, res, next) {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' });
  //res.render('index', { title: 'Express' });
});

// Render the 'new-book' view for creating a new book
router.get('/new', async function (req, res, next) {
  res.render('new-book');
});

// Create a new book, redirect to '/books/' on success, or re-render 'new-book' with errors on failure
router.post('/new', async function (req, res, next) {
  let book;
  try {
    // Attempt to create a new book with data from the request body
    book = await Book.create(req.body);
    res.redirect('/books/');
  } catch (error) {
    // If there are validation errors, re-render 'new-book' with the errors
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors });
    } else {
      throw error; // Propagate other errors
    }
  }
});

// Render the 'update-book' view for editing a specific book
router.get('/books/:id', async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book: book });
  } else {
    res.sendStatus(404); // Book not found
  }
});

// Update a specific book, redirect to '/books/' on success, or re-render 'update-book' with errors on failure
router.post('/books/:id', async function (req, res, next) {
  let book;
  try {
    // Find the book by its ID and update its data
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/');
    } else {
      res.sendStatus(404); // Book not found
    }
  } catch (error) {
    // If there are validation errors, re-render 'update-book' with the errors
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors });
    } else {
      throw error; // Propagate other errors
    }
  }
});

// Delete a specific book by its ID, redirect to '/books' on success, or send a 404 status if the book is not found
router.post('/:id/delete', async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404); // Book not found
  }
});

module.exports = router;