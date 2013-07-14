var RandomNumbers = require('./stream-01-readable.js'),
    Logger = require('./stream-02-writable.js'),
    stream = require('stream'),

    random,
    odd,
    even,
    pool;

function Even(){
  stream.Transform.call(this);
}

Even.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Even } } );

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

function Pool(){
  stream.Transform.call(this);
}

Pool.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Pool } } );

Pool.prototype._transform = function( chunk, encoding, done ){
  this.push( chunk );
  done();
}

random = new RandomNumbers();
odd = new Odd();
even = new Even();
pool = new Pool();

random
  .pipe(odd)
  .pipe(pool)

random
  .pipe(even)
  .pipe(pool)

odd
  .pipe( new Logger('odd:') )

even
  .pipe( new Logger('even:') )

pool
  .pipe( new Logger('pool:') )
