var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var newdleData = require('./newdleData0');
var app = express();
//port user specified or 3000
var port = process.env.PORT || 3000;
//set engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
	
//this will figure itself out eventually, fixed for now
var nextNewdle = 3;
var publishModalDisplay = false;
var createNewdleDisplay = false;

//serve all files from public.
app.use(express.static(path.join(__dirname, 'public')));

//set layout to main and pass in newdleData
var templateArgs = {
	layout: 'main',
    newdle: newdleData
};

//if someone navigates to '/' render main newdle page, with information about the service and what it is
app.get('/', function(req, res){
	templateArgs = {
		layout: 'main',
		newdle: newdleData,
		//publishModalDisplay: false, //display publish button
		//createNewdleDisplay: false //display newdle container with "create new newdle"
	};
    res.render('newdlePage.handlebars', templateArgs);
});

//if someone navigates to '/create' render main newdle creation page
//displays publish modal and they can populate a page with days and times to sign up
app.get('/create', function(req, res){
        templateArgs = {
            layout: 'main',
            newdle: newdleData,
            publishModalDisplay: true, //display publish button
            createNewdleDisplay: true //display newdle container with "create new newdle"
        };
        //publishModalDisplay remains false when the page is loaded, it is only switched to true
        //after the user adds some days to a newdle.
        res.render('createNewdlePage.handlebars', templateArgs);
        });

//if someone navigates to '/*' it will render the JSON file containing that newdle's data
//in here they are allowed to click days and sign up for a time
app.get('/:id', function(req, res){
	//if id doesn't exist, go to 404
	if(!newdleData[req.params.id]){
		templateArgs = {
			layout: 'main',
			newdle: newdleData,
			publishModalDisplay: false,
			createNewdleDisplay: false
		};
		res.status(404);
		res.render('404Page.handlebars', templateArgs);
	}
	//id exists, get data required from newdle and serve
	else{
		var newdleObject = require('./newdleData'+req.params.id);
		templateArgs = {
			layout: 'main',
			newdle: newdleObject
		};
		res.render('displayNewdlePage.handlebars', templateArgs);
	}
});

//404 page for anything undefined
app.get('*', function(req, res){
	res.status(404);
    res.render('404Page.handlebars', templateArgs);
});
//listen on correct port
app.listen(port, function () {
  console.log("== Server listening on port", port);
});
