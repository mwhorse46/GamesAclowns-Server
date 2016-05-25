var express = require('express');
var router = express.Router();
var dir = require('node-dir');
var admin	=	require('../datalayer/admin')
var userManager	=	require('../datalayer/user');
var webshot = require('webshot');
var config	=	require('../utils/config');
var getConnection	=	require('../utils/mysql-connector')

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/index');
};

var isAdminAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	console.log("ISADMINAUTH")
	console.log(req.path)
	console.log(req.user)
	if(req.user != undefined && req.user.username && req.user.password) {
		console.log("CHECK")
		getConnection(function (err, connector) {
			if (err)
				res.redirect('/angryadmin');

			connector.query('select * from tbl_admin where username = ? and password = ?',
				[req.user.username, req.user.password],
				function (err, userInfo) {
					console.log(err)
					console.log(userInfo)
					if (err) {
						res.redirect('/angryadmin');
					}

					return next();
					//return done(null, userInfo[0]);

				});
		});
	}else{
		if(req.path == '/angryadmin')
			res.render('login');
		else
			res.redirect('/angryadmin')
	}
	// if (req.isAuthenticated())
	// 	return next();
	// // if the user is not authenticated then redirect him to the login page
	// res.redirect('/angryadmin');
};


module.exports = function(passport){




	/*
	 Image Upload API & Configuration
	 */
	var fs = require('fs');
	var passwordHash                    =   require('password-hash');
	var multer = require('multer');
	var imageHandler = require('gm').subClass({imageMagick: true});
	var done = false;
	var onLimit = false;
	var hashedImageName = "imageName";

	router.post('/imageUpload',  multer({
		limits: {
			fileSize: 20000000 //20MB
		},
		dest: './public/images/',
		// changeDest: function(dest, req, res) {
		//
		// 	var stat = null;
		// 	try {
		// 		stat = fs.statSync(newDestination);
		// 	} catch (err) {
		// 		fs.mkdirSync(newDestination);
		// 	}
		// 	if (stat && !stat.isDirectory()) {
		// 		throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
		// 	}
		// 	return newDestination
		// },
		rename: function (fieldname, filename) {
			hashedImageName = passwordHash.generate(filename + fieldname + Date.now());
			return hashedImageName;
		},
		onFileSizeLimit: function (file) {
			fs.unlink('./' + file.path);
			console.log('on file size limit exceed')
			onLimit = true;

		},
		onFileUploadData: function (file, data) {
			console.log(data.length + ' of ' + file.fieldname + ' arrived')
		},
		onParseStart: function () {
			console.log('Form parsing started at: ', new Date())
		},
		onParseEnd: function (req, next) {
			console.log('Form parsing completed at: ', new Date());
			next();
		},
		onPartsLimit: function () {
			console.log('Crossed parts limit!')
		},
		onError: function (error, next) {
			console.log("Error occurred while uploading the file!!");
			next(error);
		},
		onFileUploadStart: function (file, req, res) {
			if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && onLimit) {
				onLimit = false;
				res.send(false);
			} else {
				console.log(file.fieldname + ' is starting ...');
			}
		},
		onFileUploadComplete: function (file, req, res) {

			if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && onLimit) {

				onLimit = false;
				res.send(false);
			} else {

				hashedImageName =  file.name;

				done = true;

				imageHandler('./' + file.path)
					.resize(500, 500)
					.autoOrient()
					.write('./' + file.path, function (err) {

						if (!err) {
							res.send(hashedImageName)
						}
						else {
							//res.send(false)
							res.send(hashedImageName)
						}
					});
			}
		}
	}));


	router.get('/',function (req, res) {
		res.render('index_home');
	});

	router.get('/index', function(req, res) {
		res.render('index');
	});


	router.post('/insertimage',admin.addImage);

	router.get('/home', isAuthenticated, function(req, res){

		//res.render('home',req.user);
		//res.redirect();

		var user	=	req.user;
		var gender	=	req.user.gender;

		userManager.fetchImage(gender,function (imageData) {
			if(imageData != false) {

				var userchoice		=		{
					userid	:	user.userid,
					imageid	:	imageData.pk_imgid
				};
				userManager.addChoice(userchoice,function (err, choiceInfo) {

					console.log("CHOICESUPADTE")
					console.log(err)
					console.log(choiceInfo.pk_choiceid);

					if(choiceInfo.pk_choiceid != undefined) {


						var userinfo	=	{
							userid		:	user.userid,
							choiceid	:	choiceInfo.pk_choiceid
						};

						userManager.getchoice(userinfo,function (err, choicesInfo) {
							console.log(imageData)
							user.choosed = imageData;
							console.log(user)
							var path = require('path');
							var webshot = require('webshot');
							var option = {
								// windowSize: {
								// 		width: 1024,
								// 		height: 768
								// 		},
								shotSize: {
									width: 500
									, height: 300
								},
								siteType: 'html'
							};
							//var htmlForm = '<div style="background: chartreuse;width: 1000px; height: 500px;" class="container-fluid"> <div class="row"> <div class="col-md-6"><img width="200px" height="200px"  alt="Bootstrap Image Preview" src="' + user.image + '"/></div><div class="col-md-6"><img width="200px" height="200px" alt="character" src="http:localhost:8000/images/' + imageData.image + '"/></div></div></div>'
							var head = '<head><link href="/assets/css/bootstrap.css" rel="stylesheet"/><script type="text/javascript" src="/assets/js/jquery.min.js"></script><script type="text/javascript" src="/assets/js/bootstrap.min.js"></script></head>'
							console.log(htmlForm)
							var htmlForm	=	'<table style="height: 304px; border-color: #ffffff; background-color: #cccccc;" width="550"><tbody><tr><td><table style="height: 174px; border-color: #ffffff; margin-left: auto; margin-right: auto;" width="496"><tbody><tr><td><img src="'+user.image+'" alt="" width="120" height="120"/></td><td><img src="http:localhost:8000/images/' + imageData.image + '" alt="" width="120" height="120"/></td></tr></tbody></table></td></tr></tbody></table>'
							var url	=	config.runningHost + '/choosed/reaction/' + user.userid + '/' + choiceInfo.pk_choiceid;
							url		=	"<html><body>"+htmlForm+"</body></html>";

							webshot(url, user.userid + '_' + choiceInfo.pk_choiceid + ".png", option, function (err) {
								// screenshot now saved to hello_world.png
								console.log(err);

								//res.render('home',user);
								var oldPath = path.dirname(__dirname) + "/" + user.userid + '_' + choiceInfo.pk_choiceid + ".png";
								var newPath = path.dirname(__dirname) + "/public/images/user/" + user.userid + '_' + choiceInfo.pk_choiceid + ".png";

								fs.readFile(oldPath, function (err, data) {
									fs.writeFile(newPath, data, function (err) {
										fs.unlink(oldPath, function () {
											if (err) throw err;
											console.log("File uploaded to: " + newPath);
											console.log(choiceInfo)
											var charimage	=	choicesInfo.charimage;
											choicesInfo.charimage	=	config.runningHost+"/images/"+charimage;
											choicesInfo.redirect	=	config.runningHost + '/choosed/reaction/' + user.userid + '/' + choiceInfo.pk_choiceid;
											choicesInfo.og_image	=	config.runningHost+"/images/user/" + user.userid + '_' + choiceInfo.pk_choiceid + ".png";
											res.render('home', choicesInfo);
										});
									});
								});


							});

// 			console.log(path.dirname(__dirname)+"/public/images/user.png")
// 			var renderStream = webshot('<html><body>'+htmlForm+'</body></html>');
// 			var filepath = path.dirname(__dirname)+"/public/images/user/user.png";
// 			var file = fs.createWriteStream(filepath, {encoding: 'binary'});
// 			renderStream.on('data', function(data) {
// 				file.write(data.toString('binary'), 'binary');
// 			});
//
// res.render('home',user);
						});
					}

				});
			}else{
				res.redirect('/');
			}
		})
	});

	router.get('/choosed/reaction/:userid/:choiceid',function (req, res) {

		var userid		=	req.params.userid;
		var choiceid	=	req.params.choiceid;

		if(userid && choiceid){

			var userinfo	=	{
				userid		:	userid,
				choiceid	:	choiceid
			};
			userManager.getchoice(userinfo,function (err, choice) {
				if(choice != false){
					var charimage	=	choice.charimage;
					choice.charimage	=	config.runningHost+"/images/"+charimage;
					choice.og_image	=	config.runningHost+"/images/user/" + choice.userid + '_' + choice.pk_choiceid + ".png";
					console.log("GENEREATE")
					console.log(choice)
					res.render('test',choice);

				}else{
					//TODO:Handle default
					res.redirect('/')
				}
			})

		}else{
			res.redirect('/')
		}
	});

	router.get('/layout',function (req, res) {
		res.render('layout');
	});



	router.get('/dash',
		passport.authenticate('facebook', { scope : 'email' }
	));

	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/index'
		})
	);

	router.get('/angryadmin',isAdminAuthenticated,function (req, res) {

		if(req.user.username && req.user.password){
			res.redirect('/admin/uploader')
		}else
			res.render('login');
	});

	router.post('/login/admin',passport.authenticate('local', {
		successRedirect : '/admin/uploader', //TODO: Change this to webpage if admin is from Web.
		failureRedirect : '/angryadmin',   //TODO: Change this to webpage if admin is from Web.
		failureFlash : false                //TODO: Enable flash if admin is from Web.
	}));

	router.get('/admin/uploader',isAdminAuthenticated,function (req, res) {
		res.render('uploader');
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	router.get('/admin/signout',isAdminAuthenticated, function(req, res) {
		req.logout();
		res.redirect('/angryadmin');
	});


	function reverse_id(n){
		n = n + "";
		return n.split("").reverse().join("");
	}

	function walkSync(currentDirPath, callback) {
		var fs = require('fs'),
			path = require('path');
		fs.readdirSync(currentDirPath).forEach(function (name) {
			var filePath = path.join(currentDirPath, name);
			var stat = fs.statSync(filePath);
			if (stat.isFile()) {
				callback(filePath, stat);
			} else if (stat.isDirectory()) {
				walkSync(filePath, callback);
			}
		});
	}
	

	return router;
};





