'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
            required: true
    },
    player1Tags: {
        type: Array,
        default: []
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    player2Tags: {
        type: Array,
        default: []
    },
    salt: {
        type: String
    },
    google: {
        id: String
    },
    turns: {
        type: Array,
        default: []
    },
    timeStarted: {
        type: Date,
        default: Date.now
    },
    isWon: {
        type: Boolean,
        default: false
    },
    isStarted: {
        type: Boolean,
        default: false
    }

});

// schema.virtual('turns').get(function() {
//     return this.turns.length;
// });


mongoose.model('Game', schema);
// module.exports = schema;
