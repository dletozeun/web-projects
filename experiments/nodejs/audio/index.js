var express = require( "express" );
var util = require( "util" );
var mongodb = require('mongodb');
var assert = require( "assert" );


var app = express();

app.engine('html', require('jade').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// log
app.use(express.logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res)
{ 
    tracks.find( {}, function( err, cursor )
    { 
        assert.equal( null, err );
        cursor.toArray( function( err, docs )
        {
            if( err )
            {
                res.send( "No music found" );
                return;
            }

            

            res.writeHead( 200, {"Content-Type": "text/plain"} );
            res.write( "toto" );
            res.end();
            return;
        } );
    } );
});

app.param( "user", function( req, res, next, val )
{
    console.log( "param user value : " + val );
    next();
} );

app.param( function( name, callback ) 
{  
    return function( req, res, next, val )
    {
        console.log( "got param : " + name + "  value :" + val );   
        next();
    }
} );

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function(err, req, res, next){
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  // error page
  res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});

var musicDb = new mongodb.Db( "music", new mongodb.Server( "localhost", 27017 ) );
var tracks = null;

musicDb.open( function( err, db )
{
    assert.equal( null, err, "Unable to open music database" );

    db.collection( "tracks", { strict : true }, function( err, collection )
    {
        assert.equal( null, err, "tracks collection not found" );

        console.log( "found tracks collection" );
        tracks = collection;
    });

    db.on( "close", onDbClosed );
} );

function onDbClosed()
{
    console.log( "Connection with music database closed" );
}

var httpServer = app.listen( 8080 );

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup)

function cleanup()
{
    console.log( "cleanup on process exit" );

    httpServer.close();
    db.close();

    process.exit();
}
