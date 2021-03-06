var allNewdleElems = [];
var globalNewdleElems =[];
var currentAccountJSON;
var editingIndex = 0;
var timesAdded = 0;
var signupNewdle;

//this is the publish button on the bottom right, it will save the current newdle to a file
function showPublishNewdleModal() {
	console.log(globalNewdleElems);
	if (typeof globalNewdleElems !== 'undefined' && globalNewdleElems.length > 0){
		saveFile();
        alert("Your Newdle is now available on the sign-up page!");
	}else{
		alert("you must enter some days!");
	}
}

function showSignupNewdleModal(newdleNum) {
	var modalBackdrop = document.getElementById('modal-backdrop');
	var editNewdleModal = document.getElementById('signup-newdle-modal');
	//remove the hidden classlist
	modalBackdrop.classList.remove('hidden');
	editNewdleModal.classList.remove('hidden');
	signupNewdle = newdleNum;
	
	var newdleHeaderElement = document.getElementById('header-insertion');
	var header3 = document.createElement('H3'); 
	var headerText = document.createTextNode('Hours Available for Sign-up on: '+currentAccountJSON[newdleNum].date);
	var timesContainer = editNewdleModal.querySelector('.newdle-input-element');
	
	for(var i = 0; i < currentAccountJSON[newdleNum].times.length; i++){
		//for each open time
		if(currentAccountJSON[newdleNum].names[i] == ""){
			//create a time label and checkbox
			var timeSlot = document.createElement('input');
			var timeLabel = document.createElement('label');
			var timeTxt = document.createTextNode(prettifyTime(currentAccountJSON[newdleNum].times[i]));
			
			timeSlot.setAttribute('type', 'checkbox');
			timeSlot.setAttribute('id', ('time-slot' + i));
			timeSlot.setAttribute('class', 'time-slot');
			timeSlot.setAttribute('value', currentAccountJSON[newdleNum].times[i]);
			timeLabel.setAttribute('id', ('time-label' + i));
			timeLabel.setAttribute('for', ('time-slot' + i));
			
			timeLabel.appendChild(timeTxt);
			timesContainer.appendChild(timeSlot);
			timesContainer.appendChild(timeLabel);
		}
	}
	
	header3.appendChild(headerText);
	newdleHeaderElement.appendChild(header3);
	
	//add listeners for sign up modal interaction
	var signupModalCloseButton = document.querySelector('#signup-newdle-modal .modal-close-button');
	signupModalCloseButton.addEventListener('click', closeSignupNewdleModal);

	var signupModalCancelButton = document.querySelector('#signup-newdle-modal .modal-cancel-button');
	signupModalCancelButton.addEventListener('click', closeSignupNewdleModal);

	var signupModalAcceptButton = document.querySelector('#signup-newdle-modal .modal-accept-button');
	signupModalAcceptButton.addEventListener('click', acceptSignupNewdleModal);
}

//function for signup modal 'accept' button click
function acceptSignupNewdleModal(){
	//var timesContainer = document.getElementById('signup-newdle-modal').querySelector('.newdle-input-element');
	var timeChkBoxes = document.getElementsByClassName('time-slot');
	var signupName = document.getElementById('input-signup-name').value;
	var hasCheckedBoxes = false;
	
	if(signupName != ""){	
			//loop through checkboxes, 
			for(var i = 0; i < timeChkBoxes.length; i++){
				//if checked
				if(timeChkBoxes[i].checked == true){
					hasCheckedBoxes = true;
					//find corresponding time in account JSON of current newdle and
					//fill in name for that time, set available 'false', decrement openings
					for(var b = 0; b < currentAccountJSON[signupNewdle].times.length; b++){
						if(timeChkBoxes[i].value == currentAccountJSON[signupNewdle].times[b]){
							currentAccountJSON[signupNewdle].names[b] = signupName;
							currentAccountJSON[signupNewdle].available[b] = 'false';
							currentAccountJSON[signupNewdle].openings--;
				
							//set no times available flag
							if(currentAccountJSON[signupNewdle].openings == 0){
								currentAccountJSON[signupNewdle].timeAvailable = 'false';
							}
						}
					}
		
				//timesArray.push(timeChkBoxes[i].value);
				}
			}
		if(hasCheckedBoxes == true){
			//saveTimes(signupName, timesArray);
			saveTimes();
		}
		else{
			alert("Please check atleast one time");
		}
	}
	else{
		alert("Please enter a valid name");
	}
	
	closeSignupNewdleModal();
	
	window.location.href = '/sign_up';
	
	/*Test code for refresh of sign up page, not working
	var refreshRequest = new XMLHttpRequest();
	
	refreshRequest.open('GET', '/sign_up');
	refreshRequest.addEventListener('load', function(event){
		var error;
		if (event.target.status !== 200){
			error = event.target.response;
		}
		else{
			document.write(refreshRequest.responseText);
		}
	});
	
	refreshRequest.send();
	*/
}

