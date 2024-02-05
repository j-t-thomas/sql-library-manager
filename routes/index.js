var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Book = require('../models').Book;


/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/books');
  //res.render('index', { title: 'Express' });
});

module.exports = router;
