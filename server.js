var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var newdleData;
var app = express();
//port user specified or 3000
var port = process.env.PORT || 3000;
//set engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var nextNewdle = 0;	
//check to see how many files already exist in directory
while(fs.existsSync('./data/newdleData'+nextNewdle+'.json')){
	nextNewdle++;
}
console.log(nextNewdle+' Files found in data directory');
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
        newdle: [],
        publishModalDisplay: true, //display publish button
        createNewdleDisplay: true //display newdle container with "create new newdle"
    };
    //publishModalDisplay remains false when the page is loaded, it is only switched to true
    //after the user adds some days to a newdle.
    res.render('createNewdlePage.handlebars', templateArgs);
});

app.post("/data", function(req, res){
	var object;
	object = req.body.object;
	fs.writeFile('./data/newdleData'+nextNewdle+'.json', JSON.stringify(object, null, 2), function (err) {
        if (err) {
          res.status(500).send("Unable to save photo to \"database\".");
        } else {
          res.status(200).send();
		  //increment newdle file counter
		  nextNewdle++;
        }
    });
});

//if someone navigates to '/*' it will render the JSON file containing that newdle's data
//in here they are allowed to click days and sign up for a time
app.get('/:id', function(req, res){
	//if id doesn't exist, go to 404
	console.log('serving: '+'./data/newdleData'+req.params.id+'.json');
	if(!fs.existsSync('./data/newdleData'+req.params.id+'.json')){
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
		var newdleObject = require('./data/newdleData'+req.params.id+'.json');
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
