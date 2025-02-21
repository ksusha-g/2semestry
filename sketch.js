var backgroundAudio = new Audio('assets/sound/background.mp3');
var attackAudio = new Audio('assets/sound/attack.mp3');
var canyonAudio = new Audio('assets/sound/canyon.mp3');
let musicOn;
let musicOff;
let music;

let gameObj = 
{
    Untouch: 
    [ 
        new ground(0, 350, 1024, 200),
        new canyon(180, 350, 140, 500),

    ],
    
    Mountains: 
    [
        new mountain(750, 450, 500, 300, 600, 120),
        new mountain(650, 550, 400, 350, 500, 100)
    ],
    
    Bushes:
    [
        new bush(690, 310, 50),
        new bush(790, 315, 43),
        new bush(400, 320, 43),
    ],
    
    Clouds:
    [
        new cloud(200, 120, 50, 1,5),
        new cloud(600, 130, 70, 1,5),
        new cloud(400, 50, 100, 1,5),
        new cloud(900, 70, 110, 1,5),
        new cloud(90, 65, 90, 1,5),
        new cloud(800, 115, 95, 1,5),
        new cloud(40, 95, 105, 1,5)
    ],
    
    DangerSign:
    [
        new pillar(140, 305, 10, 45),
        new table(110, 290, 70, 45),
        new drawing(145, 307)
    ],
    
    CollectableItem:
    [
        new item(500, 320, 40),
        new item(250, 200, 40)
    ],
    
    Enemy:
    [
        new enemy(600, 280, 20, 10),
        new enemy(900, 220, 30, 15)
    ],
    
    Character: new character(50, 325, 60, 4, 50, 325, 60, 5, true)
}

function preload()
{
    musicOn = loadImage('/assets/image/on.jpg');
    musicOff = loadImage('/assets/image/off.jpg');
    music = true
}

function setup()
{
    createCanvas(1024, 476);
    backgroundAudio.volume = 0.2;
    attackAudio.volume = 0.2;
    canyonAudio.volume = 0.2;
}

function draw()
{
    backgroundAudio.play();
    background("#4da3ff");
    gameObj.Mountains.forEach(obj => obj.draw());
    gameObj.Untouch.forEach(obj => obj.draw());
    gameObj.Bushes.forEach(obj => obj.draw());
    gameObj.Clouds.forEach((cloud, ind) => (cloud.draw(), cloud.move()));
    gameObj.DangerSign.forEach(obj => obj.draw());
    gameObj.CollectableItem.forEach((item, ind) => (item.draw(), item.collection()));
    (character => (character.draw(), character.move()))(gameObj.Character);
    gameObj.Enemy.forEach((enemy, ind) => (enemy.draw(), enemy.death()));
    sound()
}

function sound()
{
    if (keyCode(82))
    {
        if (!music)
        {
            backgroundAudio.volume = 0.2;
            attackAudio.volume = 0.2;
            canyonAudio.volume = 0.2;
            image = (musicOn, 300, 200);
            music = true   
        }
        else
        {
            backgroundAudio.volume = 0;
            attackAudio.volume = 0;
            canyonAudio.volume = 0;
            image = (musicOff, 500, 700);   
            music = false
        }
          
    } 

}

function mountain(x1, x2, x3, y1, y2, y3)
{
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    
    this.draw = function()
    {
        strokeWeight(7);
        stroke("#63461f"); 
        fill("#805b28");
        triangle(this.x1, this.x2, this.x3, this.y1, this.y2, this.y3);
    }
    
    return this;
} 

function ground(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.widh = widh;
    this.lengh = lengh;
    
    this.draw = function() 
    {
        noStroke();
        fill("#5a9724");
        rect(this.x, this.y, this.widh, this.lengh);    
    }
    
    return this;
}

