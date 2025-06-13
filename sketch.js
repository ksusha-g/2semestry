var backgroundAudio = new Audio('assets/sound/background.mp3');
var canyonAudio = new Audio('assets/sound/canyon.mp3');
var coinAudio = new Audio('assets/sound/coin.mp3');
let musicOn;
let musicOff;

let player;
let floor;
let bushes = [];
let countBushes = 6;
let canyons = [];
let countCanyons = 7;
let clouds = [];
let countClouds = 53;
let platforms = [];
let countPlatforms = 8;
let enemies = [];
let countEnemies = 6; 
let collectableItems = [];
let countCI = 8;
let counterCI = 0;
let counterE = countEnemies;
let onGrounded;
let basefloor = 200;
let cameraX = 0; // Положение камеры по X
let rightBorder = 4500; // Граница уровня право
let leftBorder = 0;   // Граница уровня лево
let restartButton;
let gamePaused = false;

function preload()
{
    musicOn = loadImage('/assets/image/on.jpg');
    musicOff = loadImage('/assets/image/off.jpg');
    music = true;
}

function setup()
{
    soundSlider = createSlider(0, 255, 0);
    soundSlider.position(-1000, 7);

    createCanvas(1024, 800);
    player = 
    {
        x: 100,
        y: 100,
        r: 60,
        width: 30,
        height: 35,
        speedGravity: -5,
        color: color('white'),
        grounded: false,
        dead: false,
        speedRun: 4,
        respawnPos: 150,
        drawPlayer: function()
        {
            strokeWeight(1);
            stroke(0);
            fill(this.color);
            circle(this.x - cameraX, this.y+1, this.r);
            circle(this.x - cameraX, this.y-35, this.r-15);
            circle(this.x - cameraX, this.y-65, this.r-25);
            strokeWeight(4);
            stroke(0);
            point(this.x - cameraX, this.y-20);
            point(this.x - cameraX, this.y-40);
            point(this.x-10 - cameraX, this.y-65);
            point(this.x+10 - cameraX, this.y-65);
            point(this.x - cameraX, this.y);
            strokeWeight(4);
            stroke('#ffa500');
            point(this.x - cameraX, this.y-60);
        },
        gravity: function (floor) 
        {
            let onPlatform = this.checkPlatform();

            if (onPlatform) 
            {
                // Если на платформе, устанавливаем y в положение платформы и обнуляем speedGravity
                for (let i = 0; i < platforms.length; i++) 
                {
                    let platform = platforms[i];
                    if 
                    (
                        this.x + this.width / 2 > platform.x &&
                        this.x - this.width / 2 < platform.x + platform.width &&
                        this.y + this.height / 2 >= platform.y &&
                        this.y + this.height / 2 <= platform.y + platform.height
                    ) 
                    {
                        this.y = platform.y - this.height / 2; // Устанавливаем y в положение платформы
                        this.grounded = true;
                        this.speedGravity = 0; // Обнуляем speedGravity при приземлении на платформу
                        break;
                    }
                }
            } 
            else {
                // Если не на платформе, применяем гравитацию
                if (this.speedGravity > -5) 
                    this.speedGravity--;
                if (this.y + this.height / 2 < height - floor.height) 
                {
                    this.y -= this.speedGravity;
                    this.grounded = false;
                } 
                else {
                    this.grounded = true;
                    this.y = height - floor.height - this.height / 2;
                    this.speedGravity = 0; // Обнуляем speedGravity при приземлении на землю
                }
            }
        },

        jump: function()
        {
            this.speedGravity = 15;
            this.y -= this.speedGravity;
            this.grounded = false;
        },

        moveLeft: function()  { this.x -= this.speedRun; },
        moveRight: function() { this.x += this.speedRun; },
        movement: function() 
        {
            if (!this.dead && !gamePaused)
            {
                if ( this.grounded && keyIsDown(32))
                    this.jump();
                if (keyIsDown(68) && this.x < rightBorder + 100)
                    this.moveRight();
                if (keyIsDown(65) && this.x > leftBorder - 500)
                    this.moveLeft();
            }
        },
  
        checkCanyon: function() {
            for(let i = 0; i < canyons.length; i++)
            {
                if
                (
                    this.y + this.height >= height - floor.height && 
                    this.x >= canyons[i].x && 
                    this.x + this.width <= canyons[i].x + canyons[i].width + 15
                )
                {
                    this.grounded = false;   
                    this.dead = true; 
                    showRestartButton();
                }
            }
        },

        checkPlatform: function() 
        {
            for (let i = 0; i < platforms.length; i++) 
            {
                let platform = platforms[i];
                if 
                (
                    this.x + this.width / 2 > platform.x &&
                    this.x - this.width / 2 < platform.x + platform.width &&
                    this.y + this.height / 2 >= platform.y &&
                    this.y + this.height / 2 <= platform.y + platform.height
                )
                return true; // Возвращаем true, если на платформе
            }
            return false; // Возвращаем false, если не на платформе
        },

        checkCollectable: function()
        {
            for (let i = 0; i < countCI; i++)
            {
                let item = collectableItems[i];
                if (this.x >= (item.x - 40) && this.y < item.y + 40 && this.x <= (item.x+40))
                {
                    item.y = -100;
                    counterCI += 1;
                    coinAudio.play();
                }
            }
        },

        checkEnemy: function()
        {
            for (let i = 0;  i < enemies.length; i++)
            {
                let enemy = enemies[i];
                if
                (
                    this.x >= enemy.x &&
                    this.x <= enemy.x + enemy.width + 20 &&
                    this.grounded == false &&
                    this.y > enemy.y - enemy.width + 15
                    
                )
                {
                    enemy.y = 900;
                    counterE -= 1;
                    canyonAudio.play();
                }  

                else if 
                (
                    this.x >= enemy.x &&
                    this.x <= enemy.x + enemy.width + 20 &&
                    this.y > enemy.y - enemy.width + 15
                )
                {
                    this.dead = true;
                    showRestartButton();
                }
            }
        }
    };

    floor = {
        y: 0,
        height: 200,
        drawHeight: 200,
        name:"floor",
        color: color(10, 100, 10),
        drawFloor: function()
        {
            noStroke();
            fill(this.color);
            rect(0, height - this.drawHeight, width, this.drawHeight);
        },
    }  

    for (let i = 0; i < countCanyons; i++)
    {
        canyons.push
        (
            {
                x: 250 + i * 600,
                y: height-floor.height,
                width: 100,
                drawCanyon: function()
                {
                    fill(100);
                    rect(this.x- cameraX, this.y, this.width, floor.height);
                }
            }
        );
    }

    for (let i = 0; i < countPlatforms; i++) 
    {
        platforms.push
        (
            {
                x: 300 + i * 500,
                y: random(475, 500),
                width: 100 + random(30),
                height: 20,
                color: color('white'),
                drawPlatform: function() 
                {
                    noStroke();
                    fill(this.color);
                    rect(this.x- cameraX, this.y, this.width, this.height);
                }
            }
        );
    }

    for (let i = 0; i < countCI; i++)
    {
        collectableItems.push
        (
            {
                r: 40,
                posY: platforms[i].y - platforms[i].height - 120,
                x: platforms[i].x + random(30, 100),
                y: platforms[i].y - platforms[i].height - 120,
                
                drawCollectable: function()
                {
                    strokeWeight(1);
                    stroke(1);
                    fill("yellow");
                    ellipse(this.x-cameraX, this.y, this.r, this.r);
                }
            }
        );
    }

    for (let i = 0; i < countClouds; i++)
    {
        clouds.push
        (
            {
                x: random(-900, -700)+i*100,
                y: random(20, 250),
                r: random(30, 65),
                drawCloud: function()
                {
                    noStroke()
                    fill("white");
                    ellipse(this.x - cameraX, this.y, this.r, this.r);
                    ellipse(this.x+this.r- cameraX, this.y, this.r, this.r);
                    ellipse(this.x+this.r/2- cameraX, this.y-this.r/2, this.r, this.r);
                    rect(this.x- cameraX, this.y, this.r, this.r/2);
                }
            }
        );
    }

    for (let i = 0; i < countEnemies; i++)
    {
        enemies.push
        (
            {
                posY: 550,
                x: canyons[i].x + random(100, 500),
                y: 550, 
                width: 50,
                moveSpeed: 3,
                borderL: canyons[i].x + random(100, 160),
                borderR: canyons[i].x + random(400, 500),
                direction: 1,
                drawEnemy: function()
                {
                    strokeWeight(2);
                    stroke(0);
                    fill("white");
                    rect(this.x-cameraX, this.y, this.width, this.width);
                    strokeWeight(7);
                    stroke(0);
                    point(this.x + this.width/4 - cameraX, this.y + this.width/2);
                    point(this.x + this.width*0.75 - cameraX, this.y + this.width/2);
                },

                movementE: function()
                {
                    if (!gamePaused && !player.dead)
                    {
                        if (this.x > this.borderR)
                        {
                            this.direction = -1;
                        }
                        else if (this.x < this.borderL)
                            this.direction = 1;

                        this.x += (this.moveSpeed * this.direction)
                    }
                }
            }
        );
    }

    for (let i = 0; i < countBushes; i++)
    {
        bushes.push
        (
            {
                x: canyons[i].x + random(200, 500),
                y: 555,
                r: random(43, 50),
                drawBush: function()
                {
                    noStroke();
                    fill("#249150");
                    ellipse(this.x-cameraX, this.y, this.r, this.r);
                    ellipse(this.x-35-cameraX, this.y+15, this.r+10, this.r+10);
                    ellipse(this.x+25-cameraX, this.y+5, this.r-5, this.r-5);
                    ellipse(this.x+35-cameraX, this.y+25, this.r, this.r);
                    ellipse(this.x-cameraX, this.y+20, this.r+3, this.r+3);
                    fill("#34cf72");
                    ellipse(this.x-cameraX, this.y, this.r-7, this.r-7)
                    ellipse(this.x-35-cameraX, this.y+15, this.r+3, this.r+3);
                    ellipse(this.x+25-cameraX, this.y+5, this.r-12, this.r-12);
                    ellipse(this.x+35-cameraX, this.y+25, this.r-7, this.r-7); 
                    ellipse(this.x-cameraX, this.y+20, this.r-5, this.r-5);
                    //blueberries
                    strokeWeight(6);
                    stroke("#5200a3");
                    point(this.x+5-cameraX, this.y);
                    point(this.x-20-cameraX, this.y+10);
                    point(this.x+25-cameraX, this.y+14);
                    strokeWeight(4);
                    stroke("#5200a3");
                    point(this.x-45-cameraX, this.y+5);
                    point(this.x-5-cameraX, this.y+26);
                    point(this.x-35-cameraX, this.y+30);
                    strokeWeight(5);
                    stroke("#5200a3");
                    point(this.x+35-cameraX, this.y+35); 
                }
            }
        );
    }
}

