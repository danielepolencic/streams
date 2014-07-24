var RandomNumbers = require('./stream-01-readable.js')
  , Logger = require('./stream-02-writable.js');

var random = new RandomNumbers();
var logger = new Logger();

random.pipe(logger);