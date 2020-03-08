/*

Final Game project - Peter Ferreira

Comments on the two extentions that I added:

1st Extension - For the first extension I decided to add platforms to my game project, 
this made the game more difficult to capture all the coins. I found it challenging to 
get my game character to stand on top of the platform because I had a bug in my code 
that made it seem like my character was falling even though he was on top of 
the platform. I learned how to debug my project using console logging to see what my different 
variables were returning, this helped me find bugs in my code and correct them accordingly.
I learned how to create objects within a function and have methods within that object 
as well as using the “this” keyword to access properties within the object to use in the method.

2nd Extension – For the second extension I added enemies to my game project. If my game 
character came into contact with one of the enemies, they would lose a life, this made 
it more difficult to pass the stage. To create the enemy object, I used a constructor 
function, this allows many unique objects to be created using the “new” keyword and passing
the necessary parameters into the function call. I learned how useful it can be when you 
want to use re-use the same object throughout your program and how you can push these new 
unique objects into an array of objects. I found it quite challenging to determine when the 
game character had come into contact with the enemy but with my debugging skills, I managed 
to overcome any of the obstacles that I faced.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = floorPos_y - 150;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
     clouds = [
        { x_pos: 200, y_pos: 150, size: 80 },
        { x_pos: 800, y_pos: 200, size: 80 },
        { x_pos: 1300, y_pos: 160, size: 80 },
        { x_pos: 1600, y_pos: 200, size: 80 }];
    
    mountains = [
        { x_pos: 270, y_pos: 432 },
        { x_pos: 500, y_pos: 432 },
        { x_pos: 1200, y_pos: 432 },
        { x_pos: 1800, y_pos: 432 }];
    
    trees_x = [ 200, 500, 1000, 1200, 1500, 2000 ];
    
    canyons = [
        {x_pos: 70,width: 100},
        {x_pos: 850,width: 100},
        {x_pos: 2200,width: 100}];
    
    collectables = [ 
        { x_pos: 380, y_pos: floorPos_y - 30, size: 50, isFound: false},
        { x_pos: 890,  y_pos: floorPos_y - 350, size: 50, isFound: false},
        { x_pos: 1800, y_pos: floorPos_y - 80, size: 50, isFound: false}];
    
    platforms = [];
    
    platforms.push(createPlatforms(520,  floorPos_y - 100, 100));
    platforms.push(createPlatforms(600, floorPos_y - 200, 100));
    platforms.push(createPlatforms(680 , floorPos_y - 300, 100));

    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 2000};
    
    enemies = [];
    enemies.push(new Enemy(1222, floorPos_y, 200));
    enemies.push(new Enemy(-150, floorPos_y, 200));
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);
	
    // Draw clouds
    drawClouds();
    
	// Draw mountains
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
    // Draw platforms 
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
	// Draw canyons
    for( var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
            for(var j = 0; j < canyons.length; j++)
            {
                checkCanyon(canyons[i]);
            }
    }
    
	// Draw collectable items
    for( var i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);      
        }
    }
    
    // Draw flagpole
    renderFlagPole();
    
    //Draw Enemies
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                lives--;
                startGame();
                break;
            }
        }
    }
    
    pop();
	// Draw game character.
	drawGameChar();
    
    fill(255);
    noStroke();
    text("score: " + game_score, 20,20)
    
    text("Lives: ",20,50);
    for(var i = 0; i < lives; i++)
        {
            fill(255,255,0)
            ellipse(70 + i * 30,45,20,20);
        };
    
    if(lives < 1)
    {
        push();
        fill(255,0,0);
        strokeWeight(2);
        stroke(20);
        textSize(22);
        text("GAME OVER! Press ENTER to try again",width/3,height/2);
        pop();
        return;
    }
    
    if(flagpole.isReached)
    {
        push();
        fill(0,255,0);
        strokeWeight(2);
        stroke(20);
        textSize(22)  ;
        text("LEVEL COMPLETE! Press ENTER to try again",width/3,height/2);
        pop();
        return;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
        {
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                {
                    isContact = true;
                    break;
                }
            }
            if(isContact == false)
            {
                gameChar_y += 5;
                isFalling = true;
            }
            else 
            {
                isFalling = false;
            }
        }

    else
        {
            isFalling = false;
        }

    if(flagpole.isReached == false)
    {
        checkFlagPole();
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    checkPlayerDie();
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    // if statements to control the animation of the character when
	// keys are pressed.
    if(keyCode == 37)
        {
            isLeft = true;
        }
    
    else if(keyCode == 39)
        {
            isRight = true;
        }
    
    else if (keyCode == 32)
        {
            if(!isFalling)
            {
                gameChar_y = gameChar_y - 100;
            }
        }
    else if (keyCode == 13)
        {
            lives = 3;
            startGame();
        }
}

function keyReleased()
{
    // if statements to control the animation of the character when
	// keys are released.
    
    if(keyCode == 37)
    {
        isLeft = false;
    }
    
    else if(keyCode == 39)
    {
        isRight = false;
    }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 60, 20,25)
        fill(0,0,0)
        ellipse(gameChar_x - 7, gameChar_y - 60, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 4, gameChar_y - 48, 8, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 4, gameChar_y - 18, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x - 12, gameChar_y - 43, 15, 5)
	}
    
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 60, 20,25)
        fill(0,0,0)
        ellipse(gameChar_x + 7, gameChar_y - 60, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 4, gameChar_y - 48, 8, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 4, gameChar_y - 18, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x - 3, gameChar_y - 43, 15, 5)
	}
    
	else if(isLeft)
	{
		// add your walking left code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 50, 20,25)
        fill(0,0,0)
        ellipse(gameChar_x - 7, gameChar_y - 50, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 4, gameChar_y - 38, 8, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 4, gameChar_y - 8, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x - 2, gameChar_y - 33, 5, 15)
	}
    
	else if(isRight)
	{
		// add your walking right code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 50, 20,25)
        fill(0,0,0)
        ellipse(gameChar_x + 7, gameChar_y - 50, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 4, gameChar_y - 38, 8, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 4, gameChar_y - 8, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x - 3, gameChar_y - 33, 5, 15)
	}
    
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 60, 25)
        fill(0,0,0)
        ellipse(gameChar_x - 4, gameChar_y - 60, 2,2)
        ellipse(gameChar_x + 4, gameChar_y - 60, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 8, gameChar_y - 48, 16, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 10, gameChar_y - 18, 8, 8)

        fill(255,200,180)
        rect(gameChar_x + 2, gameChar_y - 18, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x + 8, gameChar_y - 43, 15, 5)

        fill(255,200,180)
        rect(gameChar_x - 23, gameChar_y - 43, 15, 5)
	}
    
	else
	{
		// add your standing front facing code
        //head and eyes
        fill(255,200,180)
        ellipse(gameChar_x, gameChar_y - 50, 25)
        fill(0,0,0)
        ellipse(gameChar_x - 4, gameChar_y - 50, 2,2)
        ellipse(gameChar_x + 4, gameChar_y - 50, 2,2)

        //body
        fill(0,0,255)
        rect(gameChar_x - 8, gameChar_y - 38, 16, 30)

        //feet
        fill(255,200,180)
        rect(gameChar_x - 10, gameChar_y - 8, 8, 8)

        fill(255,200,180)
        rect(gameChar_x + 2, gameChar_y - 8, 8, 8)

        //Arms
        fill(255,200,180)
        rect(gameChar_x + 8, gameChar_y - 33, 5, 15)

        fill(255,200,180)
        rect(gameChar_x - 13, gameChar_y - 33, 5, 15)
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
   for(var i = 0; i < clouds.length; i++)
   {
        fill(255,255,255)
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size, clouds[i].size)
        ellipse(clouds[i].x_pos - 40, clouds[i].y_pos, clouds[i].size - 20, clouds[i].size - 20)    
        ellipse(clouds[i].x_pos + 40, clouds[i].y_pos, clouds[i].size - 20, clouds[i].size - 20) 
   } 
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(194,178,128)
        triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos + 150, 
                 mountains[i].y_pos - 232, mountains[i].x_pos + 300, mountains[i].y_pos)
        triangle(mountains[i].x_pos - 50, mountains[i].y_pos, mountains[i].x_pos + 50, 
                 mountains[i].y_pos - 182, mountains[i].x_pos + 250, mountains[i].y_pos)  
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i<trees_x.length;i++)
    {
        fill(120,100,40)
        rect(trees_x[i],treePos_y,60,150)
        //branches
        fill(0,255,0)
        triangle(trees_x[i] - 50, treePos_y + 48, trees_x[i] + 30, 
                 treePos_y - 62, trees_x[i] + 110, treePos_y + 48) 
        triangle(trees_x[i] - 50, treePos_y + 88, trees_x[i] + 30, 
                 treePos_y - 22, trees_x[i] + 110, treePos_y + 88)
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(96,46,27)   
    rect(t_canyon.x_pos, 432, t_canyon.width, 20)    
    rect(t_canyon.x_pos + 5, 452, t_canyon.width - 10, 20)
    rect(t_canyon.x_pos + 10, 472, t_canyon.width - 20, 20)    
    rect(t_canyon.x_pos + 15, 492, t_canyon.width - 30, 20)
    rect(t_canyon.x_pos + 20, 512, t_canyon.width - 40, 20)
    rect(t_canyon.x_pos + 25, 532, t_canyon.width - 50, 20)
    fill(0, 80, 255)
    rect(t_canyon.x_pos + 30, 552, t_canyon.width - 60, 20)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((dist(gameChar_world_x,gameChar_y,t_canyon.x_pos + 40, gameChar_y) < 40) && (gameChar_y >= floorPos_y))
    {
        isPlummeting = true;
    }
    
    if(isPlummeting && gameChar_y < 800)
    {
        gameChar_y +=  1.5;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(212, 175, 55)
    ellipse(t_collectable.x_pos,t_collectable.y_pos,
            t_collectable.size,t_collectable.size)    
    fill(200, 150, 65)
    ellipse(t_collectable.x_pos,t_collectable.y_pos,
            t_collectable.size - 10, t_collectable.size - 10)
    fill(255);
    textStyle(BOLD)
    text("5", t_collectable.x_pos - 3, t_collectable.y_pos + 4);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos + 30) < 30)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function renderFlagPole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255,0,0);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 80,50)
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 80,50)
    }
    pop();
}

function checkFlagPole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
    }
}

function checkPlayerDie()
{
    if(gameChar_y > height && lives > 1)
    {
        lives -= 1;
        startGame();
    }
    if(gameChar_y > height && lives == 1)
    {
        lives -= 1;
    }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(255, 0, 0)
            rect(this.x, this. y, this.length, 20)
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = - 1;
        }
        
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        // add your standing front facing code
        //head and eyes
        fill(0)
        ellipse(this.currentX, this.y - 50, 30)
        fill(200,0,0)
        ellipse(this.currentX - 4, this.y - 50, 5)
        ellipse(this.currentX + 4, this.y - 50, 5)

        //body
        fill(0)
        rect(this.currentX - 8, this.y - 38, 16, 30)

        //feet
        fill(200,0,0)
        rect(this.currentX - 10, this.y - 8, 8, 8)

        fill(200,0,0)
        rect(this.currentX + 2, this.y - 8, 8, 8)

        //Arms
        fill(200,0,0)
        rect(this.currentX + 8, this.y - 33, 5, 15)

        fill(200,0,0)
        rect(this.currentX - 13, this.y - 33, 5, 15)
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 20)
        {
            return true;
        }
        
        return false;
    }
}

