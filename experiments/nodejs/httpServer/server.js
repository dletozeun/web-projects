var http = require( "http" );
var url = require( "url");
var util = require( "util" );


function start( route, handle )
{
	function onRequest( request, response )
	{
		console.log( "\n\nRequest received - " + (new Date).toString() );

		var pathname = url.parse(request.url).pathname;
		console.log("request for " + pathname + " received.");
		console.log( "headers : " + util.inspect( request.headers ) + "\n" );	

		route(handle, pathname, response, request);
	}

	http.createServer( onRequest ).listen( 8080 );
	console.log( "Server has started - " + (new Date).toString() );
}

exports.start = start;
