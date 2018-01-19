// Utilities

module.exports = {

  // Turn anything into slug
  slugify: function (text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')         // Replace spaces with -
      .replace(/[^\w-]+/g, '')      // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')           // Trim - from start of text
      .replace(/-+$/, '')           // Trim - from end of text
  },

  // Encode any string to utf8
  encode_utf8: function (s) {
    return unescape(encodeURIComponent(s))
  },

  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   * https://stackoverflow.com/a/12646864/1298144
   */
  shuffleArray: function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },

  // Create a grouped array
  createGroupedArray: function (arr, chunkSize) {
    var groups = []
    var i = 0
    for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize))
    }
    return groups
  }

}
