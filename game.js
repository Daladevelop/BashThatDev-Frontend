/*
		if (!gotHello) {
				helloData = JSON.parse(e.data);
				console.log(helloData['pix']['player_1']);
				GameEngine.setSprite(helloData['pix']['player_1']);
				gotHello = true;
			} else {
				goRun = true;
				data = JSON.parse(e.data);
				
				map = data; // REM LATER
			}
*/
// The basics
var GRID_WIDTH = 960;
var GRID_HEIGHT = 640;
var BLOCK_SIZE = 64;
data = [];
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
			/* I DONT */
			data.push(e);
		}
		catch(error)
		{
			console.log("funkänt");
		}
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

		//this.sprite = new Image();
		//this.sprite.src = "px/sprite.png";

		evarglice.bind('keydown',[document.body],GameEngine.keyDown);
		evarglice.bind('keyup',[document.body],GameEngine.keyUp);
		evarglice.bind('mousedown',[document.body],GameEngine.mouseDown);

		this.keyIsPressed = [];
		this.keyIsPressed[32] = 0;
		this.keyIsPressed[37] = 0;
		this.keyIsPressed[38] = 0;
		this.keyIsPressed[39] = 0;
		this.keyIsPressed[40] = 0;

		for (var i = 0; i < 9; i++) {
			this.keyIsPressed[48+i] = 0;
		}


//		window.setInterval(this.loop,10); 

		return true;
	},
	/* should be several , add sprite, remove and so on*/
	setSprite: function (sprite) {
		console.log("Setting sprite to");
		console.log(sprite.dood); 
		this.sprite = new Image();
		this.sprite.src = sprite.dood;
	},
	mouseDown : function(data) {
		console.log(data);
	},
	mouseUp: function(data) {
	},
	keyDown: function(data){
		console.log(data.keyCode);
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
		if (isRunning){
		GameEngine.update();
			console.log("updated");
			GameEngine.draw();
			console.log("drawed");
		}
	},

	load_pix: function(pix) {
		/* named obj get pix*/
		console.log("Loading pix");
		this.pix = this.pix.concat(pix);
		console.log(this.pix);
	},
	update: function() {
	/*
	if (x!gotHello) {
				console.log(data);
				console.log(data['pix']);
				helloData = JSON.parse(data);
				console.log(helloData['pix']['player_1']);
				GameEngine.setSprite(helloData['pix']['player_1']);
				gotHello = true;
				goRun = true;
			return 1;
		}*/
		while (data.length != 0) {
			d = data.shift();
			recvdata = JSON.parse(d.data);
			console.log(d);
			console.log(recvdata);


			for (var key in  recvdata){
					value = recvdata[key];
					console.log(value);
				switch (key) {
					case 'msg': break;
					case 'pix': GameEngine.setSprite(value); break;
					case "players": map.players = value; break;
					case "map": map = value; break;
					case 'world_width': map.world_width = value; break;
					case 'world_height': map.world_height = value; break;
					case 'world_tiles' : map.world_tiles = value; break;
					//case "pix": GameEngine.load_pix(e); break;
					default: console.log("undefined data from be");console.log(e); break;
					}
				}
		}
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
			if (map.players != undefined) {
				for(c = 0; c < map.players.length; c++)
				{	
					this.ctx.drawImage(this.sprite ,2*BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, map.players[c].pos_x * BLOCK_SIZE, map.players[c].pos_y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

				}
			}
			this.flip();

		}
		
	}

}

connect();
