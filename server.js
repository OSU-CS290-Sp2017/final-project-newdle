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

/*
sent object{"accountNum" : currentAccountJSON[0].accountNum,
					  "dayInstance" : signupNewdle,
					  "name" : name,
					  "timesToSave" : timesToSave
	}
*/
app.post("/accept_sign_up", function(req, res){
	
	var editJSON = require('./data/newdleData'+req.body.accountNum+'.json');
	
	for(var i = 0; i < req.body.timesToSave.length; i++){
		for(var b = 0; b < editJSON[req.body.dayInstance].times.length; b++){
			if(req.body.timesToSave[i] == editJSON[req.body.dayInstance].times[b]){
				editJSON[req.body.dayInstance].names[b] = req.body.name;
				editJSON[req.body.dayInstance].available[b] = 'false';
				editJSON[req.body.dayInstance].openings--;
				
				if(editJSON[req.body.dayInstance].openings == 0){
					editJSON[req.body.dayInstance].timeAvailable = 'false';
				}
				break;
			}
		}
	}
	
	fs.writeFile('./data/newdleData'+req.body.accountNum+'.json', JSON.stringify(editJSON, null, 2), function (err) {
        if (err) {
          res.status(500).send("Unable to save times to \"database\".");
        } else {
          res.status(200).send();
        }
    });
	
});


/*This is a test for the implementation of the detailed day view.
 It's currently static, but obviously the goal is to grab/display this info dynamically
 via the links on each day
 The general idea is it grabbing and displaying/sending the data for a particular day
*/
app.get('/days', function(req, res){
	console.log('serving: using dayData1.json');
		var dayObject = require('./data/dayData1.json');
		templateArgs = {
			layout: 'main',
			times: dayObject[0].times,
		};
        console.log(dayObject[0].times); //testing
		res.render('displayDay.handlebars', templateArgs);
});

//server request for Sign Up button click
//reads in all .json data files and pushes any with 'openings' into array
//responds with res.render(), passes array of () to display 

app.get('/sign_up', function(req, res){
	var fileCounter = 0;
	var fileObjs = [];
	
	while(fs.existsSync('./data/newdleData'+fileCounter+'.json')){
		var newdleObjs = require('./data/newdleData'+fileCounter+'.json')
		var totalOpenings = 0;
		
		//get number of openings within a file
		for(var i = 0; i < newdleObjs.length; i++){
			totalOpenings += parseInt(newdleObjs[i].openings);
		}
		
		//push that file into array if it has openings
		if(totalOpenings > 0){
			var fileObj = {id: fileCounter, openings: totalOpenings};
			
			fileObjs.push(fileObj);
		}
		
		fileCounter++;
	}
	
	templateArgs = {
		layout: 'main',
		fileObjs: fileObjs
	};
	
	//send array of file IDs with number of openings
	res.render('displayOpenings', templateArgs);
});

//if someone navigates to '/*' it will render the JSON file containing that newdle's data
//in here they are allowed to click days and sign up for a time

app.get('/:id', function(req, res){
	//if id doesn't exist, go to 404
	console.log(('serving: '+'./data/newdleData'+req.params.id+'.json'), "for view");
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
		
		for(var i = 0; i < newdleObject.length; i++){
			newdleObject[i].id = i;
			
			//controls whether newdle gets a sign up button or not
			if(newdleObject[i].openings != 0){
				newdleObject[i].timeAvailable = true;
			}
			else{
				newdleObject[i].timeAvailable = false;
			}
		}
		
		templateArgs = {
			layout: 'main',
			newdle: newdleObject
		};
		res.render('displayNewdlePage.handlebars', templateArgs);
	}
});

//request handling return of file data object

app.get('/:id/json', function(req, res){
	//file exists, get JSON data from file and serve
	console.log(('serving: '+'./data/newdleData'+req.params.id+'.json'), "JSON data");
	if(fs.existsSync('./data/newdleData'+req.params.id+'.json')){
		var data = require('./data/newdleData'+req.params.id+'.json');
		
		for(var i = 0; i < data.length; i++){
			data[i].accountNum = req.params.id;
		}
		res.send(data);
	}
	//if file doesn't exist, go to 404
	else{
		res.status(404);
		res.render('404Page.handlebars', templateArgs);
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
