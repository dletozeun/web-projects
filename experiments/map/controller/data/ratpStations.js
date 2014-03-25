var app = require( "./app" );

exports.getAll = function( req, res )
{
	var ratpStationsCol = app.mapDb.getCollection( "ratpStations" );

	ratpStationsCol.find( {}, function( err, cursor )
    { 
        assert.equal( null, err );
        cursor.toArray( function( err, docs )
        {
            assert.equal( null, err , err );

            

            res.writeHead( 200, {"Content-Type": "text/plain"} );
            res.end();
            return;
        } );
    } );
}