function saveTimes() {
	var postURL = "/accept_sign_up";
	var postRequest = new XMLHttpRequest();
	
	postRequest.open('POST', postURL);
	postRequest.setRequestHeader('Content-Type', 'application/json');
	postRequest.addEventListener('load', function(event){
		var error;
		if (event.target.status !== 200){
			error = event.target.response;
		}
	});

	var jsonObject = currentAccountJSON;
	
	postRequest.send(JSON.stringify(jsonObject));
}

function prettifyTime(uglyTime){
	var suffix;
	var timeBits = uglyTime.split(':');
	var hours = timeBits[0];
	var minutes = timeBits[1];
	var prettyTime;
	
	if(hours > 11){
		suffix = "PM";
		if(hours > 12){
			hours = String(hours - 12);
		}
	}
	else{
		suffix = "AM";
	}
	
	if(hours.charAt(0) == '0'){
		hours = hours.slice(1, 2);
	}
	
	prettyTime = hours + ':' + minutes + ' ' + suffix;
	return(prettyTime);
}

function closeSignupNewdleModal() {
	var modalBackdrop = document.getElementById('modal-backdrop');
	var signupNewdleModal = document.getElementById('signup-newdle-modal');
	//add the hidden class list
	modalBackdrop.classList.add('hidden');
	signupNewdleModal.classList.add('hidden');
	
	//remove dynammic header
	var newdleHeaderElement = document.getElementById('header-insertion');
	var header3 = newdleHeaderElement.querySelector('H3');
	newdleHeaderElement.removeChild(header3);
	
	//remove time slots
	var timesContainer = signupNewdleModal.querySelector('.newdle-input-element');
	while(timesContainer.firstChild){
		timesContainer.removeChild(timesContainer.firstChild)
	}
	
	//remove listeners
	var signupModalCloseButton = document.querySelector('#signup-newdle-modal .modal-close-button');
	signupModalCloseButton.removeEventListener('click', closeSignupNewdleModal);

	var signupModalCancelButton = document.querySelector('#signup-newdle-modal .modal-cancel-button');
	signupModalCancelButton.removeEventListener('click', closeSignupNewdleModal);

	var signupModalAcceptButton = document.querySelector('#signup-newdle-modal .modal-accept-button');
	signupModalAcceptButton.removeEventListener('click', closeSignupNewdleModal);
	
	signupNewdleModal.querySelector('#input-signup-name').value = "";
}

//this is the x and cancel button in the create newdle dialog.
//opencreateNewdleModal is always open when /create is navigated to, no need for a function
function closeCreateNewdleModal() {
	var modalBackdrop = document.getElementById('modal-backdrop');
	var createNewdleModal = document.getElementById('create-newdle-modal');
	//add the hidden class list
	modalBackdrop.classList.add('hidden');
	createNewdleModal.classList.add('hidden');
	clearNewdleInputValues();
}

//clear input values
function clearNewdleInputValues() {
	var newdleInputElems = document.getElementsByClassName('newdle-input-element');
	for (var i = 0; i < newdleInputElems.length; i++) {
		var input = newdleInputElems[i].querySelector('input, textarea');
		input.value = '';
	}
}

//clear DOM of edit
function clearEditNewdleDOM(){
	//remove header
	var newdleHeaderElement = document.getElementById('header-insertion');
	while(newdleHeaderElement.firstChild){
		newdleHeaderElement.removeChild(newdleHeaderElement.firstChild)
	}
	//remove all children
	var newdleContentElement = document.getElementsByClassName('newdle-input-element-selector');
	while(newdleContentElement[0].firstChild){
		newdleContentElement[0].removeChild(newdleContentElement[0].firstChild)
	}
	//reset times added to DOM
	timesAdded = 0;
}

