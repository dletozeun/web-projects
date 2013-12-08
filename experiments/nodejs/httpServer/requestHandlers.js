var exec 			= require( "child_process" ).exec;
var querystring 	= require("querystring");
var formidable 		= require( "formidable" );
var fs 				= require( "fs" );
var http 			= require( "http" );
var url 			= require( "url");
var util  			= require( "util" );


function start( response )
{
	console.log( "Request handler 'start' was called" );

	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; '+
	'charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<a href="/uploadText">Upload text</a><br />' +
	'<a href="/uploadImage">Upload image</a>' +
	'</body>'+
	'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function uploadText( response )
{
	console.log( "Request handler 'uploadText' was called" );

	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; '+
	'charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/sendText" method="post">'+
	'<textarea name="text" rows="20" cols="60"></textarea>'+
	'<input type="submit" value="Submit text" />'+
	'</form>'+
	'</body>'+
	'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function sendText( response, request )
{
	console.log("Request handler 'sendText' was called.");

	var postData = "";

	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	
	request.addListener("end", function() {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("You've sent: " + querystring.parse(postData).text );
		response.end();
	});

	
}

function uploadImage( response )
{
	console.log("Request handler 'uploadImage' was called.");

	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/sendImage" enctype="multipart/form-data" method="post" accept="jpg;png">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function sendImage( response, request )
{
	console.log("Request handler 'sendImage' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");

	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		/* Possible error on Windows systems:
		tried to rename to an already existing file */
		var imagePath = "C:\\" + files.upload.name;

		console.log( "files : " + util.inspect( files ) );

		fs.rename(files.upload.path, imagePath, function(error) {
			if (error) {
				fs.unlink(imagePath);
				fs.rename(files.upload.path, imagePath);
			}
	});

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("received image:<br/>");
	response.write("<img src='/showImage?name=" + files.upload.name + "' />");
	response.end();
	});
}

function showImage( response, request )
{
	console.log("Request handler 'show' was called.");

	var query = url.parse( request.url ).query;
	var fileName = querystring.parse( query ).name;

	var imagePath = "C:\\" + fileName;
	fs.readFile(imagePath, "binary", function(error, file) {
	if(error) {
	response.writeHead(500, {"Content-Type": "text/plain"});
	response.write(error + "\n");
	response.end();
	} else {
	response.writeHead(200, {"Content-Type": "image/png"});
	response.write(file, "binary");
	response.end();
	}
	});
}

exports.start = start;
exports.uploadText = uploadText;
exports.sendText = sendText;
exports.uploadImage = uploadImage;
exports.sendImage = sendImage;
exports.showImage = showImage;

