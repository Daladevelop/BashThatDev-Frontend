
// The basics
var GRID_WIDTH = 960;
var GRID_HEIGHT = 640;
var BLOCK_SIZE = 64;
var map = {
	world_width: 15,
	world_height:10,
	world_tiles:
			[
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

			]
}


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

		this.activeCanvas.setAttribute('width',GRID_WIDTH);
		this.activeCanvas.setAttribute('height',GRID_HEIGHT);

		this.inactiveCanvas.setAttribute('width',GRID_WIDTH);
		this.inactiveCanvas.setAttribute('height',GRID_HEIGHT);

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

		for(y = 0; y < map.world_height; y++)
		{
			for(x = 0; x < map.world_width; x++)
			{
				if(map.world_tiles[y][x])
					this.ctx.drawImage(this.sprite,0,0,BLOCK_SIZE,BLOCK_SIZE, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); 
			}

		}

//		this.ctx.drawImage(this.sprite,0,0,BLOCK_SIZE,BLOCK_SIZE, 5 * BLOCK_SIZE, 1 * BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);

		this.flip();
	}

}
