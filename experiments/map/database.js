var mongodb = require( "mongodb" );
var assert = require( "assert" );



function Database( name, host, port )
{
    var _db = new mongodb.Db( name, new mongodb.Server( host, port ) );
    _db.open( function( err, db )
    {
        assert.equal( null, err, err );
        _db.on( "close", function( err )
        {
            assert.equal( null, err );
            console.log ( "On connection closed with database" );
        } );       
    } );


    var _collections = {};

    this.getCollection = function( name ) { getCollection.call( this, name ); }
}


function getCollection = function( name )
{
    var requiredCollection = this._collections[ name ];
    if( collection === null )
    {
        this._db.collection( name, { strict : true }, function( err, collection )
        {
            if( err )
            {
                console.log( "Create collection: " + name );
                db.createCollection( name, function( err, collection )
                {
                    assert.equal( null, err );
                } );
            }
            else if( collection === null )
            {
                assert( false, "Collection: " + name + " is undefined" );
            }
            else
            {
                console.log( "Found collection: " + name );
            }
        });

        requiredCollection = collection;
        this_collections[ name ] = collection;
    }

    return requiredCollection;
}

exports.Database = Database;
