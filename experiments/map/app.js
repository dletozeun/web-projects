var express = require( "express" );


var app = {};

var dataControllerPath = "./controller/data/"
var dataControllers = {
	"ratpStations" : require( dataControllerPath + "ratpStations" ):
}

var expressInstance = express();
expressInstance.engine('html', require('ejs').renderFile);
expressInstance.set('view engine', 'html');
expressInstance.set('views', __dirname + '/view');

// log
expressInstance.use(express.logger('dev'));

// serve static files
expressInstance.use(express.static(__dirname + '/public'));

expressInstance.get('/', function(req, res)
{ 
    res.status( 200 ).render( "index" );
});

expressInstance.get( "/data", function( req, res )
{
	var queryString = req.queryString;
	console.log( "get data controller : " + queryString );

	var methodStartIndex = queryString.lastIndexOf( '/' ) + 1;
	if( methodStartIndex > 0 )
	{
		var methodName = queryString.substr( methodStartIndex );
	}
} );

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
expressInstance.use(function(err, req, res, next){
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  // error page
  res.status(500).render('5xx');
});

// assume 404 since no middleware responded
expressInstance.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});

var httpServer = app.listen( 8080 );

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup)

function cleanup()
{
    console.log( "cleanup on process exit" );

    httpServer.close();
    process.exit();
}

app.mapDb = new Database( "map", "localhost", 27017 );


exports.app = app;
