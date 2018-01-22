var google = require('googleapis');
var fs = require('fs');
var  readline = require('readline');
const {GoogleAuth} = require('google-auth-library');
var sheets = google.sheets('v4');
var theSpreadSheet = '1nj6cbnDgr9A4NWu3F6x_7vytecQDn4WEd6zyqjQOlo0';
var sheetRange = 'PROJECTS';
var valueInputOption = 'RAW';
var insertDataOption = 'INSERT_ROWS';
try{
  var creds  = require('./client_secret.json');
}catch(err){
  console.log('Error loading client secret file: ' + err);
}
var REDIRECT_URL = 'http://localhost:4000';

authorize(creds, listProjects);

var data = [
   [
     "MedPrices",
     "http://medprices.codefortanzania.org",
     "CFT",
     "CFT",
     2232323
   ]
 ];


/**
 * Authorize client for accessing Sheets API
 * @param credentials
 * @param callback
 */
function authorize(credentials, callback){

  var CLIENT_ID = credentials.installed.client_id;
  var CLIENT_SECRET = credentials.installed.client_secret;
  var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'saved_tokens.json';
  var OAuth2 = google.auth.OAuth2;
  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Retrieves all the Projects from spreadSheet
 * @param auth
 */
function listProjects(auth) {

  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: theSpreadSheet,
    range: sheetRange,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      getNewToken(oauth2Client, listProjects);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      console.log('Name, Major:');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        console.log('%s, %s', row[0], row[4]);
      }
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
      postData(data, oauth2Client);
    });

    });
  }// end getNewToken

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 *
 * @param data
 * @param oauth2Client
 */
function postData(data, oauth2Client){
  var request = {
     // The ID of the spreadsheet to update.
     spreadsheetId: theSpreadSheet,
     // The A1 notation of a range to search for a logical table of data.
     // Values will be appended after the last row of the table.
     range: sheetRange,

     valueInputOption: valueInputOption,

     // How the input data should be inserted.
     insertDataOption: insertDataOption,

     resource: {
       "values": data
     },
     auth: oauth2Client,
   };

  sheets.spreadsheets.values.append(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
}
