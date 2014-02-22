music163-cli
========

A command line player to play cloud music from [music163](http://music.163.com/)

> NetEase Cloud Music is equipped with what the co touts as an industry-leading music library in terms of song coverage and sound quality. Users have access to more than 1m songs streamed at up to 320kbit/s (the broadly accepted upper bound for MP3 sound quality), which are moreover free of charge.

# example

To search by keyword , type `music163 search "whatever"`:

```
$ music163 search "Red Hot Chili Peppers"

Artists
Red Hot Chili Peppers ID: 41927

Albums
Red Hot Chili Peppers by Red Hot Chili Peppers ID: 1985328
Best of Red Hot Chili Peppers [Collectables] by Red Hot Chili Peppers ID: 188755

Playlists
Red Hot Chili Peppers Collections created by 李和樸 ID: 3463282

Songs
Snow (Hey Oh) ID: 1869719
Red Hot Chili Peppers - Higher Ground. ID: 26691377
Snow ID: 26225815
Havana Affair - Red Hot Chili Peppers ID: 5201198
```

And then you can play different types of list by add `-t TYPE`

```
$ music163 play -t playlist 3406713
$ music163 play -t album 506627
```

Or you want to get the list of an album:
```
$ music163 album 506627

Album "Ultimate Grammy Collection: Classic Country" by "Various Artists" list:
Roger Miller - King Of The Road ID: 5159433

...

Dolly Parton - 9 To 5 ID: 5159447
Willie Nelson - Always On My Mind ID: 5159448
```

And even download.
```
$ music163 download -t playlist 5159448
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

