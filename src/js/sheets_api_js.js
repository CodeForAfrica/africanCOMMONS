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
  var SPREADSHEET_ID = '1nj6cbnDgr9A4NWu3F6x_7vytecQDn4WEd6zyqjQOlo0';
  var sheetRange = 'PROJECTS';
  var data = {};
  var bootbox = require('bootbox');
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
      gapi.auth2.getAuthInstance().isSignedIn.listen(function(){

      });
      // Handle the initial sign-in state.
    });
  }

  /**
   * Retrieves sheet data from spreadsheet
   * @param sheetRange to retrieve data from
   *
   */
  function getSheetData(sheetRange, callback){

    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRange,
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
 * Posts to sheets API
 * @param data
 * @param oauth2Client
 */
function postToSheetsAPI(values, sheetRange='PROJECTS'){

  var params = {
     // The ID of the spreadsheet to update.
     spreadsheetId: SPREADSHEET_ID,
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
    //console.log(response.result);
    bootbox.alert('Add successful!');
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    bootbox.alert(reason.result.error.message);
  });
}


window.addEventListener('load', function () {
  authorizeButton = $('.btn-add-project-form');
  signoutButton = $('.btn-add-project-form');
  loadAndInitializeGAPI();
  window.postToSheetsAPI = postToSheetsAPI;
  window.getSheetData = getSheetData;
});
