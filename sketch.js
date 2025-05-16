/*var background_music = new Audio('assets/sound/background.mp3');
var kill_se = new Audio('assets/sound/canyon.mp3');
var death_se = new Audio('assets/sound/attack.mp3');

let player;
let switcher;
let sky;
let moon;
let stars;
let tree;
let floor;
let pond;
let highlights;
let underwater;
let score = 0;
let enemy;
let backPlay;


let countCanyons = 1;
let canyons = [];
let countPlatforms = 1;
let platforms = [{ x: 540, y: 330, width: 100, height: 10 }];
let onGrounded;
let basefloor = 200;

let soundSlider;
let musicSlider;
let musicSliderVisible = false;
let soundSliderVisible = false;
let restartButton;
let gamePaused = false;

function preload() {
    soundFormats('mp3');
    background_music = loadSound('assets/sound/background.mp3'); // connect sound from directory
    death_se = loadSound('assets/sound/canyon.mp3');
    kill_se = loadSound('assets/sound/attack.wav');
    backPlay = true;
}

function setup()
{
    createCanvas(1024, 576);
    player = 
    {
        x: 470,
        y: 210,
        width: 80,
        height: 80,
        speedGravity: -5,
        color1: color(205, 207, 89),
        color2: color(240, 234, 228),
        grounded: false,
        dead: false,
        drawPlayer: function()
        {
            noStroke() // bro
            fill(this.color1);
            ellipse(this.x, this.y, this.width, this.height);
            fill(this.color2);
            ellipse(this.x-13, this.y-10, this.width-65, this.height-50)
            ellipse(this.x+13, this.y-10, this.width-65, this.height-50)
            fill('black')
            ellipse(this.x-13, this.y-10, this.width-75, this.height-65)
            ellipse(this.x+13, this.y-10, this.width-75, this.height-65)
            rect(this.x-10, this.y+25, this.width-60, this.height-77)
        },
        gravity: function (floor) {
            let onPlatform = false;

            // check if the player is on any platform
            for (let i = 0; i < platforms.length; i++) {
                let platform = platforms[i];
                if (
                    this.x + this.width / 2 > platform.x &&
                    this.x - this.width / 2 < platform.x + platform.width &&
                    this.y + this.height / 2 >= platform.y &&
                    this.y + this.height / 2 <= platform.y + platform.height
                ) {
                    onPlatform = true;
                    this.grounded = true;
                    this.y = platform.y - this.height / 2; // align player on top of the platform
                    break;
                }
            }
        
            // check for ground if not on a platform
            if (!onPlatform) {
                if (this.speedGravity > -5) this.speedGravity--;
                if (this.y + this.height / 2 < height - floor.height) {
                    this.y -= this.speedGravity;
                    this.grounded = false;
                } else {
                    this.grounded = true;
                    this.y = height - floor.height - this.height / 2; // align player on the ground
                }
            }
        },
        jump: function()
        {
            this.speedGravity = 15;
            this.y -= this.speedGravity;
            this.grounded = false;
        },
        moveLeft: function() 
        {   
            this.x = this.x - 5;
            
                noStroke()
                fill(205, 207, 89)
                ellipse(this.x, this.y, this.width, this.height)
                fill(240, 234, 228)
                ellipse(this.x-18, this.y-10, this.width-65, this.height-50)
                fill('black')
                ellipse(this.x-18, this.y-10, this.width-75, this.height-65)
                rect(this.x-15, this.y+25, this.width-65, this.height-77)
        },
        moveRight: function() 
        { 
            this.x = this.x + 5;
            
                noStroke()
                fill(205, 207, 89)
                ellipse(this.x, this.y, this.width, this.height)
                fill(240, 234, 228)
                ellipse(this.x+18, this.y-10, this.width-65, this.height-50)
                fill('black')
                ellipse(this.x+18, this.y-10, this.width-75, this.height-65)
                rect(this.x+5, this.y+25, this.width-65, this.height-77)
        },
        movement: function() 
        {
            if (!this.dead && !gamePaused)
            {
                if (this.grounded && keyIsDown(32))
                    this.jump();
                if (keyIsDown(68))
                    this.moveRight();
                if (keyIsDown(65))
                    this.moveLeft();
            }
        },
        deadAnimation: function()
        {
            if (this.dead)
            {
                if (this.y < height)
                    this.y -= this.speedGravity;
                else
                {
                    this.y = height - floor.height - this.width;
                    this.x = 400;
                    this.grounded = true;
                    this.dead = false;
                    death_se.play();
                }
            }
        },
        checkEnemy: function () {
            if (this.x >= enemy.x && this.x <= enemy.x + enemy.width) {
                if (this.y + 10 <= enemy.y && this.y + 10 >= enemy.y - enemy.height / 2) 
                    {this.dead = true;
                    score -= 1;
                    death_se.play();
                    showRestartButton();
                    }
                if (this.y + 10 <= enemy.y - enemy.height / 2 && this.y + 10 >= enemy.y - enemy.height)
                   {enemy.dead = true;
                    score += 1;
                    kill_se.play();
                   }
            }

            if (this.dead) this.deadAnimation();
            if (enemy.dead) enemy.deadAnimation();
        },
        checkOutside: function() {
            if (this.x < -10)
                this.x = width - this.width + 10;
            if (this.x > width + 10)
                this.x = -10;
        },
        checkCanyon: function() {
            for(let i = 0; i < canyons.length; i++)
            {
                if
                (
                    this.y + this.height >= height - floor.height && 
                    this.x >= canyons[i].x && 
                    this.x + this.width <= canyons[i].x + canyons[i].width
                )
                {
                    this.grounded = false;   
                    this.dead = true;
                    showRestartButton();
                    death_se.play();
                    //this.deadAnimation();   
                }
            }
        }
        
    };

    sky = 
    {
        x:0,
        y:0,
        width: 1024,
        height: 380,
        color1: color(14, 32, 31),
        color2: color(10, 28, 27),
        drawSky: function()
        {
            fill(this.color1);
            rect(this.x, this.y, this.width, this.height);
            fill(this.color2);
            rect(this.x, this.y, this.width, this.height-52);
        },
    }
    
    moon =
    {
        x: 370,
        y: 90,
        w: 70,
        h: 70,
        color1: color(218, 225, 227),
        color2: color(193, 200, 201),
        color3: color(237, 243, 245),
        drawMoon: function()
        {
            noStroke();
            fill(this.color1);
            ellipse(this.x, this.y, this.w, this.h);
            fill(this.color2);
            ellipse(this.x-15, this.y+15, this.w-45, this.h-50);
            ellipse(this.x+20, this.y+10, this.w-50, this.h-40);
            ellipse(this.x-10, this.y-20, this.w-40, this.h-50);
            strokeWeight(7);
            stroke(174, 182, 184)
            point(this.x+5, this.y+25);
            strokeWeight(10);
            point(this.x-27, this.y-5);
            noStroke();
            fill(this.color3);
            ellipse(this.x+8, this.y-20, this.w-43, this.h-50)
        },
    }
    
    stars =
    {
        x: 0,
        y: 0,
        drawStars: function()
        {
            strokeWeight(2);
            stroke(218, 225, 227);
            point(this.x+150, this.y+70);
            point(this.x+220, this.y+160);
            point(this.x+120, this.y+280);
            point(this.x+300, this.y+290);
            point(this.x+600, this.y+110);
            point(this.x+790, this.y+60);
            point(this.x+860, this.y+170);
            point(this.x+700, this.y+220);
            point(this.x+500, this.y+270);
        },
    }
        
    tree =
    {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        x1: 860,
        y1: 462,
        x2: 890,
        y2: 462,
        x3: 875,
        y3: 320,
        color: color(48, 47, 47),
        drawTree: function()
        {
            noStroke();
            fill(this.color);
            triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
            strokeWeight(5); //ветки
            stroke(48, 47, 47);
            line(this.a+875, this.b+330, this.c+825, this.d+280) // main left
            line(this.a+875, this.b+335, this.c+895, this.d+235) // main right
            line(this.a+825, this.b+280, this.c+800, this.d+220) // l2
            line(this.a+800, this.b+220, this.c+780, this.d+200) // l3
            line(this.a+895, this.b+235, this.c+915, this.d+200) // r2
            line(this.a+875, this.b+330, this.c+850, this.d+190) // middle1
            line(this.a+850, this.b+190, this.c+860, this.d+130) // m2
            line(this.a+875, this.b+335, this.c+840, this.d+250) // ml
            line(this.a+875, this.b+335, this.c+820, this.d+315) // ниже слева1
            line(this.a+820, this.b+315, this.c+770, this.d+290) // ниже слева2
            line(this.a+820, this.b+315, this.c+785, this.d+320) // ниже слева22
            line(this.a+875, this.b+335, this.c+800, this.d+360) // ниже ниже слева
            line(this.a+875, this.b+335, this.c+940,this.d+ 280) // справа ниже
            line(this.a+940, this.b+280, this.c+960, this.d+250) // справа ниже2
            line(this.a+875, this.b+335, this.c+930, this.d+340) // ниже ниже справа
            line(this.a+930, this.b+340, this.c+955, this.d+330) // ниже ниже справа2
        },
    }
    
    floor = {
        height: 140,
        color: color(175, 192, 196),
        drawFloor: function()
        {
            noStroke();
            fill(this.color);
            rect(0, height - this.height, width, this.height); 
        },
    } 
    
    pond =
    {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        x4: 0,
        y4: 0,
        sand_color: color(154, 170, 173),
        lake_color: color(31, 46, 61),
        shade_color: color(20, 31, 41, 150),
        drawPond: function()
        {
            noStroke();
            fill(this.sand_color);
            quad(this.x1, this.y1+432, this.x2+310, this.y2+432, this.x3+420, this.y3+576, this.x4, this.y4+576);
            fill(this.lake_color);
            quad(this.x1, this.y1+432, this.x2+290, this.y2+432, this.x3+400, this.y3+576, this.x4, this.y4+576);
            fill(this.shade_color);
            quad(this.x1, this.y1+432, this.x2+270, this.y2+432, this.x3+380, this.y3+576, this.x4, this.y4+576);
        },
    }
    
    highlights =
    {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        drawHighlights: function()
        {
            strokeWeight(3);
            stroke(218, 225, 227);
            line(this.a+30, this.b+432, this.c+70, this.d+432);
            line(this.a+150, this.b+432, this.c+230, this.d+432);
            line(this.a+100, this.b+472, this.c+200, this.d+472);
            line(this.a+50, this.b+502, this.c+100, this.d+502);
            line(this.a+150, this.b+515, this.c+270, this.d+515);
            line(this.a+15, this.b+545, this.c+50, this.d+545);
        },
    }

    underwater =
    {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        color: color(21, 36, 51, 100),
        drawUnderwater: function()
        {
            noStroke();
            fill(this.color);
            rect(this.a, this.b+465, this.c+270, this.d+144);
        },
    }
    
    switcher = // '?'
    {
        x: 600,
        y: 290,
        color1: color(255, 0, 0),
        color2: color(255),
        drawSwitcher: function()
        {
            noStroke();
            fill(this.color2);
            textSize(20);
            text('?', this.x, this.y); 
            noStroke();
            fill(this.color1);
            textSize(20);
            text('?', this.x, this.y); 
        },
        
    }
    
    enemy = {
        x: 430,
        y: 410,
        width: 60,
        height: 60,
        borderLeft: 700,
        borderRight: 900,
        speed: 2,
        fallSpeed: 4,
        direction: 1,
        dead: false,

        draw: function () {
            noStroke();
            fill(144, 40, 40, 120);
            ellipse(this.x, this.y, this.width, this.height);
            noStroke();
            fill(switcher.color2);
            textSize(20);
            text('?', this.x-5, this.y-40); 
            fill(switcher.color1);
            textSize(20);
            text('?', this.x-5, this.y-40);
        },

        movement: function () {
            this.x += this.speed * this.direction;
            if (this.x <= this.borderLeft) {
                this.x += this.borderLeft - this.x;
                this.direction *= -1;
            } else if (this.x >= this.borderRight) {
                this.x -= this.x - this.borderRight;
                this.direction *= -1;
            }
        },

        deadAnimation: function () {
            if (this.dead) {
                this.fallSpeed += 1.2;
                this.y += this.fallSpeed;
            }
        },

        respawn: function () {
            if (this.dead) {
                this.x = random(this.borderLeft, this.borderRight);
                this.y = 410; 
                this.dead = false;
                this.fallSpeed = 4;
            }
        },
    };

    for(let i = 0; i < countCanyons; i++)
    {
        canyons.push
        (
            {
                //rect(0, 432, 270, 144)
                x: 0 + i * 400,
                y: height-floor.height,
                width: 270,
                drawCanyon: function()
                {
                    fill(21, 36, 51);
                    rect(this.x, this.y, this.width, floor.height);
                }
            }
        );
    };

    soundSlider = createSlider(0, 255, 125);
    soundSlider.position(420, 5);

    background_music.volume = 0.2;
    kill_se.volume = 0.2;
    death_se.volume = 0.2;
};

function drawPlatforms() {
    for (let i = 0; i < platforms.length; i++) {
        noStroke();
        fill(100, 100, 100);
        rect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }
}

function keyPressed()
{
    if (keyIsDown(77)) // 'M'
        changeMuteMusic();

    if (keyIsDown(49)) // '1'
        toggleMusicSlider();

    if (keyIsDown(50)) // '2'
        toggleSoundSlider();
}

function changeMuteMusic() 
{
    if (!backPlay) 
    {

        backPlay = true;
    }
    else
    {
        backPlay = false;
    }
}

function toggleMusicSlider() {
    if (musicSliderVisible) {
        musicSlider.remove(); // hide the slider
        musicSliderVisible = false;
    } else {
        showMusicSlider(); // show the slider
        musicSliderVisible = true;
    }
}

function showMusicSlider()
{
    musicSlider = createSlider(0, 1, 0.3, 0.1); 
    musicSlider.position(10, 100);
    musicSlider.style('width', '80px');
    musicSlider.input(changeVolumeMusic);
}

function changeVolumeMusic()
{
    background_music.setVolume(musicSlider.value());
}

function toggleSoundSlider() {
    if (soundSliderVisible) {
        soundSlider.remove(); // hide the slider
        soundSliderVisible = false;
    } else {
        showSoundSlider(); // show the slider
        soundSliderVisible = true;
    }
}

function showSoundSlider()
{
    soundSlider = createSlider(0, 1, 0.3, 0.1);
    soundSlider.position(10, 120);
    soundSlider.style('width', '80px');
    soundSlider.input(changeVolumeSound);
}

function changeVolumeSound()
{
    death_se.setVolume(soundSlider.value());
    kill_se.setVolume(soundSlider.value());
}

function showRestartButton() {
    gamePaused = true;
    restartButton = createButton('restart');
    restartButton.position(width / 2 - 50, height / 2);
    restartButton.style('font-size', '20px'); // increase font size
    restartButton.style('padding', '10px 20px'); // padding for a larger button
    restartButton.style('background-color', '#d40b0b'); // background color
    restartButton.style('color', '0'); // text color
    restartButton.mousePressed(restartGame);
}

function restartGame() {
    player.x = 470;
    player.y = 210;
    player.dead = false;
    score = 0;
    enemy.dead = false;
    enemy.x = 430;
    enemy.y = 410;

    restartButton.remove();
    gamePaused = false;
}

function draw()
{
    background_music.play();

    if (gamePaused) {
        // if the game is paused, draw the restart button only
        fill(255);
        textSize(20);
        text("you are dead", width / 2 - 60, height / 2 - 50);
        return;
    }

    background(18, 36, 35);
    sky.drawSky();
    moon.drawMoon();
    stars.drawStars();
    tree.drawTree();
    floor.drawFloor();
    pond.drawPond();
    for(let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    highlights.drawHighlights();
    drawPlatforms();
    
    enemy.draw();
    enemy.movement();
    enemy.respawn(); 
    
    player.drawPlayer();
    player.checkEnemy();
    player.checkCanyon();
    player.checkOutside();
    player.gravity(floor);
    player.movement();
    underwater.drawUnderwater();
    fill(switcher.color1);
    textSize(15);
    text(": " + score, 10, 30);
    text("'M' to play/stop music", 10, 50);
    text("'1' to change music volume", 10, 70);
    text("'2' to change sound volume", 10, 90);

    background_music.volume = soundSlider.value() / 255;
    death_se.volume = soundSlider.value() / 255;
    console.log("Громкость:", background_music.volume);
} */


