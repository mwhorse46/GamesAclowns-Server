passport-social
==============

This repository serves as an example for a basic Node.js application which is using [Passport](http://passportjs.org/) as the authentication middleware for authenticating against Facebook and Twitter and storing the details in a locally configured Mongo backend

Steps to run the app
=====================
* After cloning the repo, install the dependencies by running **npm install**
* Create facebook and twitter apps and update the config files fb.js and twitter.js with the respective app details before running the server.
* To start the server, run **npm start** on the base directory
 

Perquisites
============
The server assumes that you have a local mongo instance running. This means if you have mongo installed locally, all you need to do is configure the db.js file correctly and run the mongod daemon
