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

var random, logger;

random = new RandomNumbers();
logger = new Logger();

random.pipe(logger);
