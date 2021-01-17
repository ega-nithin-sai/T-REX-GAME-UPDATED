var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
var bird, birdImg, birdsGroup;

var highScore;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  birdImg = loadImage("bird.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height - 50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.8;
  
  ground = createSprite(width/2,height - 50,width,20);
  ground.addImage("ground",groundImage);
  ground.scale = 2.0;
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 25);
  restart.addImage(restartImg);
  
  invisibleGround = createSprite(width/2,height - 40,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  highScore = 0;
}

function draw() {
  
  background(180);
  //displaying score
  textSize(40);
  text("Score: "+ score, 500,50);
  text("High Score: "+ highScore, 100,50);
  
  if(gameState === PLAY){
    
    if(score % 150 === 0 && score !== 0){
      checkPointSound.play();
      
      ground.velocityX = ground.velocityX - 3;
    }
    
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(score/100 + 4);
    
    //Alternate method to increase the score
    // if(frameCount % 5 === 0){
    //   score++;
    // }
    
    //Frame Rate is the number of times the draw function is run in one second.
    score = score + Math.round(getFrameRate()/50);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space")&& trex.y >= height - 125) {
      trex.velocityY = -15;
      jumpSound.play();
      
      touches = [];
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    spawnBirds();
    
//     if(score > 800){
//       ground.velocityX = -8;
      
//     }
    
    if(obstaclesGroup.isTouching(trex) || birdsGroup.isTouching(trex)){
      //These two line are to add AI to the trex.
      //when the trex touches any of the cactus, the trex jumps. The collider has been adjusted.
      // trex.velocityY = -12;
      // jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
     //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     birdsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     birdsGroup.setVelocityXEach(0);
     
     //This is to reset the game when we die.
     //it is written in the end state, because we are still able to reset the game while playing.
     if(mousePressedOver(restart)){
       reset();
     }
   }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnBirds(){
  if(score > 1000 && score % 60 === 0){
    bird = createSprite(width + 50,Math.round(random(height - 100,height - 50)),20,20);
    bird.addImage("bird",birdImg);
    bird.scale = 0.2;
    bird.velocityX =  -10;
    bird.lifetime = 350;
    
    bird.depth = restart.depth;
    restart.depth++;
    
    birdsGroup.add(bird);
  }
}

function spawnObstacles(){
 if (frameCount % 150 === 0){
   var obstacle = createSprite(width + 50,height - 72,10,40);
   obstacle.velocityX = -(score/100 + 4);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 400;
   
   obstacle.depth = restart.depth;
   restart.depth++;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
     cloud = createSprite(width + 75,Math.round(random(100,150)),40,10);
    cloud.addImage(cloudImage);
    cloud.velocityX = -(score/100 + 4);
    
     //assign lifetime to the variable
    cloud.lifetime = 350;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  
  if(score > highScore){
    highScore = score;
  }
  
  score = 0;
  
  trex.changeAnimation("running", trex_running);
}