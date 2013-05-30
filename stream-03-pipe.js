var RandomNumbers = require('./stream-01-readable.js'),
    Logger = require('./stream-02-writable.js'),

    random,
    logger;

random = new RandomNumbers();
logger = new Logger();

random.pipe(logger);
