var console = function(mess) {
	alert(mess);
}

// The basics
var GRID_WIDTH = '960px';
var GRID_HEIGHT = '640px';



// WebSockets
var sock = null;
var wsuri = "ws://localhost:9000";
 
window.onload = connect;
function connect() {
 	sock = new WebSocket(wsuri);

	sock.onopen = function() {
		console.log("connected to " + wsuri);
	}
 
	sock.onclose = function(e) {
    	console.log("connection closed (" + e.code + ")");
		window.setInterval("connect", 1);

		sock = new WebSocket(wsuri);
	}
 
	sock.onmessage = function(e) {
		console.log("message received: " + e.data);
	}
};

function send() {
	var msg = document.getElementById('message').value;
    sock.send(msg);
};

