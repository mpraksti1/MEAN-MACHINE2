
// BASE SETUP

// ======================================

// CALL THE PACKAGES -------------------- 

// call express
var express = require('express'); 

// define our app using express
var app = express(); 

// get body-parser
var bodyParser = require('body-parser'); 

// used to see requests
var morgan = require('morgan'); 

// for working w/ our database
var mongoose = require('mongoose'); 

// user model
var User = require('../app/models/user.js');

// set the port for our app
var port = process.env.PORT || 8080; 

// connect to database
mongoose.connect('mongodb://localhost:27017/rest')

// APP CONFIGURATION ---------------------

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API

// =============================

// basic route for the home page
app.get('/', function(req, res) {
	res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is working

// accessed at GET http:
//localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

apiRouter.route('/users')
	// create a user (accessed at POST http://localhost:8080/api/users)
	
	.post(function(req, res) {
		//create new instance of user model
		var user = new User();

		//set users info to that of the req
		user.name 		= req.body.name;
		user.username 	= req.body.username;
		user.password 	= req.body.password;

		//save user and check for errors
		user.save(function(err){
			if(err) {
				if (err.code == 11000){
					return res.json({ success: false, message: 'A user with that username already exists'});
				} else {
					return res.send(err);
				}
			}

			res.json({message: 'User Created!'});
		});
	});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER

// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);