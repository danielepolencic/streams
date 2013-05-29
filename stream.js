// Connect one readable stream (which provides an output) to a writable stream
// (which accepts an input)

var RandomNumbers = require('./readable.js'),
    Logger = require('./writable.js'),

    random,
    logger;

random = new RandomNumbers();
logger = new Logger();

random.pipe(logger);
