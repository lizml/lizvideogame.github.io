//canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


//variables
var frames = 0;
var bul = true;
var fondo = "http://www.desktopwallpaperhd.net/wallpapers/12/9/wallpaper-super-mario-background-desktop-image-world-126585.jpg";
var heroe = bul ? "img/mariodr.png" : "img/marioiz.png";
var drone = "https://www.quadh2o.com/wp-content/uploads/2016/04/hex300x300.png";
var luigiSprite ="img/luigidr.png";
var gameEnd = "img/mario.png";
var enemies = [];
var interval;
var MarioCurrentFrame = 0;
var LuigiCurrentFrame = 0;

//clases (constructores)
function Background(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.imagen = new Image();
    this.imagen.src = fondo;
    this.imagen.onload = function(){
    this.draw();
    }.bind(this);
    
    this.draw = function(){
        //ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        if (this.x < -canvas.width){
            this.x = 0;
        }
        this.x--;
        ctx.drawImage (this.imagen,this.x, this.y, canvas.width, canvas.height);
        ctx.drawImage(this.imagen, this.x + canvas.width, this.y, canvas.width, canvas.height);
    };
}
    

function Heroe(x, y, imgSrc){
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.imagen = new Image();
    this.imagen.src = "img/mariodr.png";
    this.imagen.onload = () => {
        this.draw();
    }

    this.isAlive = true;
    
    this.draw = function(){
        if(this.x < 0) this.x = 0;
        if(this.x > canvas.width) this.x = canvas.width - 8;
        if (this.isAlive) {
            ctx.drawImage(this.imagen, MarioCurrentFrame*131/3, 0, 131/3, 64,this.x, this.y, this.width, this.height);
        }
    };    
     
    this.draw = function(){
        if(this.x < 0) this.x = 0;
        if(this.x > canvas.width) this.x = canvas.width - 8;
        if (this.isAlive) {
            ctx.drawImage(this.imagen, LuigiCurrentFrame*130/3, 0, 130/3, 64,this.x, this.y, this.width, this.height);
        }
    }; 
    
    this.checkIfTouch = function(enemy){
        return (this.x < enemy.x + enemy.width) &&
                (this.x + this.width > enemy.x) &&
                (this.y < enemy.y + enemy.height) &&
                (this.y + this.height > enemy.y);
    };
    
}
function Luigi(x, y, imgSrc){
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.imagen = new Image();
    this.imagen.src = "img/luigidr.png";
    this.imagen.onload = () => {
        this.draw();
    }

    this.isAlive = true;
    
    this.draw = function(){
        if(this.x < 0) this.x = 0;
        if(this.x > canvas.width) this.x = canvas.width - 8;
        if (this.isAlive) {
            ctx.drawImage(this.imagen, LuigiCurrentFrame*131/3, 0, 131/3, 64,this.x, this.y, this.width, this.height);
        }
    };
    
    this.checkIfTouch = function(enemy){
        return (this.x < enemy.x + enemy.width) &&
                (this.x + this.width > enemy.x) &&
                (this.y < enemy.y + enemy.height) &&
                (this.y + this.height > enemy.y);
    };
    
}


function Enemy(x, img){
    this.x = x;
    this.y = 0;
    this.width = 64;
    this.height = 64;
    this.imagen = new Image();
    this.imagen.src = img;
    this.imagen.onload = function(){
        this.draw();
    }.bind(this);
    
    this.draw = function(){
        this.y++;
        ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
    }
}

//instancias
var board = new Background();
var mario = new Heroe(canvas.height/3, canvas.height - 64, heroe);
var luigi = new Luigi(2*canvas.height/3, canvas.height - 64, luigiSprite);



//main functions

function generateEnemy() {
    if(frames % 120 === 0) {
        enemies.push(new Enemy(100, drone));
    }
}

function drawEnemies(){
    enemies.forEach(ene => {
        ene.draw();
    });
}

function update(){
    if(frames % 13 === 0) {
        MarioCurrentFrame = ++MarioCurrentFrame % 3;
    }

    if(frames % 13 === 0) {
        LuigiCurrentFrame = ++LuigiCurrentFrame % 3;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frames++;
    board.draw();
    generateEnemy();
    drawEnemies();
    mario.draw();
    luigi.draw();
    checkCollition();
}

function start(){
    interval = setInterval(update,1000/60);
}

function gameOver(){
    clearInterval(interval);
    ctx.font = "50px";
    ctx.fillStyle = "blue";
    ctx.fillText('GAME OVER',100,100);
    ctx.fillText(enemies.length, 226,100);
}


function generateEnemy(){
    if(frames % 64 === 0){
        const x = Math.floor(Math.random() * 16);
        enemies.push(new Enemy(x * 64, drone));
    }
}

function drawEnemies(){
    enemies.forEach(function(enemy){
        enemy.draw();
    })
}

function checkCollition(){
    enemies.forEach(enemy => {
        if(mario.checkIfTouch(enemy) && mario.isAlive){
            console.log('game over');
            mario.isAlive = false;
            if (!luigi.isAlive) {
                gameOver();
            }
        }
        if(luigi.checkIfTouch(enemy) && luigi.isAlive){
            console.log('game over');
            luigi.isAlive = false;
            if (!mario.isAlive) {
                gameOver();
            }
        }
    })
}


//listeners

addEventListener('keydown', function(e){
    if(e.keyCode === 65){
        if(mario.x <= 0) return;
        mario.imagen.src = "img/marioiz.png";
        mario.x -= 34;
    }
    if(e.keyCode === 68){
        if(mario.x >= canvas.width - 4) return;
        mario.imagen.src = "img/mariodr.png";
        mario.x += 34;
    }
    
    if(e.keyCode === 37){
        if(luigi.x <= 0) return;
         luigi.imagen.src = "img/luigiiz.png";
        luigi.x -= 34;
    }
    if(e.keyCode === 39){
        if(luigi.x >= canvas.width - 4) return;
        luigi.imagen.src = "img/luigidr.png";
        luigi.x += 34;
    }
    
})



start();

