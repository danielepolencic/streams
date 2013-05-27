// 1. Readable, Writable
// 2. Readable -> Writable + Readable -> Writable
// 3. Readable -> Duplex -> Writable (manual backpressure)
// 4. Readable -> Transform -> Writable ("automatic" backpressure)

// Writable -> Writable streams are streams that can accept input.
// Readable -> Readable streams are streams that can provide output. (dual)
// Duplex -> Duplex streams are streams that can accept and input and provide
// outputs


var stream = require('stream');

function RandomNumbers(){
  stream.Readable.call(this);
  this.name = 'RandomNumbers';
}

RandomNumbers.prototype = Object.create( stream.Readable.prototype, { constructor : { value : RandomNumbers } } );

RandomNumbers.prototype._read = function( size ){
  setTimeout( function(){
    this.push( ~~ (Math.random() * 10) + "" );
  }.bind(this), 500 )
}

function Logger(){
  stream.Writable.call(this);
  this.on('pipe', function(src){
    this.source = src.name || 'unknown';
  }.bind(this));
}

Logger.prototype = Object.create( stream.Writable.prototype, { constructor : { value : Logger } } );

Logger.prototype._write = function( chunk, encoding, done ){
  console.log( "from: " + this.source + " | " + chunk.toString() );
  done();
}

function Even(){
  stream.Transform.call(this);
  this.name = 'Even';
}

Even.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Even }} );

Even.prototype._transform = function( chunk, encoding, done ){
  var number = ~~ chunk.toString();
  this.push( number % 2 === 0 ? number + '' : '' );
  done();
}

function Odd(){
  stream.Transform.call(this);
  this.name = 'Odd'
}

Odd.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Odd } } );

Odd.prototype._transform = function( chunk, encoding, done ){
  var number = ~~ chunk.toString();
  this.push( number % 2 !== 0 ? number + '' : '' );
  done();
}

var random, odd, even;

random = new RandomNumbers();
odd = new Odd();
even = new Even();

random
  .pipe( new Logger() );

random
  .pipe(odd)
  .pipe( new Logger() );

random
  .pipe(even)
  .pipe( new Logger() );
