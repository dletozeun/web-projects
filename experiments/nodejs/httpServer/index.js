var server = require( "./server" );
var router = require( "./router" );
var requestHandlers = require( "./requestHandlers" );
var fs = require( "fs" );

var handle = {};
handle[ "/" ] = requestHandlers.start;
handle[ "/start" ] = requestHandlers.start;
handle[ "/uploadText" ] = requestHandlers.uploadText;
handle[ "/sendText" ] = requestHandlers.sendText;
handle[ "/uploadImage" ] = requestHandlers.uploadImage;
handle[ "/sendImage" ] = requestHandlers.sendImage;
handle[ "/showImage" ] = requestHandlers.showImage;

server.start( router.route, handle );

process.on('uncaughtException', function (err)
{
	console.log( err.stack );
	fs.writeFileSync( "server.log", "[ERROR] " + ( new Date() ).toString() + ":\n" + err.stack + "\n\n", { encoding : 'utf8', flag : 'a' } );
    process.exit();
});
