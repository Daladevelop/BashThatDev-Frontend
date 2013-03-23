
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
				[0,0,0,0,0,0,1,0,0,1,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
				[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
				[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

			],
	players:
		[
			{pos_x: 2, pos_y: 2}




		]
}

isRunning = true; 

// WebSockets
var sock = null;
var wsuri = "ws://daladevelop.se:1337";
 
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

function send(msg) {
	
    sock.send(msg);
};



var GameEngine =  {
	//Variables
	

	//methods
	init : function(){
		connect();
		this.activeCanvas = document.getElementById('zero');
		this.inactiveCanvas = document.getElementById('one');

		this.activeCanvas.setAttribute('width',GRID_WIDTH);
		this.activeCanvas.setAttribute('height',GRID_HEIGHT);

		this.inactiveCanvas.setAttribute('width',GRID_WIDTH);
		this.inactiveCanvas.setAttribute('height',GRID_HEIGHT);

		this.sprite = new Image();
		this.sprite.src = "px/sprite.png";

		evarglice.bind('keydown',[document.body],GameEngine.keyDown);
		evarglice.bind('keyup',[document.body],GameEngine.keyUp);


		window.setInterval(this.loop,10); 

		return true;
	},
	
	keyDown: function(data){
		
		if(data.keyCode == 32 || data.keyCode == 37 || data.keyCode == 38 || data.keyCode == 39 || data.keyCode == 40)
		{
			console.log(data);
			keyPress = {type: 'press',keyCode:data.keyCode};
			console.log(keyPress);
			
			//send keypress to server
			send(JSON.stringify(keyPress));
			event.preventDefault();
		}
	},
	keyUp: function(data){
		if(data.keyCode == 32 || data.keyCode == 37 || data.keyCode == 38 || data.keyCode == 39 || data.keyCode == 40){
			keyPress = {type: 'release',keyCode:data.keyCode};
			console.log(keyPress);
			send(JSON.stringify(keyPress));
			event.preventDefault();
			return false;
		}
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
		if(isRunning)
			GameEngine.draw();
	},

	draw: function(){
		this.ctx = this.inactiveCanvas.getContext("2d");

		//Draw the world
		for(y = 0; y < map.world_height; y++)
		{
			for(x = 0; x < map.world_width; x++)
			{
				if(map.world_tiles[y][x])
					this.ctx.drawImage(this.sprite,0,0,BLOCK_SIZE,BLOCK_SIZE, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); 
			}

		}
		
		//Draw the players
		for(c = 0; c<map.players.length; c++)
		{
			this.ctx.drawImage(this.sprite,2*BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, map.players[c].pos_x * BLOCK_SIZE, map.players[c].pos_y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

		}

		this.flip();
	}

}

window.onload = GameEngine.init(); 
