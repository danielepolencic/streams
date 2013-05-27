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
}

RandomNumbers.prototype = Object.create( stream.Readable.prototype, { constructor : { value : RandomNumbers } } );

RandomNumbers.prototype._read = function( size ){
  setTimeout( function(){
    this.push( ~~ (Math.random() * 10) + "" );
  }.bind(this), 500 )
}

function Logger(){
  stream.Writable.call(this);
}

Logger.prototype = Object.create( stream.Writable.prototype, { constructor : { value : Logger } } );

Logger.prototype._write = function( chunk, encoding, done ){
  console.log( chunk.toString() );
  done();
}

function Noop( index ){
  stream.Transform.call(this);
  this.index = index.toString() || 'no index defined';
}

Noop.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Noop } } );

Noop.prototype._transform = function( chunk, encoding, done ){
  console.log('i: ' + this.index + ' |', chunk.toString());
  this.push(chunk);
  done();
}

var random, logger, noop, network, last_noop, new_noop;

random = new RandomNumbers();
logger = new Logger();

network = last_noop = new stream.PassThrough();

for( var i = 0; i < 5; i += 1 ){
  new_noop = new Noop(i);
  last_noop.pipe( new_noop );
  last_noop = new_noop;
}

random
  .pipe( network )
  .pipe( logger )