function showEditNewdleModal(evt) {
	var modalBackdrop = document.getElementById('modal-backdrop');
	var editNewdleModal = document.getElementById('edit-newdle-modal');
	//add the hidden class list
	modalBackdrop.classList.remove('hidden');
	editNewdleModal.classList.remove('hidden');
	//get index in globalNewdleElems for which the edit button was pressed
	editingIndex = evt.target.id;
	var newdleHeaderElement = document.getElementById('header-insertion');
	//load previous time inputs that may have been entered
	loadTimeInputs();
	//create H3 of editing day
	var header3 = document.createElement('H3'); 
	var headerText = document.createTextNode('Editing hours available for: '+globalNewdleElems[evt.target.id].date);
	header3.appendChild(headerText);
	newdleHeaderElement.appendChild(header3);
}

function saveInputDay(){
	//globalNewdleElems[editingIndex].openings = timesAdded;
	var inputText = document.getElementsByClassName('input-checker');
	//reset all to 0 to prepare for re-write
	for(var i = 0; i < timesAdded; i++){
		//reset openings to 0
		globalNewdleElems[editingIndex].openings = 0;
		//reset times to an empty array
		globalNewdleElems[editingIndex].times = [];
		//reset available to an empty array
		globalNewdleElems[editingIndex].available = [];
		//reset names to an empty array
		globalNewdleElems[editingIndex].names = [];
	}
	//re-save all elements
	for(var i = 0; i < timesAdded; i++){
		//make sure entered time code is valid
		if(checkValidTime(inputText[i].value)){
			console.log(inputText[i].value);
			//an opening is added
			globalNewdleElems[editingIndex].openings++;
			//push times into global array
			globalNewdleElems[editingIndex].times.push(inputText[i].value);
			//push a new true onto the available array
			globalNewdleElems[editingIndex].available.push('true');
			//push an empty name onto the names array
			globalNewdleElems[editingIndex].names.push('');
		}else{
			alert("Invalid time format: "+inputText[i].value+" Please use HH:MM formatting");
		}
	}
	closeEditNewdleModal();
}

function checkValidTime(timeValue){
	var sHours = timeValue.split(':')[0];
    var sMinutes = timeValue.split(':')[1];
    if(sHours == "" || isNaN(sHours) || parseInt(sHours) > 23){
        return false;
    }
    else if(parseInt(sHours) == 0)
        sHours = "00";
    else if(sHours < 10)
        sHours = "0"+sHours;

    if(sMinutes == "" || isNaN(sMinutes) || parseInt(sMinutes) > 59){
        return false;
    }
    else if(parseInt(sMinutes) == 0)
        sMinutes = "00";
    else if(sMinutes < 10)
        sMinutes = "0"+sMinutes;   
	
    return true;
}

function addTimeInput(){
	var newdleContentElement = document.getElementsByClassName('newdle-input-element-selector');
	var timeInput = document.createElement('input');
	var timeText = document.createTextNode('Enter a time: ');
	var br = document.createElement("br");
	timeInput.setAttribute('type','text');
	timeInput.classList.add('input-checker');
	newdleContentElement[0].appendChild(timeText);
	newdleContentElement[0].appendChild(timeInput);
	newdleContentElement[0].appendChild(br);
	timesAdded++;
}

function loadTimeInputs(){
	//reset timesAdded to 0 and reincrement
	timesAdded = 0;
	for(var i = 0; i < globalNewdleElems[editingIndex].times.length; i++){
		//increment times added
		timesAdded++;
		var newdleContentElement = document.getElementsByClassName('newdle-input-element-selector');
		var timeInput = document.createElement('input');
		var timeText = document.createTextNode('Enter a time: ');
		var br = document.createElement("br");
		//set text to what it was when saved
		timeInput.value = globalNewdleElems[editingIndex].times[i];
		timeInput.setAttribute('type','text');
		timeInput.classList.add('input-checker');
		newdleContentElement[0].appendChild(timeText);
		newdleContentElement[0].appendChild(timeInput);
		newdleContentElement[0].appendChild(br);
	}
	
}

