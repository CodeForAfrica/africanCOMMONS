  // Client ID and API key from the Developer Console
  var CLIENT_ID = '212041459889-od7vctc3mgi5mm4ujkjbm6hs2vo2l10j.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDHt9w6NI8L-bbWAzk5pITABM5_PYz1qcs';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

  var authorizeButton = null;//document.getElementById('authorize-button');
  var signoutButton = null;//document.getElementById('signout-button');
  var theSpreadSheet = '1nj6cbnDgr9A4NWu3F6x_7vytecQDn4WEd6zyqjQOlo0';
  var sheetRange = 'PROJECTS';
  var data = {};
  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      //authorizeButton.style.display = 'none';
      //signoutButton.style.display = 'block';
      console.log(data);
      //postToSheetsAPI(data);
      //getSheetData('CATEGORIES', listCategories);
    } else {
      //postToSheetsAPI(data);
      //authorizeButton.style.display = 'block';
      //signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    console.log('appendPre() ' + textContent);
  }

  /**
   * Retrieves sheet data from spreadsheet
   * @param sheetRange to retrieve data from
   *
   */
  function getSheetData(sheet, callback){
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: theSpreadSheet,
      range: sheet,
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        //console.log('Got some data');
        //console.log(range);
        callback(range);
      } else {
        console.log('No data found.');
      }
    }, function(response) {
      console.log('Error: ' + response.result.error.message);
    });
  }

  /**
   *
   * @param
   */
  function listCategories(range) {
    for (i = 0; i < range.values.length; i++) {
      var row = range.values[i];
      // Print columns A and E, which correspond to indices 0 and 4.
      console.log(row[0] + ', ' + row[1]);
    }
  }
/**
 * Loads and Initializes Google APIs javascript library
 *
 */
function loadAndInitializeGAPI() {
  	const gapiScript = document.createElement('script');
  	gapiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad'

  	window.onGapiLoad = function onGapiLoad() {

  		gapi.load('auth', {'callback': onAuthApiLoad})

  		function onAuthApiLoad() {
  			//gapi.auth.init()
        handleClientLoad();
  		}
  	}
  	document.body.appendChild(gapiScript);
}
/**
 *
 * @param data
 * @param oauth2Client
 */
function postToSheetsAPI(values, sheetRange='PROJECTS'){

  var params = {
     // The ID of the spreadsheet to update.
     spreadsheetId: theSpreadSheet,
     // The A1 notation of a range to search for a logical table of data.
     // Values will be appended after the last row of the table.
     range: sheetRange,
     valueInputOption: 'RAW',
     // How the input data should be inserted.
     insertDataOption: 'INSERT_ROWS'
   };

  var valueRangeBody = {
    "values": values
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
    return response;
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    return reason;
  });
}

window.addEventListener('load', function () {
  authorizeButton = $('.btn-add-project-form');
  signoutButton = $('.btn-add-project-form');
  loadAndInitializeGAPI();
  window.postToSheetsAPI = postToSheetsAPI;
  window.getSheetData = getSheetData;
});