function drawIgloo()
{
    stroke(0);
    strokeWeight(1);
    fill("white");
    ellipse(-400-cameraX, 600, 300, 400);
    fill("#87CEEB");
    ellipse(-400-cameraX, 600, 70, 140);
    fill(10, 100, 10);
    noStroke();
    rect(-550-cameraX, 600, 450, 400);

    stroke(0);
    strokeWeight(1);
    fill("white");
    ellipse(rightBorder-cameraX, 600, 300, 400);
    fill("#fa9de1");
    ellipse(rightBorder-cameraX, 600, 70, 140);
    fill(10, 100, 10);
    noStroke();
    rect(rightBorder-cameraX-300, 600, 450, 400); 

    strokeWeight(1);
    stroke(0);
    fill("white");
    circle(rightBorder - cameraX-50, 575+1, 55);
    circle(rightBorder - cameraX-50, 575-30, 55-15);
    circle(rightBorder - cameraX-50, 575-57, 55-25);
    strokeWeight(4);
    stroke(0);
    point(rightBorder - cameraX-50, 575-20);
    point(rightBorder - cameraX-50, 575-37);
    point(rightBorder - cameraX-9-50, 575-58);
    point(rightBorder - cameraX+9-50, 575-58);
    point(rightBorder - cameraX-50, 575);
    strokeWeight(4);
    stroke('#ffa500');
    point(rightBorder - cameraX-50, 575-53);
    fill("#fccff0");
    strokeWeight(1);
    stroke("#fccff0");
    ellipse(rightBorder-cameraX-50, 575-74, 5, 10);
    triangle(rightBorder-1-cameraX-50, 500, rightBorder-11-cameraX-50, 510, rightBorder-11-cameraX-50, 490);
    triangle(rightBorder+1-cameraX-50, 500, rightBorder+11-cameraX-50, 510, rightBorder+11-cameraX-50, 490);
    if (counterCI == 8 && counterE == 0)
    {
        fill("#fccff0")
        rect(rightBorder - cameraX - 235, 450, 260, 30);
        fill(0);
        text("You are my hero <3!!",rightBorder - cameraX - 220, 475); 
    }
    else {
        fill("#fccff0")
        rect(rightBorder - cameraX - 235, 450, 180, 30);
        fill(0);
        text("Save meee!!",rightBorder - cameraX - 220, 475);
    }
}