function closeEditNewdleModal() {
	var modalBackdrop = document.getElementById('modal-backdrop');
	var editNewdleModal = document.getElementById('edit-newdle-modal');
	//add the hidden class list
	modalBackdrop.classList.add('hidden');
	editNewdleModal.classList.add('hidden');
	//remove everything from DOM so we can repopulate if a new day is edited.
	clearEditNewdleDOM();
	refreshDOMContent();
}

function refreshDOMContent(){
	//need to refresh DOM content of all newdle days here.
	var newdles = document.getElementsByClassName('newdle');
	
	for(var i = 0; i < newdles.length; i++){
		var openings = newdles[i].querySelector('#openings-count');
		
		openings.text = globalNewdleElems[i].openings + " openings";
	}
}



function getDaySuffix(newdleDay){
	switch(newdleDay){
		case "0": return "th";
		break;
		case "1": return "st"; 
		break;
		case "2": return "nd"; 
		break;
		case "3": return "rd"; 
		break;
		case "21": return "st";
		break;
		case "22": return "nd"; 
		break;
		case "23": return "rd"; 
		break;
		case "31": return "st"; 
		break;
		default: return "th";
		break;
	}
}

//proper formatting for day
function getDayName(newdleDay){
	switch(newdleDay){
		case 0: return "Sunday";
		break;
		case 1: return "Monday"; 
		break;
		case 2: return "Tuesday"; 
		break;
		case 3: return "Wednesday"; 
		break;
		case 4: return "Thursday";
		break;
		case 5: return "Friday"; 
		break;
		case 6: return "Saturday"; 
		break;
		default: return "uhoh";
		break;
	}
}

//proper formatting for month
function getDateStringProper(newdleDate){
	switch(newdleDate){
		case 0: return "01";
		break;
		case 1: return "02"; 
		break;
		case 2: return "03"; 
		break;
		case 3: return "04"; 
		break;
		case 4: return "05";
		break;
		case 5: return "06"; 
		break;
		case 6: return "07"; 
		break;
		case 7: return "08";
		break;
		case 8: return "09"; 
		break;
		case 9: return "10"; 
		break;
		case 10: return "11"; 
		break;
		case 11: return "12";
		break;
		default: return "uhoh";
		break;
	}
}

//sends the object globalNewdleElems to server to be saved
function saveFile() {
	var postURL = "/data";
	var postRequest = new XMLHttpRequest();
	postRequest.open('POST', postURL);
	postRequest.setRequestHeader('Content-Type', 'application/json');
	postRequest.addEventListener('load', function(event){
		var error;
		if (event.target.status !== 200){
			error = event.target.response;
		}
	});

	var postBody = {
		object: globalNewdleElems
	};
	postRequest.send(JSON.stringify(postBody));
}

function generateNewNewdleElem(newdleDay, newdleDate) {
	var newdleTemplate = Handlebars.templates.newdle;
	var newdleData = {
		openings: 0,
		day: getDayName(newdleDay),
		date: newdleDate,
		times: [],
		available: [],
		names: []
	};
	//push a day into the global newdle elements
	globalNewdleElems.push(newdleData);
	return newdleTemplate(newdleData);
}

//this loops through all days selected in the createNewdle modal and adds them to DOM
function insertNewNewdle() {
	var newdleStartDayInput = document.getElementById('newdle-date-input').value;
	var newdleEndDayInput = document.getElementById('newdle-date2-input').value;
	var newdleStartDay = new Date(newdleStartDayInput);
	var newdleEndDay = new Date(newdleEndDayInput);
	newdleEndDay.setDate(newdleEndDay.getDate() + 1);
	if ((newdleEndDay && newdleStartDay) && (newdleStartDay < newdleEndDay)) {
		newdleStartDay.setDate(newdleStartDay.getDate() + 1);
		while(newdleStartDay <= newdleEndDay){
			//console.log(newdleStartDay.getFullYear()+"-"+(newdleStartDay.getMonth()+1)+"-"+newdleStartDay.getDate());
			var newNewdleElem = generateNewNewdleElem(newdleStartDay.getDay(), newdleStartDay.getFullYear()+"-"+getDateStringProper(newdleStartDay.getMonth())+"-"+newdleStartDay.getDate());
			var newdleContainer = document.querySelector('.newdle-container');
			newdleContainer.insertAdjacentHTML('beforeend', newNewdleElem);
			allNewdleElems.push(newNewdleElem);
			//increment day by 1
			newdleStartDay.setDate(newdleStartDay.getDate() + 1);
		}
		insertEditButtons();
		//insertSignUpButtons();
		closeCreateNewdleModal();
	}else{
		alert('You must specify both a proper start and end date');
	}
}

