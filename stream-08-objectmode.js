var RandomNumbers,
    Logger,
    stream = require('stream'),

    random,
    logger

function RandomNumbers(){
  stream.Readable.call(this, { objectMode: true });
}

RandomNumbers.prototype = Object.create( stream.Readable.prototype, { constructor : { value : RandomNumbers } } );

RandomNumbers.prototype._read = function( size ){
  setTimeout( function(){
    this.push({ number : parseInt(Math.random() * 10, 10)});
  }.bind(this), 500 )
}

function Logger(name){
  stream.Writable.call(this);
  // not documented. make Writable and objectMode play nicely together
  this._writableState.objectMode = true
}

Logger.prototype = Object.create( stream.Writable.prototype, { constructor : { value : Logger } } );

Logger.prototype._write = function( chunk, encoding, done ){
  console.log( "log: ", chunk.number );
  done();
}

random = new RandomNumbers();
logger = new Logger();

random
  .pipe(logger);
