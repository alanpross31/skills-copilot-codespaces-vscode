// Create web server
// http://localhost:3000/api/comments
// http://localhost:3000/api/comments/1

// Import modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./model/comments');

// Create instance of express
var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/comments');

// Configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 3000;

// Set router
var router = express.Router();

// Middleware
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// Route: /comments
router.route('/comments')
    .post(function(req, res) {
        var comment = new Comment();
        comment.author = req.body.author;
        comment.text = req.body.text;

        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment created!'});
        });
    })
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

// Route: /comments/:comment_id
router.route('/comments/:comment_id')
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.author = req.body.author;
            comment.text = req.body.text;

            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Comment updated!'});
            });
        });
    })
    .delete(function(req, res) {
        Comment.remove({
            _id: req.params.comment_id
        }, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Successfully deleted'});
        });
    });

// Register router
app.use('/api', router);

// Start server
app.listen(port);
console.log('

