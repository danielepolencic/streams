# Stream tutorial
A stream is an abstract interface implemented by various objects in Node. This
tutorial covers the basic of streams interaction and creation.

## Readable
A readable stream is a stream that provides an output. The only method required
to implement the readable stream is the `_read` method.

    Readable.prototype._read = function(size){ ... }

## Writable
A writable stream is a stream that accepts an input (readable and writeable
streams are duals). The only method required to implement the writable stream is
the `_write` method.

    Writable.prototype._write = function(chunk, encoding, done){ ... }

## Pipe
The readable stream can connect to a writable stream using the `.pipe` method.

    source = new ReadableStream();
    drain = new WritableStream();

    source.pipe(drain)

## Transform
A stream that simoultaneously provides an output and accepts an input is called
full-duplex. Those streams inherit from both readable and writable stream,
however they must implement just the `.transform` method:

    Transform.prototype._transform = function(chunk, encoding, done){ ... }

## Splitter
Two full-duplex streams connected to the same input can act as a splitter.

## Mixer
Two streams that provide an output can both connect to a third stream, which acts
as a mixer

## Loop
Looping through streams can be easily achieved by remembering that the `.pipe`
operation always returns the destination stream.