function drawSound()
{
    if (backgroundAudio.volume == 0)
        image(musicOff, 0, 0, 30, 30); 
    else
        image(musicOn, 0, 0, 30, 30);
}

function changeVolumeSound()
{
    backgroundAudio.setVolume(soundSlider.value());
    canyonAudio.setVolume(soundSlider.value());
    coinAudio.setVolume(soundSlider.value());
}

function showRestartButton() 
{
    if (restartButton) 
        restartButton.remove();
    restartButton = createButton('wanna play again?');
    restartButton.position(width / 2 - 50, height / 2);
    restartButton.style('font-size', '25px');
    restartButton.style('padding', '10px 20px');
    restartButton.style('background-color', 'white'); 
    restartButton.style('color', '0'); 
    restartButton.mousePressed(restartGame);
}

function restartGame() 
{
    player.x = 100;
    player.y = 100;
    player.dead = false;
    for (let i = 0; i < collectableItems.length; i++)
        collectableItems[i].y = collectableItems[i].posY;
    for (let i = 0; i < enemies.length; i++)
        enemies[i].y = enemies[i].posY;

    restartButton.remove();
    gamePaused = false;
    counterCI = 0;
    counterE = 6;
}

function keyPressed()
{
    if (!gamePaused && keyIsDown(80))
    {
        showRestartButton();
        gamePaused = true;
    }
    else if (gamePaused && keyIsDown(80))
    {
        restartButton.remove();
        gamePaused = false;
    }
    
}

