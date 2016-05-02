'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    player1Tags: {
        type: Array,
        default: []
    },
    player1URL: {
        type: Array,
        default: []
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    player2Tags: {
        type: Array,
        default: []
    },
    player2URL: {
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
    },
    isPlayer1Turn: {
        type: Boolean,
        default: true
    },
    hasPlayer1Gone: {
        type: Boolean,
        default: false
    },
    hasPlayer2Gone: {
        type: Boolean,
        default: false
    },
    submissions: {
        type: Number,
        default: 0
    }

});

schema.virtual('numTurns').get(function() {
    return this.turns.length;
});

schema.virtual('numPlayers').get(function() {
    if (this.player1 !== null && this.player2 !== null) {
        return 2;
    } else if (this.player1 !== null || this.player2 !== null) {
        return 1;
    }
    return 0;

});

schema.methods.calcMatch = function() {
    // let a = new Set([1,2,3]);
    // let b = new Set([4,3,2]);
    // let union = new Set([...a, ...b]);

    let player1Set = new Set(this.player1Tags[this.player1Tags.length - 1]);

    let player2Set = new Set(this.player2Tags[this.player2Tags.length - 1]);

    let union = new Set([...player1Set, ...player2Set]);
    let intersection = new Set([...player1Set].filter(elem => player2Set.has(elem)));

    return Math.trunc((intersection.size / union.size) * 100);
}
mongoose.model('Game', schema);
// module.exports = schema;
