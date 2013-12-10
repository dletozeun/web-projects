function onLoad()
{
	console.log( "Testing browser audio support" );

	var audio = new Audio();

	var canPlayOggVorbis = audio.canPlayType( 'audio/ogg; codecs="vorbis"' );
	var canPlayMp3 = audio.canPlayType('audio/mpeg; codecs="mp3"');

	console.log( "Audio can play ogg vorbis : " + canPlayOggVorbis );
	console.log( "Audio can play type mp3 : " + canPlayMp3 );

	addLogEntry( "Audio can play ogg vorbis : " + canPlayOggVorbis );
	addLogEntry( "Audio can play mp3 : " + canPlayMp3 );

	
}

function addLogEntry( logEntry )
{
	var logEl = document.getElementById( "log" );

	var pEl = document.createElement( "p" );
	var textEl = document.createTextNode( logEntry );
	pEl.appendChild( textEl );
	logEl.appendChild( pEl );
}
