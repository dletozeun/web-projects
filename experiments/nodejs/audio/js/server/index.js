var http = require( "http" );
var fs = require( "fs" );
var url = require( "url" );
var util = require( "util" );
var path = require( "path" );
var zlib = require( "zlib" );
var mime = require( "mime" );

var handles = {}
handles[ "/" ] = start;
handles[ "/streamAudio" ] = streamAudio;


function onRequest( request, response )
{
	var pathName = url.parse(request.url).pathname;
	console.log("\n\nRequest for " + pathName + " received.");

	var handle = handles[ pathName ];
	if( typeof handle === "function" )
	{
		handle( request, response );
	}
	else
	{
		var filePath = '.' + pathName;
		//console.log( "Check whether file : " + filePath + " exists" );

		fs.exists( filePath, function( exists )
		{
			if( exists )
			{
				//console.log( "File : " + filePath + " exists" );
				
				var contentType = mime.lookup( filePath );
				console.log( "Request for file : " + filePath + "  Content-Type : " + contentType );
				
				if( contentType.indexOf( "text/" ) >= 0 || contentType.indexOf( "application/" ) >= 0 )
				{
					response.writeHead( 200, { "Content-Type" : contentType, "Content-Encoding" : "gzip" });
					var gzipWriter = zlib.createGzip();
					fs.createReadStream( filePath ).pipe( gzipWriter ).pipe( response );
				}
				else
				{
					response.writeHead( 200, { "Content-Type" : contentType });
					fs.createReadStream( filePath ).pipe( response );
				}
			}
			else
			{
				console.log( "No request handler found for : " + pathName );
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not found");
				response.end();
			}
		} );
	}
}

function start( request, response )
{
	response.writeHead( 200, { "Content-Type" : "text/html; charset=utf8" });
	fs.createReadStream( "html/index.html" ).pipe( response );
}

function streamAudio( request, response )
{
	var userId = "user agent : " + util.inspect( request.headers[ "user-agent" ] ) + " IP : " + request.connection.remoteAddress;
	var filePath = "data/a.mp3";

	console.log( "Start streaming audio - " + (new Date).toString() + "  for : " + userId );

	var fileSize = fs.statSync( filePath ).size;

	response.writeHead( 200, { "Content-Type" : 'audio/mpeg;codecs="mp3"',
							   "Transfer-Encoding" : "binary",
							   "Content-Range" : "bytes 0-" + ( fileSize - 1 ) + "/" + fileSize,
							   "Accept-Ranges" : "bytes",
							   "Content-Length" : fileSize.toString(),
							   "Cache-control" : "public" } );

	var audioReadStream = fs.createReadStream( "data/a.mp3" );
	//var audioWriteStream = fs.createWriteStream( "test.mp3" );

	//console.log( "Start audio reader : " + util.inspect( audioReadStream ) );
	//console.log( "Start inspect response : " + util.inspect( response ) );

	audioReadStream.pipe( response );

	audioReadStream.on( "end", function()
	{
		console.log( "Finished streaming audio - " + (new Date).toString() + "  for : " + userId );
	});

	console.log( "Now streaming audio - " + (new Date).toString() + "  for : " + userId );
}

http.createServer( onRequest ).listen( 8080 );
console.log( "Server has started - " + ( new Date ).toString() );