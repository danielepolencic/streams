var RandomNumbers = require('./stream-01-readable.js')
  , Logger = require('./stream-02-writable.js')
  , Transform = require('stream').Transform;

function Even () {
  Transform.call(this);
}

Even.prototype = Object.create(Transform.prototype);

Even.prototype._transform = function (chunk, encoding, done) {
  var number = parseInt(chunk.toString('ascii'), 10);
  this.push(number % 2 === 0 ? number + '' : '');
  done();
};

function Odd () {
  Transform.call(this);
}

Odd.prototype = Object.create(Transform.prototype);

Odd.prototype._transform = function (chunk, encoding, done) {
  var number = parseInt(chunk.toString('ascii'), 10);
  this.push(number % 2 !== 0 ? number + '' : '');
  done();
};

var random = new RandomNumbers();
var odd = new Odd();
var even = new Even();

random
  .pipe(new Logger('random:'));

random
  .pipe(odd)
  .pipe(new Logger('odd:'));

random
  .pipe(even)
  .pipe(new Logger('even:'));