//function loops through each day listed and adds an edit button to it via DOM
function insertEditButtons(){
	var newdleAttributionElement = document.getElementsByClassName('newdle-attribution');
	var newButton = [];
	var buttonLabel = [];
	console.log(newdleAttributionElement);
	for(var i = 0; i < newdleAttributionElement.length; i++)
	{
		newButton[i] = document.createElement('button');
		buttonLabel[i] = document.createTextNode('Edit');
		newButton[i].id = i;
		console.log(newButton[i].id);
		newButton[i].classList.add('edit-button');
		newButton[i].addEventListener('click', showEditNewdleModal);
		newButton[i].appendChild(buttonLabel[i]);
		newdleAttributionElement[i].appendChild(newButton[i]);
	}
}

//gets JSON object and displayNewdlePage html from server,
//need to render client-side because globalNewdleElems must be populated and
//buttons for signup modal need hookups
function initSignupView(accountID){
	var accountsViewReq = new XMLHttpRequest();
	var accountsJSONReq = new XMLHttpRequest();
	
	viewUrl = "/" + accountID;
	jsonUrl = "/" + accountID + "/json"; 
	
	//synchronous calls No-No! Need to change this later
	accountsViewReq.open('GET', viewUrl, false);
	accountsJSONReq.open('GET', jsonUrl, false);
	
	accountsJSONReq.send();
	//stores JSON object for one account(file)
	currentAccountJSON = JSON.parse(accountsJSONReq.responseText);
	//sends request for handlebars render of displayNewdlePage
	accountsViewReq.send();
	//writes response html
	document.write(accountsViewReq.responseText);
}


//code to add sign up buttons to each newdle

/*
function insertSignUpButtons(){
	var newdleAttributionElement = document.getElementsByClassName('newdle-attribution');
	var newButton = [];
	var buttonLabel = [];
	console.log(newdleAttributionElement);
	for(var i = 0; i < newdleAttributionElement.length; i++)
	{
		newButton[i] = document.createElement('button');
		buttonLabel[i] = document.createTextNode('Sign Up');
		newButton[i].id = i;
		console.log(newButton[i].id);
		newButton[i].classList.add('signup-button');
		newButton[i].addEventListener('click', showSignupNewdleModal);
		newButton[i].appendChild(buttonLabel[i]);
		newdleAttributionElement[i].appendChild(newButton[i]);
	}
}
*/


//event listeners
window.addEventListener('DOMContentLoaded', function () {

	/*var newdleElemsCollection = document.getElementsByClassName('newdle');
	for (var i = 0; i < newdleElemsCollection.length; i++) {
		allNewdleElems.push(newdleElemsCollection[i]);
	}*/

	var createNewdleButton = document.getElementById('create-newdle-button');
	createNewdleButton.addEventListener('click', showPublishNewdleModal);

	var modalCloseButton = document.querySelector('#create-newdle-modal .modal-close-button');
	modalCloseButton.addEventListener('click', closeCreateNewdleModal);

	var modalCancelButton = document.querySelector('#create-newdle-modal .modal-cancel-button');
	modalCancelButton.addEventListener('click', closeCreateNewdleModal);

	var modalAcceptButton = document.querySelector('#create-newdle-modal .modal-accept-button');
	modalAcceptButton.addEventListener('click', insertNewNewdle);
	

	//editing listeners
	var editModalCloseButton = document.querySelector('#edit-newdle-modal .modal-close-button');
	editModalCloseButton.addEventListener('click', closeEditNewdleModal);

	var editModalCancelButton = document.querySelector('#edit-newdle-modal .modal-cancel-button');
	editModalCancelButton.addEventListener('click', closeEditNewdleModal);
	
	var editModalAddButton = document.querySelector('#edit-newdle-modal .modal-add-button');
	editModalAddButton.addEventListener('click', addTimeInput);

	var editModalAcceptButton = document.querySelector('#edit-newdle-modal .modal-accept-button');
	editModalAcceptButton.addEventListener('click', saveInputDay);
});
