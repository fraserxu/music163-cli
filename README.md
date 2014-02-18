music163-cli
========

A command line client for music163

# example

To search by keyword , type `music163 search "whatever"`:

```
➜  music163-cli git:(master) music163 search "Red Hot Chili Peppers"
artists
Red Hot Chili Peppers ID: 41927

albums
Red Hot Chili Peppers by Red Hot Chili Peppers ID: 1985328
Best of Red Hot Chili Peppers [Collectables] by Red Hot Chili Peppers ID: 188755

playlists
Red Hot Chili Peppers Collections created by 李和樸 ID: 3463282

songs
Snow (Hey Oh) ID: 1869719
Red Hot Chili Peppers - Higher Ground. ID: 26691377
Snow ID: 26225815
Havana Affair - Red Hot Chili Peppers ID: 5201198
```

And then you can play different types of list by add `-t TYPE`

```
$ music163 play -t playlist 3406713
$ music163 play -t album xxxxxx
```

# usage

```
usage:

  music163 search KEYWORDS
    Search songs by keywords

  music163 play -t TYPE ID
    Play song by type and ID

  music163 album ID
    Get song list by album ID

  music163 playlist ID
    Get song list by playlist ID

  music163 dj ID
    Get song list by dj ID

  music163 detail ID
    Get song detail by ID

  music163 download -t TYPE ID
    Download song by type and ID

```

# install

With [npm](https://npmjs.org) do:

```
npm install -g music163-cli
```

to get the music163-cli command.

#### Note: <i>Please only download the song when you have legal copyright to it.</i>

# license

MIT

