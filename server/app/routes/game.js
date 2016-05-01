'use strict';

function pp(json) {
    return JSON.stringify(json, null, 2);
}

const Auth = require('../../utils/auth.middleware');
const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');
const request = require('request-promise');
module.exports = router;


// router.param('orderId', function(req, res, next, orderId) {
//   Order.findById(orderId)
//   .populate('user')
//   .then(order => {
//     req.requestedUser = order.user;
//     next();
//   })
//   .catch(next);
// });

// Saves the document associated with the requested user to the req object.
// This enables the Auth middleware to work.
// router.use(function(req, res, next) {
//     if(req.query.userId){
//         User.findById(req.query.userId)
//         .then(function(user) {
//             if (!user) {
//               let err = new Error('User not found');
//               err.status = 404;
//               throw err;
//             }
//             req.requestedUser = user;
//             next();
//         })
//         .catch(next);
//     } else next();
// });



var token = {Authorization: 'Bearer 8lRommUKT8s7NBDfylzR5PHestdCnG'};
var currentGame;

function makeOptions(url) {
    return {
        method: 'POST',
        body: JSON.stringify({
            url: url
        }),
        headers: {
            Authorization: 'Bearer 8lRommUKT8s7NBDfylzR5PHestdCnG',
           'Content-type': 'application/json',
        }
    };
}
function makeTags(response) {
    return JSON.parse(response).results[0].result.tag.classes;
}
// Get all available games
router.get('/', function(req, res, next) {
    Game.find({isStarted: false})
    .then(games => res.json(games))
    .then(null, next);
});

// Get one game document
router.get('/:gameId', function(req, res, next) {
    Game.findById(req.params.gameId)
    .then(game => res.json(order))
    .then(null, next);
});

// Create a new game.
// The body must contain the id of the player who is creating the new game.
router.post('/', function(req, res, next) {
    Game.create({player1: req.body.player1})
    .then(function(game) {
        res.json(game);
    })
    .then(null,next);
});

//Make a move. The bearer token is used to send the game token
router.post('/:gameId', function(req, res, next) {
    var playerNum = 'player' + req.body.playerNum;
    var gameQuery = {};
    var gameDoc = '';
    gameQuery[playerNum] = req.body.playerId;
    Game.findOne(gameQuery)
    .then(function(game) {
        var options = makeOptions(req.body.url);
        gameDoc = game;
        return request("https://api.clarifai.com/v1/tag/",options)
    })
    .then(function(response) {
        var tags = makeTags(response);
        gameDoc.submissions++;
        gameDoc[playerNum + 'Tags'].push(tags);
        gameDoc[playerNum + 'URL'].push(req.body.url);

        playerNum === 'player1' ? gameDoc.isPlayer1Turn = false : gameDoc.isPlayer1Turn = true;
        if (gameDoc.submissions >= 2) {
            var calculation  = gameDoc.calcMatch();
            if (gameDoc.calcMatch() >= 0.60) {
                console.log('WON!!!', calculation);
                gameDoc.isWon = true;
            }
            gameDoc.submissions = 0;
        }
        return gameDoc.save();
    })
    .then(function() {
        res.send(gameDoc);
    })
    .catch(error => res.json(error));
});

//player joins game, sends player id in request body
router.put('/:gameId', function(req, res, next) {
    Game.findById(req.params.gameId)
    .then(function(game) {

        game.player2 = req.body.player2;

        return game.save();
    })
    .then(function(game) {
        res.json(game);
    })
    .then(null, next);
});

//valid user id   "_id": "5723bbe74bc71c921dfc522a"
//valid game id "5723bdf7b9dbd20a1fad63c9"
