
// The basics
var GRID_WIDTH = 960;
var GRID_HEIGHT = 640;
var BLOCK_SIZE = 64;
map = [];
isRunning = true; 
gotHello = false;
goRun = false;
helloData = [];
// WebSockets
var sock = null;
var wsuri = "ws://madbear.biz:1337";
 
function connect() {
 	sock = new WebSocket(wsuri);

	sock.onopen = function() {
		console.log("connected to " + wsuri);
		GameEngine.init(); 
	}
 
	sock.onclose = function(e) {
    	console.log("connection closed (" + e.code + ")");
		window.setInterval("connect", 1);

		sock = new WebSocket(wsuri);
	}
 
	sock.onmessage = function(e) {
		
		try
		{
			if (!gotHello) {
				helloData = JSON.parse(e.data);
				console.log(helloData['pix']['player_1']);
				GameEngine.setSprite(helloData['pix']['player_1']);
				gotHello = true;
			} else {
				goRun = true;
				map = JSON.parse(e.data);
			}
		}
		catch(error)
		{
			console.log("funkänt");
		}
			if (goRun)
				GameEngine.loop();
	}
};

function send(msg) {
	
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
		//this.sprite.src = "px/sprite.png";

		evarglice.bind('keydown',[document.body],GameEngine.keyDown);
		evarglice.bind('keyup',[document.body],GameEngine.keyUp);

		this.keyIsPressed = [];
		this.keyIsPressed[32] = 0;
		this.keyIsPressed[37] = 0;
		this.keyIsPressed[38] = 0;
		this.keyIsPressed[39] = 0;
		this.keyIsPressed[40] = 0;


//		window.setInterval(this.loop,10); 

		return true;
	},
	/* should be several , add sprite, remove and so on*/
	setSprite: function (sprite) {
		this.sprite.src = sprite;
	},
	keyDown: function(data){
		
		if(data.keyCode == 32 || data.keyCode == 37 || data.keyCode == 38 || data.keyCode == 39 || data.keyCode == 40)
		{
			if(!GameEngine.keyIsPressed[data.keyCode])
			{
				keyPress = {type: 'pressed',keyCode:data.keyCode};

				//send keypress to server
				send(JSON.stringify(keyPress));

				GameEngine.keyIsPressed[data.keyCode] = 1;
			}
		event.preventDefault();
		}
	},
	keyUp: function(data){
		if(data.keyCode == 32 || data.keyCode == 37 || data.keyCode == 38 || data.keyCode == 39 || data.keyCode == 40){
			keyPress = {type: 'released',keyCode:data.keyCode};
			send(JSON.stringify(keyPress));

			event.preventDefault();
			GameEngine.keyIsPressed[data.keyCode] = 0; 
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
		this.ctx.clearRect(0,0,GRID_WIDTH,GRID_HEIGHT);
		if(typeof map == 'object')
		{
			//Draw the world
			for(x = 0; x < map.world_width; x++)
			{
				for(y = 0; y < map.world_height; y++)
				{
					if(map.world_tiles[x][y])
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

}

connect();
