var $ = require('jquery')

// Avoid `console` errors in browsers that lack a console.
$(function () {
  var method
  var noop = function () {}
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ]
  var length = methods.length
  var console = (window.console = window.console || {})

  while (length--) {
    method = methods[length]

        // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop
    }
  }
}())

// Place any jQuery/helper plugins in here.
$(function () {
// Enable bootstrap tooltips

  $('[data-toggle="tooltip"]').tooltip();

  $('.pattern').on('click', function (e) {
    // Facebook App ID config
    var fbAppId = '165881994160670'

    var url = 'https://commons.africa/'
    var redirectUri = 'https://commons.africa/'
    var VanillaSharing = require('vanilla-sharing')

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      redirectUri = 'http://localhost:4000/'
    }

    var network = $(this).data('pattern-network')
    var title = $(this).data('pattern-title')
    var tags = $(this).data('pattern-tags')
    // var tagline = $(this).data('pattern-tagline')  // Unused
    tags = '#' + tags

    tags = ' #civicpatterns #africanCOMMONS #commons'

    switch (network) {
      case 'facebook-share':
          VanillaSharing.fbShare({
            url: url,
            redirectUri: redirectUri,
            hashtag: tags,
            quote: title,
            fbAppId: fbAppId
          });
        break;
        VanillaSharing.fbShare({
          url: url,
          redirectUri: redirectUri,
          hashtag: tags,
          quote: title,
          fbAppId: fbAppId
        })
        break
      case 'facebook-like':
        VanillaSharing.fbFeed({
          url: url,
          redirectUri: redirectUri,
          fbAppId: fbAppId
        })
        break
      case 'twitter':
        VanillaSharing.tw({
          url: url,
          title: title + tags
        })
        break
      default:
    }
    return false;
  }); // End onClick '.pattern'

var categorySelect = null;

$('.btn-add-project-form').on('click', function(e){
  //Check for user authentication
  var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  if(isSignedIn){
    $('#add-project-form').modal();
    categorySelect = $('#project-category option');
    if(categorySelect.length <= 1){
      getSheetData('CATEGORIES', listCategories);
    }
    return false;
  }
  else{
    //redirect to sign in page
    gapi.auth2.getAuthInstance().signIn();
    return false;
  }

});

$('.btn-add-organization-form').on('click', function(e){
  //Check for user authentication
  var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
  if(isSignedIn){
    $('#add-organization-form').modal();
    categorySelect = $('#organization-category option');
    if(categorySelect.length <= 1){
      getSheetData('CATEGORIES', listOrgCategories);
    }
    return false;
  }
  else{
    //redirect to sign in page
    gapi.auth2.getAuthInstance().signIn();
    return false;
  }

});

$('#save-project').on('click', function(e){

  var formData =  $( "#project-form" ).serializeArray();
  var projectValsDict = {};
  var i;
  for(i = 0; i < formData.length; i++){
    projectValsDict[formData[i].name] = formData[i].value
  }
  //arrange form data  to correspond to spreadsheet order
  var organizations = '';

  var projectVals = [[
    projectValsDict['project-name'], projectValsDict['origin-country'],
    projectValsDict['countries-deployed'], projectValsDict['project-description'],
    organizations, projectValsDict['project-category'],
    projectValsDict['project-website'], projectValsDict['github-repo'],
    projectValsDict['project-wiki'], projectValsDict['project-status'],
    projectValsDict['related-projects']
  ]];
  postToSheetsAPI(projectVals);
  document.getElementById("project-form").reset();
  $('#add-project-form').modal('toggle');
});

$('#save-organization').on('click', function(){

  var formData =  $( "#organization-form" ).serializeArray();
  var orgValsDict = {};
  var i;
  for(i = 0; i < formData.length; i++){
    orgValsDict[formData[i].name] = formData[i].value
  }
  //arrange form data  to correspond to spreadsheet order
  //Name	Country	Description	Category	Url	Projects	Github	Related

  var orgVals = [[
    orgValsDict['organization-name'], orgValsDict['country'],
    orgValsDict['description'],orgValsDict['organization-url'],
    orgValsDict['projects'], orgValsDict['github-repo'],
    orgValsDict['related-projects']
  ]];
  postToSheetsAPI(orgVals, 'ORGANISATIONS');
  document.getElementById("organization-form").reset();
  $('#add-organization-form').modal('toggle');
});

});
/**
 * Populates 'Category' field choices
 * @param range of values
 */
function listCategories(range, selector='#project-category') {

  var categorySelect = $(selector);
  var i;
  for (i = 0; i < range.values.length; i++) {
    var row = range.values[i];
    if( row[0] != 'Title' ){
      $(categorySelect).append($('<option>', {
          value: row[0],
          text: row[0]
      }));
    }
  }
}

/**
 * Populates organization's 'Category' field choices
 * @param range of values
 */
function listOrgCategories(range){
  listCategories(range, '#organization-category');
}
