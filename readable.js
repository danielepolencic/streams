// This is a redable stream.
// Readable streams are streams that can provide an output

var stream = require('stream');

module.exports = RandomNumbers;

function RandomNumbers(){
  stream.Readable.call(this);
}

RandomNumbers.prototype = Object.create( stream.Readable.prototype, { constructor : { value : RandomNumbers } } );

RandomNumbers.prototype._read = function( size ){
  setTimeout( function(){
    this.push( ~~ (Math.random() * 10) + "" );
  }.bind(this), 500 )
}
