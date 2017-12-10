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
  if (location.hash === '#all' || location.hash === '') {
    showAll()
  } else {
    filterCategory(location.hash.substr(1))
  }
}

window.onhashchange = locationHashChanged

window.onload = function () {
  locationHashChanged()
}
