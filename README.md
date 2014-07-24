# Streams playground
Suppose that you need to zip a 50GB Blue-ray disc so you can save space on your hard drive. You could write something like this:

```js
var fs = require('fs');
var zlib = require('zlib');
var movie = fs.readFileSync('movie.img');

zlib.gzip(movie, function (err, buffer) {
  fs.writeFileSync('movie.img.zip', buffer);
})
```

The code works, but half way through the program crashes because it can't hold 50GB in memory. You two options: buy A LOT of RAM or slice the 50GB in chunks small enough to be hold in memory, zip and save them on disk. The latter is what streams are all about: you read and process stream of data chunk by chunk as they come in. Let's rewrite the example above using streams:

```js
var fs = require('fs');
var zip = require('zlib').createGzip();
var movie = fs.createReadStream('movie.img');

movie.pipe(zip).pipe(fs.createWritableStream('movie.img.zip'));
```

The program doesn't crash half way through and the image is correctly zipped on your disk, isn't that awesome?
Stream are basically pipes. They can be readable, writable or both and are easy to reason about -- you can pipe a readable stream to a writable stream by doing `input.pipe(output)`. 
The `pipe` method connects an input to an output, automatically managing the flow so that the destination is not overwhelmed by a fast source.

## Readable
A readable stream is a stream that provides an output. Data can be pushed through the stream using the `push` method.

```js
var Readable = require('stream').Readable;

var rs = Readable();
rs.push('1');
rs.push('2');
rs.push(null);
```

When subclassing `Readable`, the `_read` method has to be overwritten.

```js
var Readable = require('stream').Readable;

function MyReadable () {
  Readable.call(this);
}

MyReadable.prototype._read = function (size) {
  /* code */
  this.push('1');
  /* more code */
};
```

### Strings and Buffers
The push method accepts only Buffers or Strings (* and objects, but more on these later).

## Writable
A writable stream is a stream that consumes an input (readable and writeable
streams are duals).

```js
var Writable = require('stream').Writable;

var ws = Writable();

ws._write = function (chunk, encoding, done) {
  console.log(chunk);
  done();
};
```

When subclassing `Writable`, the `_write` method has to be overwritten.

```js
var Writable = require('stream').Writable;

function MyWritable () {
  Writable.call(this);
}

MyWritable.prototype._write = function (chunk, encoding, done) {
  console.log(chunk);
  done();
};
```

## Pipe
The readable stream can be connected to a writable stream using the `.pipe` method.

```js
  var source = new ReadableStream();
  var drain = new WritableStream();

  source.pipe(drain);
```

A redable stream can accept any number of consumers (writable) streams:

```js
  var source = new ReadableStream();
  var drain = new WritableStream();

  source.pipe(drain);
  source.pipe(process.stdout);
```

## Transform
A stream that simoultaneously provides an output and accepts an input is called
`Transform` stream. This stream inherits from both `Readable` and `Writable`, hence has the `push` method to push element in the stream and the `_transform` method to consume an input (which is equivalent to `_write`).

```js
var Transform = require('stream').Transform;

var ts = Transform();

ts._transform = function (chunk, encoding, done) {
  console.log(chunk);
  this.push('1');
  done();
};
```

When subclassing `Transform`, the `_tranform` method has to be overwritten. You can push data with the `push` method.

```js
var Transform = require('stream').Transform;

function MyTransform () {
  Transform.call(this);
}

MyTransform.prototype._transform = function (chunk, encoding, done) {
  console.log(chunk);
  this.push('1');
  done();
};
```

## Splitter
Two transform streams connected to the same input can act as a splitter.

```js
var Transform = require('stream').Transform;
var Readable = require('stream').Readable;

var even = Transform();
var odd = Transform();
var rand = Readable();

rand._read = function () {};

rand.push('1');
rand.push('2');

odd._transform = function (chunk, encoding, done) {
  if (Number(chunk) % 2) this.push(chunk);
  done();
};

even._transform = function (chunk, encoding, done) {
  if (!(Number(chunk) % 2)) this.push(chunk);
  done();
};

// rand.pipe(odd).pipe(process.stdout);
rand.pipe(even).pipe(process.stdout);
```

## Mixer
Two streams that provide an output can both connect to a third stream, which acts
as a mixer.

```js
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

var mixer = Writable();
var randEven = Readable();
var randOdd = Readable();

randEven._read = randOdd._read = function () {};

randOdd.push('1');
randEven.push('2');

mixer._write = function (chunk, encoding, done) {
  console.log('mixer: ', chunk.toString('utf-8'));
  done();
};

randOdd.pipe(mixer);
randEven.pipe(mixer);
```

## Loop
Looping through streams can be easily achieved by remembering that the `.pipe`
operation always returns the destination stream.

```js
var Transform = require('stream').Transform;
var Readable = require('stream').Readable;

var rand = Readable();

rand._read = function () {};

function Tap (index) {
  Transform.call(this);
  this.index = index;
}

Tap.prototype = Object.create(Transform.prototype);

Tap.prototype._transform = function (chunk, encoding, done) {
  console.log(this.index, ': ', chunk.toString('utf-8'));
  this.push(chunk);
  done();
};

var currentStream = rand;

for (var i = 0; i < 5; i += 1) {
  currentStream = currentStream.pipe(new Tap(i));
}

rand.push('1');
```

## ObjectMode
In Node.js v0.10.6 readable streams support the boolean flag `objectMode`, which
 instructs the stream to use objects rather than `Buffer`s or `String`s.

```js
var Readable = require('stream').Readable;

var rs = Readable({objectMode: true});
rs.push({number: 1});
rs.push({number: 2});
rs.push(null);
```

A very simple hack is necessary for Writable streams, though [1](https://github.com/joyent/node/issues/5377).

## Useful resources
- [substack's stream-handbook](https://github.com/substack/stream-handbook)
- [An Introduction to Node's New Streams](http://calv.info/an-introduction-to-nodes-new-streams/)