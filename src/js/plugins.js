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

  $('[data-toggle="tooltip"]').tooltip()

  $('.pattern').on('click', function (e) {
    // Facebook App ID config
    var fbAppId = '200110850534528'

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

    return false
  })
})
