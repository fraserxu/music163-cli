#!/usr/bin/env node
var minimist = require('minimist')
var api = require('music163')
var fs = require('fs')
var path = require('path')
var hyperquest = require('hyperquest')
var lame = require('lame')
var Speaker = require('speaker')
var mkdirp = require('mkdirp')
var chalk = require('chalk')

var argv = minimist(process.argv.slice(2))
var HOME = process.env.HOME || process.env.USERPROFILE;

if (argv.h) usage(0)
else if (argv._[0] === 'search') {
  if (!argv._[1]) return error('Please add a keyword for search.')
  var keyword = argv._[1]
  api.search(keyword, function(err, res) {
    if (err) return error(err)
    var data = res.result

    console.log(chalk.inverse.bold('Artists'))
    if (data.artists) {
      data.artists.forEach(function(artist) {
        console.log(artist.name + chalk.blue.italic(' ID: ') + artist.id)
      })
    }
    console.log()

    console.log(chalk.inverse.bold('Albums'))
    if (data.albums) {
      data.albums.forEach(function(album) {
        console.log(album.name + chalk.blue.italic(' by ') + album.artist.name + chalk.blue.italic(' ID: ') + album.id)
      })
    }
    console.log()

    console.log(chalk.inverse.bold('Playlists'))
    data.playlists.forEach(function(playlist) {
      console.log(playlist.name + chalk.blue.italic(' created by ') + playlist.creator.nickname + chalk.blue.italic(' ID: ') + playlist.id)
    })
    console.log()

    console.log(chalk.inverse.bold('Songs'))
    if (data.songs) {
      data.songs.forEach(function(song) {
        console.log(song.name + chalk.blue.italic(' by ') + song.artists[0].name + chalk.blue.italic(' ID: ') + song.id)
      })
    }
  })
} else if (argv._[0] === 'album') {
  if (!argv._[1]) return error('Please add a album ID.')
  var id = argv._[1]
  api.album(id, function(err, res) {
    if (err) return error(err)
    console.log('Album "' + res.album.name + '" by "' + res.album.artist.name + '" list: ')
    res.album.songs.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ' ID: ' + song.id)
    })
  })
} else if (argv._[0] === 'playlist') {
  if (!argv._[1]) return error('Please add a playlist ID.')
  var id = argv._[1]
  api.playlist(id, function(err, res) {
    if (err) return error(err)
    console.log('Playlist by "' + res.result.creator.nickname + '" List: ')
    res.result.tracks.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ' ID: ' + song.id)
    })
  })
} else if (argv._[0] === 'dj') {
  if (!argv._[1]) return error('Please add a dj ID.')
  var id = argv._[1]
  api.dj(id, function(err, res) {
    if (err) return error(err)
    console.log('DJ by "' + res.program.dj.nickname + '" List: ')
    res.program.songs.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ': ' + song.mp3Url)
    })
  })
} else if (argv._[0] === 'detail') {
  if (!argv._[1]) return error('Please add a song ID.')
  var id = argv._[1]
  api.detail(id, function(err, res) {
    if (err) return error(err)
    if (res.songs) {
      res.songs.forEach(function(song) {
        console.log('Song info: ' + song.artists[0].name + ' by ' + song.name + ' ' + song.mp3Url)
      })
    }
  })
} else if (argv._[0] === 'play') {
  if (argv._.length < 2) return error('please set the type you want to play by \"-t TYPE \"')

  var id = argv._[1]
  var type = argv.type || argv.t

  getList(id, type, function(err, songs) {
    if (err) return error(err)
    playList(songs, function() {
      console.log(chalk.green('Finish playing all the songs.'))
    })
  })
} else if (argv._[0] === 'download') {
  if (argv._.length < 2) return error('please set the type you want to play by \"-t TYPE \"')

  var id = argv._[1]
  var type = argv.type || argv.t
  var dist = argv.dist || argv.d

  getList(id, type, function(err, songs, dir) {
    if (err) return error(err)
    download(songs, dist, dir)
  })
} else usage(1)

function usage(code) {
  var rs = fs.createReadStream(__dirname + '/usage.txt')
  rs.pipe(process.stdout)
  rs.on('close', function() {
    if (code) process.exit(code)
  })
}

function getList(id, type, cb) {
  var songs = []

  if (type === 'album') {
    api.album(id, function(err, res) {
      if (err) cb(err)
      var name = res.album.name
      res.album.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      cb(null, songs, name)
    })
  } else if (type === 'playlist') {
    api.playlist(id, function(err, res) {
      if (err) cb(err)
      var name = res.result.name
      res.result.tracks.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      cb(null, songs, name)
    })
  } else if (type === 'dj') {
    api.dj(id, function(err, res) {
      if (err) cb(err)
      var name = res.program.name
      res.program.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      cb(null, songs, name)
    })
  } else if (type === 'detail') {
    api.detail(id, function(err, res) {
      if (err) cb(err)
      res.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      cb(null, songs)
    })
  }
}

function playList(songs, cb) {
  eachSeries(songs, play, function(err) {
    if (err) return error(err)
    cb(null)
  })
}

function play(song, cb) {
  console.log(chalk.blue('Start playing song: ') + song.name + '.')
  var request = hyperquest.get(song.src)
    .pipe(new lame.Decoder())
    .pipe(new Speaker())
    .on('finish', function () {
      console.log(chalk.blue('Finished playing song: ') + song.name + '.')
      cb(null)
    })

  request.on('error', function (res) {
    error('There\'s an error while trying to play song:' + song.name + '.' )
    cb(new Error(res))
  })
}

// ported from the async library
// https://github.com/caolan/async/blob/master/lib/async.js#L127
function eachSeries(arr, iterator, callback) {
  callback = callback || function () {}
  if (!arr.length) {
    return callback()
  }
  var completed = 0
  var iterate = function () {
    iterator(arr[completed], function (err) {
      if (err) {
          callback(err)
          callback = function () {}
      } else {
        completed += 1
        if (completed >= arr.length) {
          callback(null)
        }
        else {
          iterate()
        }
      }
    })
  }
  iterate()
}

function download(songs, dist, dir) {
  var dirName = path.join(HOME, dist, dir)

  mkdirp(dirName, function(err) {
    if (err) return error(err)
    console.log(chalk.blue('Created folder: ', dirName))

    songs.forEach(function(song) {
      var request = hyperquest.get(song.src)
      var file = fs.createWriteStream(path.join(dirName, song.name) + '.mp3')

      request.on('response', function (res) {
        console.log(chalk.blue('Start to download song: ' + song.name + '.'))
      })

      request.on('error', function (res) {
        console.log(chalk.red('There\'s an error while trying to download song:' + song.name + '.'))
      })

      request.on('data', function(data) {
        file.write(data)
      })

      request.on('end', function() {
        console.log(chalk.blue('Finish downloading song: ' + song.name + '.'))
      })

      file.on('error', function(err) {
        error(err)
      })
    })

  })
}

function error (err) {
  if (!err) return
  console.error(chalk.red(String(err)))
  process.exit(1)
}
