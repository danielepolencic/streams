var Readable = require('stream').Readable;

module.exports = RandomNumbers;

function RandomNumbers () {
  Readable.call(this);
}

RandomNumbers.prototype = Object.create(Readable.prototype);

RandomNumbers.prototype._read = function (size) {
  setTimeout(function () {
    this.push(parseInt(Math.random() * 10, 10) + "");
  }.bind(this), 500);
};