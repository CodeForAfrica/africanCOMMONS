$(document).ready(function(){


$('.pattern').on('click', function(e){

  // Facebook App ID config
  var fbAppId = '200110850534528';
  var url = 'https://commons.africa/';
  var redirectUri = 'https://commons.africa/';

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
    redirectUri = 'http://localhost:4000/';
  }

  var title = $(this).data('pattern-title');
  var tagline = $(this).data('pattern-tagline');
  var tags = $(this).data('pattern-tags');
  var network = $(this).data('pattern-network');
  tags = '#' + tags;

  switch (network) {

    case 'facebook-share':
        VanillaSharing.fbShare({
          url: url,
          redirectUri: redirectUri,
          hashtag: tags,
          quote: tagline,
          fbAppId: fbAppId ,
        });
      break;
    case 'facebook-like':
        VanillaSharing.fbFeed({
          url: url,
          redirectUri: redirectUri,
          fbAppId: fbAppId
        });
    break;
    case 'twitter':
        VanillaSharing.tw({
          url: url,
          title: title + tags,
      });
    break;
    default:
  }

  return false;
  });


});
