var Writable = require('stream').Writable;

module.exports = Logger;

function Logger (name) {
  Writable.call(this);
  this.name = name || "";
}

Logger.prototype = Object.create(Writable.prototype);

Logger.prototype._write = function (chunk, encoding, done) {
  var log = this.name ? this.name + " " : "";
  console.log(log + chunk.toString('ascii'));
  done();
};