var $ = require('jquery')

function showAll () {
  $('.item.card').show()
  $('.category-btn').removeClass('active')
}

function filterCategory (category) {
  showAll()
  $('.item.card[data-category!="' + category + '"]').hide()
  $('.category-btn[href="#' + category + '"]').addClass('active')
  $('.category-btn.active').click(function () {
    showAll()
  })
}

function locationHashChanged () {
  if (window.location.hash === '#all' || window.location.hash === '') {
    showAll()
  } else {
    filterCategory(window.location.hash.substr(1))
  }
}

window.onhashchange = locationHashChanged

window.onload = function () {
  locationHashChanged()
}
