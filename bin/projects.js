var downloadFile = require('download-file')
var fs = require('fs-extra')
var Papa = require('papaparse')

var utils = require('./utils')

var args = process.argv.slice(2);
switch (args[0]) {
  case '--download':
    download()
    break
  case '--publish':
    publish()
    break
  default:
    create_projects()
}



// Download the datas
function download() {
  console.log('Download started')
  var files = [
    {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4gM-ByCoxuTAlX4qtRHn05IfPgjBB_pPk6aGfjkRFhYl_IFx9__s9NUfxJKnj3HvtkIWhBvoMLLei/pub?gid=297467500&single=true&output=csv',
      filename: 'categories.csv'
    },
    {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4gM-ByCoxuTAlX4qtRHn05IfPgjBB_pPk6aGfjkRFhYl_IFx9__s9NUfxJKnj3HvtkIWhBvoMLLei/pub?gid=0&single=true&output=csv',
      filename: 'projects.csv'
    },
    {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4gM-ByCoxuTAlX4qtRHn05IfPgjBB_pPk6aGfjkRFhYl_IFx9__s9NUfxJKnj3HvtkIWhBvoMLLei/pub?gid=577365421&single=true&output=csv',
      filename: 'organisations.csv'
    }
  ]

  for (var i = files.length - 1; i >= 0; i--) {
    var options = {
      directory: './dist/_data/',
      filename: files[i].filename
    }
    downloadFile(files[i].url, options, function(files, i, err){
      if (err) throw err

      console.log('Download complete - ' + files[i].filename )
      if (files[i].filename == 'projects.csv'){
        create_projects()
      }
    }(files, i))
  }
  
}


// Create the projects' files
function create_projects() {

  console.log('Processing projects.')

  var data_url = './dist/_data/projects.csv'

  fs.readFile(data_url, 'utf8', function (err, data) {

    if (err) throw err

    // Clean the projects folder first
    fs.emptyDirSync('./src/_projects')

    var projects = Papa.parse(data, {'header': true}).data

    // create the files
    for (var i = 0; i <= projects.length - 1; i++) {
      var content = ''

      content = '---\n'

      content += 'layout: item\n'
      content += 'body_class: item\n'

      content += 'title: ' + projects[i].Name + '\n'
      content += 'countries: ' + projects[i].Country + '\n'
      content += 'category: ' + projects[i].Category + '\n'
      content += 'site_url: ' + projects[i].Url + '\n'
      content += 'github_url: ' + projects[i].Github + '\n'
      content += 'related: ' + projects[i].Related + '\n'
      content += 'description: >\n  ' + projects[i].Description.replace('\n', '\n  ') + '\n'
      
      content += '---\n'

      fs.outputFileSync('./dist/_projects/' + utils.slugify(projects[i].Name) + '.md', content)
      
    }

    console.log('Finished processing ' + projects.length + ' projects.')
  })
}


// Publish to gh-pages
function publish() {
  console.log('Starting Github Pages publish...')
  var ghpages = require('gh-pages')
  ghpages.publish('dist', function(err) {
    if (err) throw err
    console.log('Completed Github pages publish.')
  });
}

