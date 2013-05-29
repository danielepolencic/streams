// Multiple transform blocks can be piped together using a loop

var RandomNumbers = require('./readable.js'),
    Logger = require('./writable.js'),
    stream = require('stream'),

    random,
    network,
    current_stream;

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

random = new RandomNumbers();

network = current_stream = new stream.PassThrough();

for( var i = 0; i < 5; i += 1 ){
  // .pipe( stream ) returns the dest
  current_stream = current_stream.pipe( new Noop(i) );
}

random
  .pipe( network )
  .pipe( new Logger() )


