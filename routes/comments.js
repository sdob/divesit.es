var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var HTTP = require('http-status-codes');

var Divesite = require('../models/Divesite');
var User = require('../models/User');
var Comment = require('../models/Comment');
var validation = require('../middleware/validation');

var auth;
if (process.env.NODE_ENV == 'test') {
  auth = require('../middleware/test-auth');
} else {
  auth = require('../middleware/auth');
}

/* GET all comments */
router.get('/', function (req, response, next) {
  // Currently not allowed; we may want to allow a feed for recent comments
  // but we can implement that when we feel like it
  return response.status(HTTP.NOT_FOUND).json({});
});


/* GET an individual comment by ID */
router.get('/:id', validation.hasValidIdOr404, function (req, response, next) {
  Comment.findOne({_id: req.params.id}, function (err, comment) {
    if (err) {return next(err); }
    if (!comment) {
      return response.status(HTTP.NOT_FOUND).json({});
    }
    return response.json(comment);
  });
})


/* POST a new comment to no divesite */
router.post('/', function (req, response, next) {
  response.status(HTTP.METHOD_NOT_ALLOWED).json({});
});


/* DELETE a comment */
router.delete('/:id', auth.ensureAuthenticated, validation.hasValidIdOr404, function (req, response, next) {
  Comment.findOne({_id: req.params.id}, function (err, comment) {
    if (err) return done(err);
    if (!comment) return response.status(HTTP.NOT_FOUND).json({});
    if (req.user != comment.user._id) return response.status(HTTP.FORBIDDEN).json({});
    Comment.remove({_id: req.params.id}, function (err, comment) {
      response.status(HTTP.NO_CONTENT).json({});
    });
  });
});


/* PATCH an existing comment */
router.patch('/:id', auth.ensureAuthenticated, validation.hasValidIdOr404, function (req, response, next) {
  Comment.findOne({_id: req.params.id}, function (err, comment) {
    if (err) {return next(err);}
    // Return a 404 if we can't retrieve the comment
    if (!comment) {
      return response.status(HTTP.NOT_FOUND).json({});
    }
    // Users can only edit their own comments
    if (req.user != comment.user._id) {
      return response.status(HTTP.FORBIDDEN).json({});
    } 
    // The only changes allowed are to the comment text
    comment.text = req.body.text;
    comment.updated_at = Date.now();
    comment.save(function (err) {
      if (err) {
        return next(err);
      }
      return response.status(HTTP.OK).json(comment);
    });
  });
});

module.exports = router;
