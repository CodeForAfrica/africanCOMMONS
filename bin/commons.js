var fs = require('fs-extra')

var downloadFile = require('download-file')
var Papa = require('papaparse')

var utils = require('./utils')

var args = process.argv.slice(2)
switch (args[0]) {
  case '--download':
    download()
    break
  case '--publish':
    publish()
    break
  default:
    createProjects()
    createOrgs()
    createUsers()
}

// Download the data
function download () {
  console.log('Downloads started')
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
    },
    {
      url: 'https://raw.githubusercontent.com/HacksHackersAfrica/github-africa/master/step4.json',
      filename: 'users.json'
    }
  ]

  for (var i = files.length - 1; i >= 0; i--) {
    console.log('Downloading ' + files[i].filename)
    var options = {
      directory: './dist/_data',
      filename: files[i].filename
    }
    downloadFile(files[i].url, options, function (err, path) {
      if (err) throw err
      console.log('Download complete - ' + path)

      // TODO: Until we figure out files.pipe callback, this will be run separately.
      // switch (path) {
      //   case options.directory + '/projects.csv':
      //     create_projects()
      //     break
      //   case options.directory + '/users.json':
      //     create_users()
      //     break
      //   case options.directory + '/organisations.csv':
      //     create_orgs()
      //     break
      // }
    })
  }
}

// Create the projects' files
function createProjects () {
  console.log('Processing projects.')

  var data = fs.readFileSync('./dist/_data/projects.csv', 'utf8')

  // Clean the projects folder first
  fs.emptyDirSync('./dist/_projects')

  var projects = Papa.parse(data, {'header': true}).data

  // create the files
  for (var i = 0; i <= projects.length - 1; i++) {
    var content = ''

    content = '---\n'

    content += 'layout: item\n'
    content += 'body_class: item\n'

    content += 'title: ' + projects[i]['PROJECT NAME'] + '\n'
    content += 'origin: ' + projects[i]['ORIGIN COUNTRY'] + '\n'
    content += 'countries: ' + projects[i]['COUNTRIES WHERE DEPLOYED'] + '\n'
    content += 'category: ' + projects[i]['CATEGORY'] + '\n'
    content += 'site_url: ' + projects[i]['PROJECT WEBSITE'] + '\n'
    content += 'github_url: ' + projects[i]['PROJECT GITHUB REPO'] + '\n'
    content += 'related: ' + projects[i]['RELATED PROJECTS'] + '\n'
    content += 'organisations: ' + projects[i]['ORGANISATIONS'] + '\n'
    content += 'description: >\n  ' + projects[i]['PROJECT DESCRIPTION'].replace('\n', '\n  ') + '\n'

    content += '---\n'

    fs.outputFileSync('./dist/_projects/' + utils.slugify(projects[i]['PROJECT NAME']) + '.md', content)
  }

  console.log('Finished processing ' + projects.length + ' projects.')
}

// Create the organisations' files
function createOrgs () {
  console.log('Processing organisations.')

  var data = fs.readFileSync('./dist/_data/organisations.csv', 'utf8')

  // Clean the organisations folder first
  fs.emptyDirSync('./dist/_organisations')

  var orgs = Papa.parse(data, {'header': true}).data

  // create the files
  for (var i = 0; i <= orgs.length - 1; i++) {
    var content = ''

    content = '---\n'

    content += 'layout: item\n'
    content += 'body_class: item\n'

    content += 'title: ' + orgs[i].Name + '\n'
    content += 'countries: ' + orgs[i].Country + '\n'
    content += 'category: ' + orgs[i].Category + '\n'
    content += 'site_url: ' + orgs[i].Url + '\n'
    content += 'github_url: ' + orgs[i].Github + '\n'
    content += 'related: ' + orgs[i].Related + '\n'
    content += 'description: >\n  ' + orgs[i].Description.replace('\n', '\n  ') + '\n'

    content += '---\n'

    fs.outputFileSync('./dist/_organisations/' + utils.slugify(orgs[i].Name) + '.md', content)
  }

  console.log('Finished processing ' + orgs.length + ' organisations.')
}

// Create Users CSV
function createUsers () {
  console.log('Processing users.')

  // Move file because of UTF8 issues with Jekyll
  var fileToMove = './dist/_data/users.json'
  var filePath = './dist/js/data/users.json'
  if (fs.existsSync(fileToMove)) {
    fs.removeSync(filePath)
    fs.moveSync(fileToMove, filePath)
  }

  var users = fs.readJsonSync(filePath)

  // Shuffle the users for save into CSV and use in front page
  users = utils.shuffleArray(users)

  // Save to CSV
  fs.outputFileSync('./dist/_data/users.csv', Papa.unparse(users))

  console.log('Finished processing ' + users.length + ' users.')
}

// Publish to gh-pages
function publish () {
  console.log('Starting Github Pages publish...')
  var ghpages = require('gh-pages')
  ghpages.publish('dist', function (err) {
    if (err) throw err
    console.log('Completed Github pages publish.')
  })
}
