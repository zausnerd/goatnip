'use strict';

/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
// var Game = require('./server/db/models/game');
var Game = mongoose.model('Game');



var wipeUsers = function() {
    var removeUsers = User.remove({});
    return Promise.all([
        removeUsers
    ]);
};
var wipeGames = function() {
    var removeGame = Game.remove({});
    return Promise.all([
        removeGame
    ]);
};




var seedUsers = function() {

    var users = [{
        name: 'David Z',
        email: 'zausnerd@gmail.com',
        password: 'password',
        isAdmin: 'true'
    }];
    return User.create(users);
};



connectToDb
    .then(function() {
        return wipeUsers();
    })
    .then(function() {
        return wipeGames();
    })
    .then(function() {
        return seedUsers();
    })
    .then(function() {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function(err) {
        console.error(err);
        process.kill(1);
    });
