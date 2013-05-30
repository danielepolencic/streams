var stream = require('stream');

module.exports = RandomNumbers;

function RandomNumbers(){
  stream.Readable.call(this);
}

RandomNumbers.prototype = Object.create( stream.Readable.prototype, { constructor : { value : RandomNumbers } } );

RandomNumbers.prototype._read = function( size ){
  setTimeout( function(){
    this.push(  parseInt(Math.random() * 10, 10) + "" );
  }.bind(this), 500 )
}