function bush(cordX, cordY, rad)
{
    this.x = cordX;
    this.y = cordY;
    this.r = rad;
    
    this.draw = function() 
    {
        noStroke();
        fill("#249150");
        ellipse(this.x, this.y, this.r);
        circle(this.x-35, this.y+15, this.r+10);
        circle(this.x+25, this.y+5, this.r-5);
        circle(this.x+35, this.y+25, this.r);
        circle(this.x, this.y+20, this.r+3);
        fill("#34cf72");
        circle(this.x, this.y, this.r-7)
        circle(this.x-35, this.y+15, this.r+3);
        circle(this.x+25, this.y+5, this.r-12);
        circle(this.x+35, this.y+25, this.r-7); 
        circle(this.x, this.y+20, this.r-5);
        //blueberries
        strokeWeight(6);
        stroke("#5200a3");
        point(this.x+5, this.y);
        point(this.x-20, this.y+10);
        point(this.x+25, this.y+14);
        strokeWeight(4);
        stroke("#5200a3");
        point(this.x-45, this.y+5);
        point(this.x-5, this.y+26);
        point(this.x-35, this.y+30);
        strokeWeight(5);
        stroke("#5200a3");
        point(this.x+35, this.y+35); 
    }
    
    return this;
}

function canyon(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.widh = widh;
    this.lengh = lengh;
    
    this.draw = function()
    {
        fill("#4da3ff");
        rect(this.x, this.y, this.widh, this.lengh);
    }
    
    return this;
}

function cloud(cordX, cordY, radius, speedMove)
{
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = speedMove;
    
    this.draw = function() 
    {
        strokeWeight(3);
        stroke("#cccccc");
        fill("white");
        ellipse(this.x, this.y-this.r/4, this.r/2);
        ellipse(this.x, this.y, this.r, this.r/2);
        noStroke();
        ellipse(this.x, this.y-this.r/4, this.r/2-5);
    },
    
    this.move = function()
    {
        if ((this.x - this.r) < 1024)
            this.x += this.s;
        else
            this.x = (4-this.r); //bring cloud to the left corner
    }
    
    return this;
}

function pillar(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.w = widh;
    this.l = lengh;
    
    this.draw = function()
    {
        strokeWeight(4);
        stroke("#3d2100");
        fill("#63461f");
        rect(this.x, this.y, this.w, this.l);
    }
    
    return this;
}

function table(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.w = widh;
    this.l = lengh;
    
    this.draw = function()
    {
        strokeWeight(4);
        stroke("#3d2100");
        rect(this.x, this.y, this.w, this.l);
    }
    
    return this;
}

function drawing(centerX, centerY) // centers of table to have symmetry
{
    this.x = centerX;
    this.y = centerY;
    
    this.draw = function()
    {
        noStroke()
        fill("white");
        circle(this.x, this.y, 20);
        strokeWeight(3);
        stroke('white');
        line(this.x+15, this.y+10, this.x-15, this.y+20);
        line(this.x-15, this.y+10, this.x+15, this.y+20);
        strokeWeight(1);
        stroke(0);
        line(this.x+6, this.y-6, this.x, this.y);
        line(this.x+6, this.y, this.x, this.y-6);
        line(this.x-6, this.y-6, this.x, this.y);
        line(this.x-6, this.y, this.x, this.y-6);
    }
    
    return this;
}

function item(cordX, cordY, raduis)
{
    this.x = cordX;
    this.y = cordY;
    this.r = raduis;
    
    this.draw = function()
    {
        strokeWeight(3);
        stroke("#cccccc");
        fill("white");
        circle(this.x, this.y, this.r);
        strokeWeight(5);
        stroke("#cccccc");
        point(this.x+7, this.y-7);
    }
    
    this.collection = function()
    {
        if (gameObj.Character.x > this.x && gameObj.Character.y > this.y)
        {
            this.x = -100;
            this.y = -100;       
        }
    }
    
    return this;
}

function enemy(cordX, cordY, widh, lengh)
{
    this.x = cordX;
    this.y = cordY;
    this.w = widh;
    this.l = lengh;
    this.enemyDefeated = false;
    
    
    this.draw = function()
    {
        strokeWeight(2);
        stroke("black");
        line(this.x+this.w, this.y+this.l/2, this.x+this.w+4, this.y+this.l/2)
        noStroke();
        fill("black");
        rect(this.x, this.y, this.w, this.l);
        fill("#f7eb00");
        rect(this.x+10, this.y, this.w/4, this.l);
        strokeWeight(4);
        stroke("white");
        point(this.x+4, this.y+4)
        
        if (this.enemyDefeated == true)
            point(this.x+4, this.y+4)
    },
        
    this.death = function()
    {
        if ((gameObj.Character.x+65) > this.x && gameObj.Character.rightEnemyAttackState == true && (gameObj.Character.y-65) < this.y)
        {
            this.y = -100;
            this.enemyDefeated = true;
        }
    }
     
    return this;
}

