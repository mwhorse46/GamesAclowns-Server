var express = require('express');
var router = express.Router();
var dir = require('node-dir');
var admin	=	require('../datalayer/admin')
var userManager	=	require('../datalayer/user');
var webshot = require('webshot');
var config	=	require('../utils/config')

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/index');
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
	router.get('/uploader',function (req, res) {
		res.render('uploader');
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
								siteType: 'url'
							};
							var htmlForm = '<div style="background: chartreuse;width: 1000px; height: 500px;" class="container-fluid"> <div class="row"> <div class="col-md-6"><img width="200px" height="200px"  alt="Bootstrap Image Preview" src="' + user.image + '"/></div><div class="col-md-6"><img width="200px" height="200px" alt="character" src="http:localhost:8000/images/' + imageData.image + '"/></div></div></div>'
							var head = '<head><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"></script><script type="text/javascript" src="/javascript/home.js"></script><script type="text/javascript" src="assets/js/bootstrap.min.js"></script><link href="assets/css/bootstrap.css" rel="stylesheet"/><link href="assets/css/font-awesome.css" rel="stylesheet"/><link href="assets/css/bootstrap-theme.css" rel="stylesheet"/></head>'
							console.log(htmlForm)
							//htmlForm	=	"Hello"
							webshot(config.runningHost + '/choosed/reaction/' + user.userid + '/' + choiceInfo.pk_choiceid, user.userid + '_' + choiceInfo.pk_choiceid + ".png", option, function (err) {
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
					choice.charimage	=	config.runningHost+"/images/"+charimage
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

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
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





