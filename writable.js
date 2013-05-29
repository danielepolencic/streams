// This is a writable stream.
// Writable streams that can accept an input

var stream = require('stream');

module.exports = Logger;

function Logger(name){
  stream.Writable.call(this);
  this.name = name || "";
}

Logger.prototype = Object.create( stream.Writable.prototype, { constructor : { value : Logger } } );

Logger.prototype._write = function( chunk, encoding, done ){
  console.log( this.name + " " + chunk.toString() );
  done();
}
