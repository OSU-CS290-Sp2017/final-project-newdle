var allNewdleElems = [];

/*
 * This function shows the modal to create a newdle when the "create newdle"
 * button is clicked.
 */
function showCreateNewdleModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createNewdleModal = document.getElementById('create-newdle-modal');

  // Show the modal and its backdrop.
  modalBackdrop.classList.remove('hidden');
  createNewdleModal.classList.remove('hidden');

}

/*
 * This function hides the modal to create a newdle and clears any existing
 * values from the input fields whenever any of the modal close actions are
 * taken.
 */
function closeCreateNewdleModal() {

  var modalBackdrop = document.getElementById('modal-backdrop');
  var createNewdleModal = document.getElementById('create-newdle-modal');

  // Hide the modal and its backdrop.
  modalBackdrop.classList.add('hidden');
  createNewdleModal.classList.add('hidden');

  clearNewdleInputValues();

}

/*
 * This function clears any value present in any of the newdle input elements.
 */
function clearNewdleInputValues() {

  var newdleInputElems = document.getElementsByClassName('newdle-input-element');
  for (var i = 0; i < newdleInputElems.length; i++) {
    var input = newdleInputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}

/*
 * Create and return a new HTML element representing a single newdle, given the
 * newdle text and newdle attribution as arguments.  The newdle element has the
 * following structure:
 *
 * <article class="newdle">
 *   <div class="newdle-icon">
 *     <i class="fa fa-bullhorn"></i>
 *   </div>
 *   <div class="newdle-content">
 *     <p class="newdle-text">
 *       {{newdleText}}
 *     </p>
 *     <p class="newdle-attribution">
 *       <a href="#">{{newdleAttribution}}</a>
 *     </p>
 *   </div>
 * </article>
 */
function generateNewNewdleElem(newdleText, newdleAuthor) {

  var newdleTemplate = Handlebars.templates.newdle;
  var newdleData = {
    text: newdleText,
    author: newdleAuthor
  };

  return newdleTemplate(newdleData);

}

/*
 * This function takes user input values from the "create newdle" modal,
 * generates a new newdle using them, and inserts that newdle into the document.
 */
function insertNewNewdle() {

  var newdleText = document.getElementById('newdle-text-input').value;
  var newdleAttribution = document.getElementById('newdle-attribution-input').value;
	
	
  /*
   * Only generate the new newdle if the user supplied values for both the newdle
   * text and the newdle attribution.  Give them an alert if they didn't.
   */
  if ((newdleText && newdleAttribution) && (newdleText < newdleAttribution)) {

      var newNewdleElem = generateNewNewdleElem(newdleText, newdleAttribution);
      var newdleContainer = document.querySelector('.newdle-container');
      newdleContainer.insertAdjacentHTML('beforeend', newNewdleElem);
      allNewdleElems.push(newNewdleElem);

      closeCreateNewdleModal();

  } else {

    alert('You must specify both a proper start and end date');

  }
}

/*
 * Perform a search over over all the newdles based on the search query the user
 * entered in the navbar.  Only display newdles that match the search query.
 * Display all newdles if the search query is empty.
 */
function doNewdleSearch() {

  // Grab the search query, make sure it's not null, and do some preproessing.
  var searchQuery = document.getElementById('navbar-search-input').value;
  searchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';

  // Remove all newdles from the newdle container temporarily.
  var newdleContainer = document.querySelector('.newdle-container');
  while (newdleContainer.lastChild) {
    newdleContainer.removeChild(newdleContainer.lastChild);
  }

  /*
   * Loop through the collection of all newdles and add newdles back into the DOM
   * if they contain the search term or if the search term is empty.
   */
  allNewdleElems.forEach(function (newdleElem) {
    if (!searchQuery || newdleElem.textContent.toLowerCase().indexOf(searchQuery) !== -1) {
      newdleContainer.appendChild(newdleElem);
    }
  });

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  // Remember all of the existing newdles in an array that we can use for search.
  var newdleElemsCollection = document.getElementsByClassName('newdle');
  for (var i = 0; i < newdleElemsCollection.length; i++) {
    allNewdleElems.push(newdleElemsCollection[i]);
  }

  var createNewdleButton = document.getElementById('create-newdle-button');
  createNewdleButton.addEventListener('click', showCreateNewdleModal);

  var modalCloseButton = document.querySelector('#create-newdle-modal .modal-close-button');
  modalCloseButton.addEventListener('click', closeCreateNewdleModal);

  var modalCancalButton = document.querySelector('#create-newdle-modal .modal-cancel-button');
  modalCancalButton.addEventListener('click', closeCreateNewdleModal);

  var modalAcceptButton = document.querySelector('#create-newdle-modal .modal-accept-button');
  modalAcceptButton.addEventListener('click', insertNewNewdle);


});
