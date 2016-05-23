var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/index');
}

module.exports = function(passport){

	router.get('/',function (req, res) {
		res.render('index_home.html');
	})

	/* GET login page. */
	router.get('/index', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index.html');
	});


	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		//console
		//res.send(req.user)
		res.render('home.html');
	});

	router.get('/layout',function (req, res) {
		res.render('layout.html');
	})
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/index');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/dash',
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/index'
		})
	);


	return router;
}





