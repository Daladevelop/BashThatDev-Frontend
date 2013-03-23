

// The basics
var GRID_WIDTH = 960;
var GRID_HEIGHT = 640;
var BLOCK_SIZE = 64;


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



var GameEngine =  {
	//Variables
	

	//methods
	init : function(){
		this.activeCanvas = document.getElementById('zero');
		this.inactiveCanvas = document.getElementById('one');

		this.sprite = new Image();
		this.sprite.src = "px/sprite.png";

		return true;
	},
	flip : function(){
			tmp = this.activeCanvas;
			this.activeCanvas = this.inactiveCanvas;
			this.inactiveCanvas = tmp;

			this.inactiveCanvas.className='gamecanvas';
			this.activeCanvas.className='gamecanvas active';
			return true;

	},

	loop: function()
	{

		this.draw();
	},

	draw: function(){
		this.ctx = this.inactiveCanvas.getContext("2d");

		this.ctx.drawImage(this.sprite,0,0,BLOCK_SIZE,BLOCK_SIZE, 5 * BLOCK_SIZE, 1 * BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);

		this.flip();
	}

}