function showSoundSlider()
{
    if (gamePaused) 
    { 
        soundSlider.position(530, 350); 
        stroke("#7dc4fa");
        strokeWeight(3);
        fill("#afdafc");
        rect(385, 225, 400, 300);
    }
    else { soundSlider.position(-1000, 7); }
}

function counter()
{
    textSize(25);
	fill(255);
	stroke(0);
    text("Coins:", 10, 60);
    text(counterCI, 90, 60);
    text("Enemies to beat:", 10, 80);
    text(counterE, 210, 80)
}

function draw() 
{
    backgroundAudio.play();
    background("#4da3ff");
    floor.drawFloor();
    if (player.x < rightBorder-400 && player.x > leftBorder) { cameraX = player.x - width / 2; }
    for (let i = 0; i < canyons.length; i++) { canyons[i].drawCanyon(cameraX); }
    for (let i = 0; i < bushes.length; i++) { bushes[i].drawBush(cameraX); }
    for (let i = 0; i < platforms.length; i++) { platforms[i].drawPlatform(cameraX); }
    for (let i = 0; i < collectableItems.length; i++) { collectableItems[i].drawCollectable(cameraX); }

    for (let i = 0; i < clouds.length; i++)
    {
        clouds[i].x += 0.5; 
        clouds[i].drawCloud(cameraX);
        if (clouds[i].x > rightBorder + 400)
            clouds[i].x = -700;
    }

    for (let i = 0; i < countEnemies; i++)
    {
        enemies[i].drawEnemy(cameraX);
        enemies[i].movementE(cameraX);
    }

    drawIgloo();
    counter();
    player.drawPlayer(cameraX);
    player.checkCanyon();
    player.checkPlatform();
    player.checkCollectable();
    player.checkEnemy();
    player.gravity(floor);
    player.movement(); 

    showSoundSlider();
    drawSound();
    backgroundAudio.volume = soundSlider.value() / 255;
    canyonAudio.volume = soundSlider.value() / 255;
    coinAudio.volume = soundSlider.value() / 255;
}
