var RandomNumbers = require('./stream-01-readable.js'),
    Logger = require('./stream-02-writable.js'),
    stream = require('stream'),

    random,
    square,
    logger;

function Square(){
  stream.Transform.call(this);
}

Square.prototype = Object.create( stream.Transform.prototype, { constructor : { value : Square } } );

Square.prototype._transform = function( chunk, encoding, done ){
  var number = parseInt(chunk.toString('ascii'), 10);
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
