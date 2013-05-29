// connect a full duplex pipe between a readable and a writable module.
// Full duplex modules provide both an input and an output terminal.

var RandomNumbers = require('./readable.js'),
    Logger = require('./writable.js'),
    stream = require('stream'),

    random,
    square,
    logger;

function Square(){
  stream.Transform.call(this);
}

Square.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Square } } );

Square.prototype._transform = function( chunk, encoding, done ){
  var number = ~~ chunk.toString();
  this.push( (number * number) + "" );
  done();
}

random = new RandomNumbers();
logger = new Logger();
square = new Square();

random
  .pipe(logger);

random
  .pipe(square)
  .pipe(logger);
