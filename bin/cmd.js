#!/usr/bin/env node

var minimist = require('minimist')
var api = require('music163')
var Player = require('player')
var fs = require('fs')

var argv = minimist(process.argv.slice(2))

if (argv.h) usage(0)
else if (argv._[0] === 'search') {
  var keyword = argv._[1]
  api.search(keyword, function(err, res) {
    if (err) console.log(err)
    var data = res.result
    console.log('artists', data.artists)
    console.log()
    console.log('albums')
    data.albums.forEach(function(album) {
      console.log(album.name + ' by ' + album.artist.name)
    })
    console.log()
    console.log('playlists')
    data.playlists.forEach(function(playlist) {
      console.log(playlist.name + ' created by ' + playlist.creator.nickname)
    })
    console.log()
    console.log('songs')
    data.songs.forEach(function(song) {
      console.log(song.name)
    })
  })
} else if (argv._[0] === 'album') {
  var id = argv._[1]
  api.album(id, function(err, res) {
    if (err) console.log(err)
    console.log('Album "' + res.album.name + '" by "' + res.album.artist.name + '" list: ')
    res.album.songs.forEach(function(song) {
      console.log(song.name + ': ' + song.mp3Url)
    })
  })
} else if (argv._[0] === 'playlist') {
  var id = argv._[1]
  api.playlist(id, function(err, res) {
    if (err) console.log(err)
    console.log('Playlist by "' + res.result.creator.nickname + '" List: ')
    res.result.tracks.forEach(function(song) {
      console.log(song.name + ': ' + song.mp3Url)
    })
  })
} else if (argv._[0] === 'dj') {
  var id = argv._[1]
  api.dj(id, function(err, res) {
    if (err) console.log(err)
    console.log('DJ by "' + res.program.dj.nickname + '" List: ')
    res.program.songs.forEach(function(song) {
      console.log(song.name + ': ' + song.mp3Url)
    })
  })
} else if (argv._[0] === 'detail') {
  var id = argv._[1]
  api.detail(id, function(err, res) {
    if (err) console.log(err)
    console.log('song info: ', res)
  })
} else if (argv._[0] === 'play') {
  var id = argv._[1]
  var type = argv.type || argv.t
  var songs = []

  if (type === 'album') {
    api.album(id, function(err, res) {
      if (err) console.log(err)
      res.album.songs.forEach(function(song) {
        songs.push(song.mp3Url)
      })
    })
  } else if (type === 'playlist') {
    api.playlist(id, function(err, res) {
      if (err) console.log(err)
      res.result.tracks.forEach(function(song) {
        songs.push(song.mp3Url)
      })
    })
  } else if (type === 'dj') {
    api.dj(id, function(err, res) {
      if (err) console.log(err)
      res.program.songs.forEach(function(song) {
        songs.push(song.mp3Url)
      })
    })
  } else if (type === 'detail') {
    api.detail(id, function(err, res) {
      if (err) console.log(err)
      console.log('song info: ', res)
    })
  }

  var player = new Player(songs)
  player.play()

  player.on('playing', function(item) {
    console.log('im playing... src:' + item)
  })

  player.on('playend', function(item) {
    console.log('src:' + item + ' play done, switching to next one ...')
  })

  player.on('error', function(err) {
    console.log(err)
  })
} else if (argv._[0] === 'download') {
  console.log('to be added...')
} else usage(1)

function usage(code) {
  var rs = fs.createReadStream(__dirname + '/usage.txt')
  rs.pipe(process.stdout)
  rs.on('close', function() {
    if (code) process.exit(code)
  })
}