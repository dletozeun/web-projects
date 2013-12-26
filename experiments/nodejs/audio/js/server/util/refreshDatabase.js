require( "prototypes");
var fs = require( "fs" );
var util = require( "util" );
var mongodb = require('mongodb');
var path = require( "path" );
var id3 = require( "id3js" );
var assert = require( "assert" );

var musicPath = "C:\\Users\\SAFFRE\\Music\\Music\\Test";
var tracks = null;

var tracksToInsertCount = 0;

var musicDb = new mongodb.Db( "music", new mongodb.Server( "localhost", 27017 ) );
musicDb.open( function( err, db )
{
	assert.equal( null, err );
	db.collection( "tracks", { strict : true }, function( err, collection )
	{
		if( err )
		{
			console.log( "Create tracks collection" );
			db.createCollection( "tracks", function( err, collection )
			{
				assert.equal( null, err );
				tracks = collection;
				startSearchForMusic();
			} );
		}
		else if( collection )
		{
			console.log( "Found tracks collection " );
			tracks = collection;
			tracks.remove();
			startSearchForMusic();
			
		}
		else
		{
			assert( false, "tracks collection is undefined" );
		}
	});

	db.on( "close", onDbClosed );
} );

function startSearchForMusic()
{
	console.log( "Start search for music at : " + musicPath );
	scanDir( musicPath );
}

function onFinish()
{
	tracks.count( function( err, count )
	{
		assert.equal( null, err );
		console.log( "Added " + count + " track(s) to music db" );

		musicDb.close();
	} );

	/*tracks.find( {}, function( err, cursor )
	{ 
		assert.equal( null, err );
		cursor.toArray( function( err, docs )
		{
			assert.equal( null, err );
			docs.forEach( function( doc )
			{
				console.log( "Added to db track :\n" + util.inspect( doc ) );
			} );

			musicDb.close();
		} );
	} );*/
}

function onDbClosed( err, reply )
{
	assert.equal( null, err );
	console.log ( "On connection closed with music database" );
}

function scanDir( directoryPath )
{
	console.log( "check directory : " + directoryPath );
	fs.readdirSync( directoryPath ).forEach( function( item )
	{
		checkItem( directoryPath + "\\" + item );
	} );
}

function checkItem( itemPath )
{
	var stats = fs.statSync( itemPath );
	if( stats )
	{
		if( stats.isFile() )
		{
			itemPath = path.normalize( itemPath );

			if( path.extname( itemPath ).toLowerCase() === ".mp3" )
			{
				onMusictrackFound( itemPath );
			}
		}
		else if( stats.isDirectory() )
		{
			scanDir( itemPath );
		}
	}
	else
	{
		console.log( "Error reading stats of item : " + itemPath );
	}
}

function trimId3Info( info )
{
	if( info )
		return info.replace( /^[\s\u0000]+|[\s\u0000]+$/, '');
	return "";
}
	
function onMusictrackFound( trackPath )
{
	++tracksToInsertCount;

	id3( { file: trackPath, type: id3.OPEN_LOCAL }, function( err, tags )
	{
		if( tags )
		{
			var artist = trimId3Info( tags.artist );
			var title = trimId3Info( tags.title );
			var album = trimId3Info( tags.album );
			var year = trimId3Info( tags.year );
			
			var genre = "";
			var track = "";
			if( tags.v2 !== undefined )
			{
				genre = trimId3Info( tags.v2.genre );
				track = trimId3Info( tags.v2.track );
			}
			if( tags.v1 !== undefined)
			{
				if( genre.length === 0 )
				{
					genre = trimId3Info( tags.v1.genre );
				}
				if( track.length === 0 )
				{
					track = tags.v1.track;
				}
			}

			tracks.insert( { artist : artist,
							 title : title,
							 album : album,
							 year : year,
							 genre : genre,
							 track : track,
							 mp3 : {
							 	path : trackPath
							 } 
							}, function( err )
			{
				assert.equal( null, err );
				--tracksToInsertCount;

				if( tracksToInsertCount === 0 )
				{
					onFinish();
				}
			} );
		}
		else if( err )
		{
			console.log( err );
		}
	});
}
