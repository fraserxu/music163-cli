var music163 = require('music163')
var hyperquest = require('hyperquest')
var lame = require('lame')
var Speaker = require('speaker')
var fs = require('fs')

module.exports = {
  play: function(id) {
    music163.detail(id, function(err, res) {
      if(err) throw err

      var uri = res.songs[0].mp3Url
      hyperquest(uri)
        .pipe(new lame.Decoder())
        .pipe(new Speaker())
        .on('end', function() {
          console.log('Finished playing.')
        })
    })
  },

  download: function(id, path) {
    music163.detail(id, function(err, res) {
      if(err) throw err
      if(!res.songs.length) throw new Error('song not found')

      var uri = res.songs[0].mp3Url
      var filename = res.songs[0].name
      var filepath = path || ''

      hyperquest(uri)
        .pipe(fs.createWriteStream(filepath + filename + '.mp3'))
        .on('end', function() {
          console.log('Song: ' + filename + '.mp3 download success.' )
        })
    })
  }

}