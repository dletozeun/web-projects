require( "prototypes");
var fs = require( "fs" );
var mongodb = require('mongodb');
var assert = require( "assert" );
var path = require( "path" );




var mapDb = new mongodb.Db( "map", new mongodb.Server( "localhost", 27017 ) );
var ratpStationsCol = null;
var ratpStationsCsvFilePath = "ratp_arret_graphique_01.csv";

mapDb.open( function( err, db )
{
	assert.equal( null, err, err );
	db.collection( "ratpStations", { strict : true }, function( err, collection )
	{
		if( err )
		{
			console.log( "Create ratpStations collection" );
			db.createCollection( "ratpStations", function( err, collection )
			{
				assert.equal( null, err );
				ratpStationsCol = collection;
				parseRatpStations( ratpStationsCsvFilePath );
			} );
		}
		else if( collection )
		{
			console.log( "Found ratpStations collection " );
			ratpStationsCol = collection;
			ratpStationsCol.remove();
			parseRatpStations( ratpStationsCsvFilePath );
			
		}
		else
		{
			assert( false, "ratpStations collection is undefined" );
		}
	});

	db.on( "close", onDbClosed );
} );



function parseRatpStations( csvFilePath )
{
	console.log( "Start parsing ratp stations in : " + csvFilePath );

	csvFilePath = path.normalize( csvFilePath );
	fs.exists( csvFilePath, function( exists )
	{
		if( exists )
		{
			var rs = fs.createReadStream( csvFilePath );
			
			var line = "";
			rs.on( "data", function( chunk )
			{
				var lines = chunk.toString().split( '\n' );
				lines[ 0 ] = line + lines[ 0 ];

				line = lines.pop();
				lines.forEach( processLine );
			} );

			rs.on( "end", function()
			{
				processLine( line );

				ratpStationsCol.count( function( err, count )
				{
					assert.equal( null, err );
					console.log( "Added " + count + " ratp station(s) to database" );

					mapDb.close();
				} );

			} );
		}
		else
		{
			console.log( "File : "+ csvFilePath + " does not exists" );
		}
	} );
}



function processLine( line )
{
	if( line.length > 0 )
	{
		var stationInfos = line.split( '#' );

		var id = "";
		var longitude = 0;
		var latitude = 0;
		var name = "";
		var location = "";
		var network = "";
		
		for( var i = 0; i < stationInfos.length; ++i )
		{
			var stationInfo = stationInfos[ i ];

			switch( i )
			{
				case 0:
					id = stationInfo;
					break;
				case 1:
					longitude = stationInfo;
					break;
				case 2:
					latitude = stationInfo;
					break;
				case 3:
					name = stationInfo;
					break;
				case 4:
					location = stationInfo;
					break;
				case 5:
					network = stationInfo;
					break;

			}
		}

		console.log( "Parsed station  id: " + id + "  coords: ( " + longitude + ", " + latitude + " )  name: " + name + "  location: " + location + "  network: " + network  );

		ratpStationsCol.insert( { id : id,
								  longitude : longitude,
								  latitude : latitude,
								  name : name,
								  location : location,
								  network : network	},

								function( err )
								{
									assert.equal( null, err );
								} );
	}
}



function onDbClosed( err, reply )
{
	assert.equal( null, err );

	console.log ( "On connection closed with database" );
}
