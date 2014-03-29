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
var fx = !(window.mozInnerScreenX == null);
var GRID_WIDTH = 960;
var GRID_HEIGHT = 480;
var BLOCK_SIZE = 24;
data = [];
map = [];
isRunning = true; 
gotHello = false;
goRun = false;
offset = 0.0;
user_offset = 0;
helloData = [];
// WebSockets
var sock = null;
var port = 1338;
//var wsuri = "ws://daladevelop.se:"+ port;
var wsuri = "ws://172.20.90.122:1338";
 
function connect() {
 	sock = new WebSocket(wsuri);

	sock.onopen = function() {
		GameEngine.init(); 
	}
 
	sock.onclose = function(e) {
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
	setSprite: function (sprites) {
		this.sprite = new Image();
		this.sprite.src = sprites[0].data;
	},
	mouseDown : function(data) {
	},
	mouseUp: function(data) {
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
	if (fx){return false; }
			event.preventDefault();
		}
	},
	keyUp: function(data){
		if(data.keyCode == 32 || data.keyCode == 37 || data.keyCode == 38 || data.keyCode == 39 || data.keyCode == 40){
			keyPress = {type: 'released',keyCode:data.keyCode};
			send(JSON.stringify(keyPress));

			GameEngine.keyIsPressed[data.keyCode] = 0; 
			if (fx){return false; }
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
		if (isRunning){
		GameEngine.update();
			GameEngine.draw();
		}
	},

	load_pix: function(pix) {
		/* named obj get pix*/
		this.pix = this.pix.concat(pix);
	},

	load_audio: function(e) {
		console.log("loading audio");
		console.log(e);
		console.log(e.url);
		var me = document.createElement("embed");
		var ad = document.createElement("audio");
		var src = document.createElement("source");	
		src.setAttribute("src", String(e.url));
		src.setAttribute("type", "audio/mpeg");
		ad.setAttribute("loop", "");
		ad.setAttribute("autoplay", "autoplay");
		ad.setAttribute("hidden","");
		/*me.setAttribute("autostart", e.autostart);
		me.setAttribute("hidden",true);
		me.setAttribute("src", String(e.url));*/
		ad.appendChild(src);	
		document.body.appendChild(ad);	
		//document.body.appendChild(me);	
		
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

			for (var key in  recvdata){
					value = recvdata[key];
				switch (key) {
					case 'msg': break;
					case 'sprites': GameEngine.setSprite(value); break;
					case "players": 
						map.players = value;
						//console.log( value );
						break;

					case "map": map = value; break;
					case 'world_width': map.world_width = value; break;
					case 'world_height': map.world_height = value; break;
					case 'world_tiles' : map.world_tiles = value; break;
					//case 'music': GameEngine.load_audio(value); break;
					case 'camera_offset': offset = value; break;
					case 'user_offset': user_offset = value; break;
					//case "pix": GameEngine.load_pix(e); break;
					case 'sound_effects':
						loadSoundList( value );
						break;
					case 'sfx_playlist':
						console.log( value );
						play( value );
						break;
					default: console.log("undefined data from be");console.log(key, value); break;
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
						this.ctx.drawImage(this.sprite,9*BLOCK_SIZE-4,0,BLOCK_SIZE,BLOCK_SIZE, x * BLOCK_SIZE, (y-offset) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); 
				}

			}

			//Draw the players
			if (map.players != undefined) {
				color = 0;
				for(c = 0; c < map.players.length; c++)
				{	
				// nada
					if (user_offset != 0) {
						this.ctx.drawImage(this.sprite ,color*BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, map.players[c].pos_x * BLOCK_SIZE,
					 user_offset * BLOCK_SIZE,
					 BLOCK_SIZE, BLOCK_SIZE);
					} else {
						this.ctx.drawImage(this.sprite ,color*BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, map.players[c].pos_x * BLOCK_SIZE,
					 (map.players[c].pos_y) * BLOCK_SIZE,
					 BLOCK_SIZE, BLOCK_SIZE);


					}

					if (map.players[c].in_air) {
					}
					if(color +1 >=5)
						color = 0;
					else
						color = color +1;

					map.players[ c ].sfx_playlist.forEach( function(a) { play(a); } );
				}
			}
			this.flip();

		}
		
	}

}

connect();