function character(cordX, cordY, radius, moveSpeed, constX, constY, constRadius, jumpSpeed)
{
    this.x = cordX;
    this.y = cordY;
    this.r = radius;
    this.s = moveSpeed;
    this.constX = constX;
    this.constY = constY;
    this.constR = constRadius;
    this.jumpSpeed = jumpSpeed;
    this.jumping = false;
    this.rightEnemyAttackState = false;
    
    this.draw = function()
    {
        strokeWeight(1);
        stroke(0);
        noStroke();
        fill('white');
        circle(this.x, this.y+1, this.r);
        circle(this.x, this.y-35, this.r-15);
        circle(this.x, this.y-65, this.r-25);
        strokeWeight(4);
        stroke(0);
        point(this.x, this.y-20);
        point(this.x, this.y-40);
        point(this.x-10, this.y-65);
        point(this.x+10, this.y-65);
        point(this.x, this.y);
        strokeWeight(4);
        stroke('#ffa500');
        point(this.x, this.y-60); 
    },
    
    this.move = function()
    {
        if (this.x > 195 && this.x < 305 && !this.jumping)
        {
            if (this.y < 500)
            {
                this.dead();
                this.y += 6;
                canyonAudio.play();
            }
            
            else
                this.respawn();
        }
        
        else if (580 < this.x && gameObj.Enemy.enemyDefeated == false)
            this.respawn();
        
        else
        {
            if (keyIsDown(68))
                this.moveRight();
            if (keyIsDown(65))
                this.moveLeft();
            if (keyIsDown(32) && this.y == constY)
            {
                this.jump();
                this.jumping = true;
            }
            
            if (keyIsDown(70) && keyIsDown(68))
                this.rightEnemyAttack();
                
            else if (keyIsDown(70) && keyIsDown(65))
                this.leftEnemyAttack();
            else if (keyIsDown(70))
                this.rightEnemyAttack();
            else
                this.rightEnemyAttackState = false;
            
            this.grounded();
        }

    },
    
    this.moveLeft = function()
    {
        if (this.x > 0 && !keyIsDown(68))
        {
            this.x -= this.s;
            noStroke();
            fill('#ffa500');        
            triangle(this.x+4, this.y-63, this.x+4, this.y-57, this.x-15, this.y-60);
        }
    },
    
    this.moveRight = function()
    {
        if (this.x < 1024 && !keyIsDown(65))
        {
            this.x += this.s;
            noStroke();
            fill('#ffa500');
            triangle(this.x-6, this.y-63, this.x-6, this.y-57, this.x+15, this.y-60);
        }
    },
    
    this.jump = function()
    {
        if(this.y > 100)
        {
            this.jumpSpeed = 8;
            this.y -= this.jumpSpeed;
        }
    },
    
    this.grounded = function()
    {
        if (this.y < this.constY)
        {
            this.jumpSpeed -= 0.5;
            this.y -= this.jumpSpeed; 
        }
        
        if (this.y == constY)
            this.jumping = false;
    }
    
    this.respawn = function()
    {
        this.x = this.constX;
        this.y = this.constY;
        this.r = this.constR;
        strokeWeight(1);
        stroke(0);
        noStroke();
        fill('white');
        circle(this.x, this.y+1, this.r);
        circle(this.x, this.y-35, this.r-15);
        circle(this.x, this.y-65, this.r-25);
        strokeWeight(4);
        stroke(0);
        point(this.x, this.y-20);
        point(this.x, this.y-40);
        point(this.x-10, this.y-65);
        point(this.x+10, this.y-65);
        point(this.x, this.y);
        strokeWeight(4);
        stroke('#ffa500');
        point(this.x, this.y-60);         
    },
        
    this.dead = function()
    {
        noStroke();
        fill("#4da3ff");
        rect(this.x+8.5, this.y-63, 3, 10);
        rect(this.x-11.5, this.y-63, 3, 10);
    },

    this.rightEnemyAttack = function()
    {
        strokeWeight(2);
        stroke("black");
        fill("white");
        circle(this.x+40, this.y-40, 25);
        this.rightEnemyAttackState = true;
        attackAudio.play();
    },
    
    this.leftEnemyAttack = function()
    {
        strokeWeight(2);
        stroke("black");
        fill("white");
        circle(this.x-40, this.y-40, 25); 
        attackAudio.play();
    }
        
    return this;
} 