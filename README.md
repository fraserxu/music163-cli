music163-client
========

This is the client for music163

Install
---
The easiest way to use music163-client is to install it with npm: `npm install music163-client`

API
---
Currently, there's only three (useful) methods available:

```javascript
play: function(id)
```

```javascript
download: function(id, path)
```

Example
-------
```javascript
var player = require('..')

// play
player.play(233931);

// download
player.download(233931);
```

#### Note: Please only download the song when you have legal copyright to it.