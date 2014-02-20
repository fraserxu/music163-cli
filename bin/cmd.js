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

    console.log('Artists')
    if (data.artists) {
      data.artists.forEach(function(artist) {
        console.log(artist.name + ' ID: ' + artist.id)
      })
    }
    console.log()

    console.log('Albums')
    if (data.albums) {
      data.albums.forEach(function(album) {
        console.log(album.name + ' by ' + album.artist.name + ' ID: ' + album.id)
      })
    }
    console.log()

    console.log('Playlists')
    data.playlists.forEach(function(playlist) {
      console.log(playlist.name + ' created by ' + playlist.creator.nickname + ' ID: ' + playlist.id)
    })
    console.log()

    console.log('Songs')
    if (data.songs) {
      data.songs.forEach(function(song) {
        console.log(song.name + ' ID: ' + song.id)
      })
    }
  })
} else if (argv._[0] === 'album') {
  var id = argv._[1]
  api.album(id, function(err, res) {
    if (err) console.log(err)
    console.log('Album "' + res.album.name + '" by "' + res.album.artist.name + '" list: ')
    res.album.songs.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ' ID: ' + song.id)
    })
  })
} else if (argv._[0] === 'playlist') {
  var id = argv._[1]
  api.playlist(id, function(err, res) {
    if (err) console.log(err)
    console.log('Playlist by "' + res.result.creator.nickname + '" List: ')
    res.result.tracks.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ' ID: ' + song.id)
    })
  })
} else if (argv._[0] === 'dj') {
  var id = argv._[1]
  api.dj(id, function(err, res) {
    if (err) console.log(err)
    console.log('DJ by "' + res.program.dj.nickname + '" List: ')
    res.program.songs.forEach(function(song) {
      console.log(song.artists[0].name + ' - ' + song.name + ': ' + song.mp3Url)
    })
  })
} else if (argv._[0] === 'detail') {
  var id = argv._[1]
  api.detail(id, function(err, res) {
    if (err) console.log(err)
    if (res.songs) {
      res.songs.forEach(function(song) {
        console.log('Song info: ' + song.artists[0].name + ' by ' + song.name + ' ' + song.mp3Url)
      })
    }
  })
} else if (argv._[0] === 'play') {
  if (argv._.length < 2) return console.error('please set the type you want to play by \"-t TYPE \"')

  var id = argv._[1]
  var type = argv.type || argv.t
  var songs = []

  if (type === 'album') {
    api.album(id, function(err, res) {
      if (err) console.log(err)
      res.album.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      play(songs)
    })
  } else if (type === 'playlist') {
    api.playlist(id, function(err, res) {
      if (err) console.log(err)
      res.result.tracks.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      play(songs)
    })
  } else if (type === 'dj') {
    api.dj(id, function(err, res) {
      if (err) console.log(err)
      res.program.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      play(songs)
    })
  } else if (type === 'detail') {
    api.detail(id, function(err, res) {
      if (err) console.log(err)
      res.songs.forEach(function(song) {
        songs.push({
          name: song.name,
          artist: song.artists[0].name,
          src: song.mp3Url
        })
      })
      play(songs)
    })
  }
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

function play(songs) {
  var player = new Player(songs)
  player.play(function(err, player){
    console.log('Done playing all the songs!')
  })

  player.on('playing', function(item) {
    console.log('Now playing ' + item.name + ' by ' + item.artist)
  })

  player.on('playend', function(item) {
    console.log('Song:' + item.name + ' play done, switching to next one ...')
  })

  player.on('error', function(err) {
    console.log(err)
  })
}