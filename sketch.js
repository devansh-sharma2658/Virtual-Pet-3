var dog,happyDog,sadDog,database,foodS,foodStock;
var sadDogImg,happyDogImg;
var feedButton,AddFoodButton;
var food;
var fedTime,lastFed;
var readState,gameState;
var bedroomImg,gardenImg,washroomImg;
var bedroom, garden, bathroom;
var hour1;

function preload()
{
  sadDogImg = loadImage("vpImages/dogImg.png");
  happyDogImg = loadImage("vpImages/dogImg1.png");
  bedroomImg = loadImage("vpImages/BedRoom.png")
  gardenImg = loadImage("vpImages/Garden.png")
  washroomImg = loadImage("vpImages/WashRoom.png")
}

function setup() {
  createCanvas(900,500);
  bedroom = createSprite(displayWidth/2, 250);
  bedroom.addImage(bedroomImg);
  bedroom.scale = (2);

  bedroom.visible = false;

  bathroom = createSprite(displayWidth/2-20, 250);
  bathroom.addImage(washroomImg);
  bathroom.scale = (1.6);

  bathroom.visible = false;

  garden = createSprite(displayWidth/2, 250);
  garden.addImage(gardenImg);
  garden.scale = (2.6);

  garden.visible = false;

  database = firebase.database();

  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  food = new Food();
  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    fedTime = data.val();
  });
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
  feedButton = createButton("Feed The Dog");
  feedButton.position(685,100);
  feedButton.mousePressed(feedDog);

  AddFoodButton = createButton("Add Food");
  AddFoodButton.position(795,100);
  AddFoodButton.mousePressed(AddFood);

}
function draw() {
  currentTime = hour();
  if(currentTime==(lastFed+1)){
  update("Playing");
  food.garden();
  }else if(currentTime==(lastFed+2)){
  update("Sleeping")
  food.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing")
  food.washroom();
  }else{
  update("Hungry")
  food.display();
  }

   

  background(46,139,87);  
  food.display();
  drawSprites();
  textSize(20);
  fill("white");
  text("Food Remaining: "+foodS,170,100);
  if(fedTime>=12){
fill("white");
textSize(15); 
text("Last Fed : "+ fedTime%12 + " PM", 350,30);
}
else if(fedTime==0){
fill("white");
textSize(15); 
text("Last Fed : 12 AM",350,30);
}
else
{
fill("white");
textSize(15); 
text("Last Fed : "+ fedTime + " AM", 350,30);

if(gameState!="Hungry"){
feedButton.hide();
AddFoodButton.hide();
dog.remove();
}else{
feedButton.show();
AddFoodButton.show();
dog.addImage(sadDogImg);
}

}
drawSprites();
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
dog.addImage(happyDogImg);
foodS--;
database.ref('/').update({
Food : foodS
})
fedTime = hour(); 
}

function AddFood(){
dog.addImage(sadDogImg);
foodS++;
database.ref('/').update({
Food:foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState : state
  })
}

async function hour(){
  response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  responseJSON = await response.json();

  datetime = responseJSON.datetime;
  hour1 = datetime.slice(11, 13) ;
  minute = datetime.slice(14, 16);
}