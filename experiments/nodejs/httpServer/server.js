var http = require( "http" );
var url = require( "url");


function start( route, handle )
{
	function onRequest( request, response )
	{
		console.log( "Request received - " + (new Date).toString() );

		var pathName = url.parse( request.url ).pathname;
		route( handle, pathName, response );
	}

	http.createServer( onRequest ).listen( 8080 );
	console.log( "Server has started - " + (new Date).toString() );
}

exports.start = start;
