var stream = require('stream');

module.exports = Logger;

function Logger(name){
  stream.Writable.call(this);
  this.name = name || "";
}

Logger.prototype = Object.create( stream.Writable.prototype, { constructor : { value : Logger } } );

Logger.prototype._write = function( chunk, encoding, done ){
  var log = this.name ? this.name + " " : ""
  console.log( log + chunk.toString('ascii') );
  done();
}
