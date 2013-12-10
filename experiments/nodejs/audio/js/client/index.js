function onLoad()
{
	console.log( "Testing browser audio support" );

	var audio = document.getElementById( "audio" );

	var canPlayOggVorbis = audio.canPlayType( 'audio/ogg; codecs="vorbis"' );
	var canPlayMp3 = audio.canPlayType('audio/mpeg; codecs="mp3"');

	console.log( "Audio can play ogg vorbis : " + canPlayOggVorbis );
	console.log( "Audio can play type mp3 : " + canPlayMp3 );

	addLogEntry( "Audio can play ogg vorbis : " + canPlayOggVorbis );
	addLogEntry( "Audio can play mp3 : " + canPlayMp3 );

	var audioPlayer = document.getElementById( "audio_player" );
	(function updateAudio()
	{
		audioPlayer.innerHTML = "Audio player - time : " + secondsToHHMMSS( Math.floor( audio.currentTime ) ) + "/" + secondsToHHMMSS( Math.floor( audio.duration ) );

		if( !audio.paused )
		{
			setTimeout( updateAudio, 1000 );
		}
		else
		{
			console.log( "Audio is paused")
		}
	})();	
}

function secondsToHHMMSS( seconds )
{
    var hours   = Math.floor( seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return hours + ':' + minutes + ':' + seconds;
}

function addLogEntry( logEntry )
{
	var logEl = document.getElementById( "log" );

	var pEl = document.createElement( "p" );
	var textEl = document.createTextNode( logEntry );
	pEl.appendChild( textEl );
	logEl.appendChild( pEl );
}