var backgroundAudio = new Audio('assets/sound/background.mp3');
var canyonAudio = new Audio('assets/sound/canyon.mp3');
let musicOn;
let musicOff;
let music;

let player;
let floor;
let countCanyons = 7;
let countPlatforms = 5;
let canyons = [];
let clouds = [];
let countClouds = 40;
let platforms = [];
let checkpoints = [];
let onGrounded;
let basefloor = 200;
let cameraX = 0; // Положение камеры по X
let levelWidth = 4000; // Длина уровня

function preload()
{
    musicOn = loadImage('/assets/image/on.jpg');
    musicOff = loadImage('/assets/image/off.jpg');
    music = true
}

function setup()
{
    backgroundAudio.volume = 0.2;
    canyonAudio.volume = 0.2;

    soundSlider = createSlider(0, 255, 125);
    soundSlider.position(40, 7);

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

        moveLeft: function() 
        { this.x -= this.speedRun; 


        },
        moveRight: function() { this.x += this.speedRun; },
        movement: function() 
        {
            if (!this.dead)
            {
                if ( this.grounded && keyIsDown(32))
                    this.jump();
                if (keyIsDown(68))
                    this.moveRight();
                if (keyIsDown(65))
                    this.moveLeft();
            }
        },
        deadAnimation: function()
        {
           this.x = 100; 
           this.y = 100;
           this.dead = false
        },

        checkCanyon: function() {
            for(let i = 0; i < canyons.length; i++)
            {
                if
                (
                    this.y + this.height >= height - floor.height && 
                    this.x >= canyons[i].x && 
                    this.x + this.width <= canyons[i].x + canyons[i].width
                )
                {
                    this.grounded = false;   
                    this.dead = true;
                    this.deadAnimation();   
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

    for(let i = 0; i < countCanyons; i++)
    {
        canyons.push
        (
            {
                x: 250 + i * 400,
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
        platforms.push(
        {
            x: 300 + i * 500,
            y: random(475, 500),
            width: 80 + random(30),
            height: 20,
            color: color('white'),
            drawPlatform: function() 
            {
                fill(this.color);
                rect(this.x- cameraX, this.y, this.width, this.height);
            }
        });
    }

    console.log(platforms)

    for (let i = 0; i < countClouds; i++)
    {
        clouds.push
        (
            {
                x: random(40, 200)+i*100,
                y: random(20, 250),
                r: random(30, 65),
                drawCloud: function()
                {
                    noStroke()
                    fill("white");
                    ellipse(this.x - cameraX, this.y, this.r, this.r)
                    ellipse(this.x+this.r- cameraX, this.y, this.r, this.r)
                    ellipse(this.x+this.r/2- cameraX, this.y-this.r/2, this.r, this.r)
                    rect(this.x- cameraX, this.y, this.r, this.r/2)
                }
            }
        );
    }
}

function keyPressed()
{
    if (!music && keyIsDown(82))
    {
        backgroundAudio.volume = 0.2;
        canyonAudio.volume = 0.2;
        music = true
    }
    else if(music && keyIsDown(82)) 
    {
        backgroundAudio.volume = 0;
        canyonAudio.volume = 0;
        music = false
    }
}

function drawSound()
{
    if (!music)
        image(musicOff, 0, 0, 30, 30); 
    else
        image(musicOn, 0, 0, 30, 30);
}

function draw() 
{
    backgroundAudio.play();
    background("#4da3ff");
    floor.drawFloor();
    let desiredCameraX = player.x - width / 2;
    cameraX = desiredCameraX;
    for (let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon(cameraX);
    for (let i = 0; i < clouds.length; i++)
    {
        clouds[i].x += 0.5; 
        clouds[i].drawCloud(cameraX);
        if (clouds[i].x > levelWidth)
            clouds[i].x = -300;
    }
    for (let i = 0; i < platforms.length; i++) 
        platforms[i].drawPlatform(cameraX);
    player.drawPlayer(cameraX);
    player.checkCanyon();
    player.checkPlatform();
    player.gravity(floor);
    player.movement();
    drawSound();
}
