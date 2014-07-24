var RandomNumbers = require('./stream-01-readable.js'),
  Logger = require('./stream-02-writable.js'),
  Transform = require('stream').Transform;

function Noop (index) {
  Transform.call(this);
  this.index = index.toString() || 'no index defined';
}

Noop.prototype = Object.create(Transform.prototype);

Noop.prototype._transform = function (chunk, encoding, done) {
  console.log('i: ' + this.index + ' |', chunk.toString('ascii'));
  this.push(chunk);
  done();
};

random = new RandomNumbers();

network = current_stream = new require('stream').PassThrough();

for (var i = 0; i < 5; i += 1) {
  current_stream = current_stream.pipe(new Noop(i));
}

random
  .pipe(network)
  .pipe(new Logger());