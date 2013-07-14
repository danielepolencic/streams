var RandomNumbers = require('./stream-01-readable.js'),
    Logger = require('./stream-02-writable.js'),
    stream = require('stream'),

    random,
    odd,
    even;

function Even(){
  stream.Transform.call(this);
}

Even.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Even }} );

Even.prototype._transform = function( chunk, encoding, done ){
  var number = parseInt(chunk.toString('ascii'), 10);
  this.push( number % 2 === 0 ? number + '' : '' );
  done();
}

function Odd(){
  stream.Transform.call(this);
}

Odd.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Odd } } );

Odd.prototype._transform = function( chunk, encoding, done ){
  var number = parseInt(chunk.toString('ascii'), 10);
  this.push( number % 2 !== 0 ? number + '' : '' );
  done();
}

random = new RandomNumbers();
odd = new Odd();
even = new Even();

random
  .pipe( new Logger('random:') );

random
  .pipe(odd)
  .pipe( new Logger('odd:') );

random
  .pipe(even)
  .pipe( new Logger('even:') );
