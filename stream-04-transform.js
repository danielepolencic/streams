var RandomNumbers = require('./stream-01-readable.js')
  , Logger = require('./stream-02-writable.js')
  , Transform = require('stream').Transform;

function Square () {
  Transform.call(this);
}

Square.prototype = Object.create(Transform.prototype);

Square.prototype._transform = function (chunk, encoding, done) {
  var number = parseInt(chunk.toString('ascii'), 10);
  this.push((number * number) + "");
  done();
};

var random = new RandomNumbers();
var logger = new Logger();
var square = new Square();

random
  .pipe(logger);

random
  .pipe(square)
  .pipe(logger);