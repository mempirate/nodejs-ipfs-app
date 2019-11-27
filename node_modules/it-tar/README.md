# it-tar

[![build status](https://travis-ci.org/alanshaw/it-tar.svg?branch=master)](http://travis-ci.org/alanshaw/it-tar)
[![dependencies Status](https://david-dm.org/alanshaw/it-tar/status.svg)](https://david-dm.org/alanshaw/it-tar)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> it-tar is a streaming tar parser (and maybe a generator in the future) and nothing else. It operates purely using async iterables which means you can easily extract/parse tarballs without ever hitting the file system.
> Note that you still need to gunzip your data if you have a `.tar.gz`.

## Install

```sh
npm install it-tar
```

## Usage

`it-tar` currently only [extracts](#extracts) tarballs. Please send a PR to add packing!

It implementes USTAR with additional support for pax extended headers. It should be compatible with all popular tar distributions out there (gnutar, bsdtar etc)

### Packing

> TBD

### Extracting

To extract a stream use `tar.extract()` and pipe a [source iterable](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#source-it) to it.

``` js
const Tar = require('it-tar')
const pipe = require('it-pipe')

await pipe(
  source, // An async iterable (for example a Node.js readable stream)
  Tar.extract(),
  source => {
    for await (const entry of source) {
      // entry.header is the tar header (see below)
      // entry.body is the content body (might be an empty async iterable)
      for await (const data of entry.body) {
        // do something with the data
      }
    }
    // all entries read
  }
)
```

The tar archive is streamed sequentially, meaning you **must** drain each entry's body as you get them or else the main extract stream will receive backpressure and stop reading.

Note that the body stream yields [`BufferList`](https://npm.im/bl) objects **not** `Buffer`s.

#### Headers

The header object using in `entry` should contain the following properties.
Most of these values can be found by stat'ing a file.

```js
{
  name: 'path/to/this/entry.txt',
  size: 1314,        // entry size. defaults to 0
  mode: 0644,        // entry mode. defaults to to 0755 for dirs and 0644 otherwise
  mtime: new Date(), // last modified date for entry. defaults to now.
  type: 'file',      // type of entry. defaults to file. can be:
                     // file | link | symlink | directory | block-device
                     // character-device | fifo | contiguous-file
  linkname: 'path',  // linked file name
  uid: 0,            // uid of entry owner. defaults to 0
  gid: 0,            // gid of entry owner. defaults to 0
  uname: 'maf',      // uname of entry owner. defaults to null
  gname: 'staff',    // gname of entry owner. defaults to null
  devmajor: 0,       // device major version. defaults to 0
  devminor: 0        // device minor version. defaults to 0
}
```

## Related

* [`it-pipe`](https://www.npmjs.com/package/it-pipe) Utility to "pipe" async iterables together
* [`it-reader`](https://www.npmjs.com/package/it-reader) Read an exact number of bytes from a binary (async) iterable

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/it-tar/issues/new) or submit PRs.

## License

[MIT](LICENSE)
