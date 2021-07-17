//Section: Global Variables
var canvas;
var context;
var audio;
var gameInstructionShown = false;
var clickedCoordinates = new Array();
var score = document.getElementById("score");
var fails = document.getElementById("failed-attempt");

var components = new Array();
var selectedComponent;
var updateInterval;
var gameInterval;

var points = 0;
var failedAttempt = 0;
//End Section

document.onkeydown = function(event){
    event.stopPropagation();
    if(clickedCoordinates.length == 5){
        if(failedAttempt == 2){
            displayScore(points);
            audio = new Audio("./audio/score.wav");
            audio.play();
            updateScore();
            return;
        }
        if(selectedComponent && event.key == selectedComponent.type){
            audio = new Audio("./audio/success.wav");
            audio.play();
            points ++;
            updateScore();
        }
        else{
            audio = new Audio("./audio/wrong.wav");
            audio.play();
            failedAttempt++;
            updateScore();
        }
    }
}

function displayScore(points){

    canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.zIndex = "-1";

    gameEnd = document.getElementById('game-end');
    gameEnd.style.display = "flex"
    gameEnd.style.zIndex = "0"

    finalScore = document.getElementById("final-score");
    finalScore.innerHTML = points;
}

function updateScore(){
    score.innerHTML = "Score: "+ points;
    fails.innerHTML = failedAttempt;
}

function startOver(){
    startGame();
    gameInstructionShown = true;
    clickedCoordinates = new Array();
}

function resetVariables(){
    components = new Array();
    points = 0;
    failedAttempt = 0;
    selectedComponent = null;
    clearInterval(updateInterval);
    clearInterval(gameInterval);
    updateScore();
}

function startGame(){
    resetVariables();
    myGameArea.start();

    landingPage = document.getElementById('landing-page');
    landingPage.style.display = "none";

    canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.zIndex = "0";

    gameEnd = document.getElementById('game-end');
    gameEnd.style.display = "none";
    gameEnd.style.zIndex = "-1"

    showGameInstructions();
}

var myGameArea = {
    start : function() {
        width = window.innerWidth*0.95;
        height = window.innerHeight*0.9
        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext("2d");
    },
    clear : function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function updateGameArea(){
    if(clickedCoordinates.length == 5){
        myGameArea.clear();
        for(i = 0; i< components.length; i++){
            components[i].update();
        }
    }
}

function updateCanvasSize(){
    canvas.height = height;
    canvas.width = width;
    context.clearRect(0,0,canvas.width,canvas.height);
}

function showGameInstructions(){
    context.textAlign = "center";
    context.font = "20px Comic Sans MS";
    console.log(canvas.width, canvas.height, window.innerHeight, window.innerWidth)
    context.fillText("Try clicking on 5 arbitrary spots within this box, and play the game.",canvas.width/2, canvas.height/2);
    context.fillText("Game Instruction: To score press the keys on your keyboard that appeared in the highlighted shape.",canvas.width/2, canvas.height/2 + 40);
    gameInstructionShown = true;
}


function hideGameInstructions(){
    context.clearRect(0,0,canvas.width,canvas.height);
    gameInstructionShown = false;
}


function canvasClick(event){
    event.stopPropagation();
    //Hiding the game instruction for the first time
    if(gameInstructionShown){
        hideGameInstructions();
        return;
    }

    if(clickedCoordinates.length == 5){
        return;
    }

    //Record clicked coordinates
    var xCoordinate = event.layerX;
    var yCoordinate = event.layerY;
    clickedCoordinates.push({'x':xCoordinate, 'y':yCoordinate});
    console.log("Clicked at X = ", event.clientX, " and Y = ", event.clientY)
    context.beginPath();
    context.arc(xCoordinate, yCoordinate, 1, 0, 2 * Math.PI);
    context.stroke();

    if(clickedCoordinates.length == 5){
        plotComponents();
    }
}


function plotComponents(){
    //updateCanvasSize()
    for(coordinate of clickedCoordinates){
        var number = clickedCoordinates.indexOf(coordinate);
        comp = new component(coordinate.x, coordinate.y, number);
        components.push(comp);
    }
    updateInterval = setInterval(updateGameArea, 20);
    gameInterval = setInterval(function(){
        deselectAllItems();
        selectOneItem();
    }, 1000);
}


class component{
    constructor(x, y, type) {
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = "#1F5608";
    } 
    
    select = function(){
        this.color = "#271904";
    }

    deselect = function(){
        this.color = "#1E5608";
    }

    update = function() {
        context.fillStyle = this.color;
        switch(this.type){
            case 0:
                drawEllipse(this.x, this.y, this.type);
                break;
            case 1:
                drawRectangle(this.x, this.y, this.type);
                break;
            case 2:
                drawCircle(this.x, this.y, this.type);
                break;
            case 3:
                drawTriangle(this.x, this.y, this.type)
                break;
            case 4:
                drawSquare(this.x ,this.y, this.type);
                break;
            default:
                console.log("Default Type reached!")
                break;
        }
    }   
}

function selectOneItem(){
    random = getRandomInt(5);
    item = components[random];
    if(item){
        item.select();
        selectedComponent = item;
    }
}

function deselectAllItems(){
    for(item of components){
        item.deselect();
    }
}


function drawRectangle(x, y, type){
    context.save();
    context.fillRect(x-100, y-50, 200, 100);
    context.restore();
    context.fillStyle = "#FFFFFF";
    context.fillText(type, x, y);
}

function drawSquare(x, y, type){
    context.save();
    context.fillRect(x-50, y-50, 100, 100);
    context.restore();
    context.fillStyle = "#FFFFFF";
    context.fillText(type, x, y);
}

function drawCircle(x, y, type){
    context.save();
    context.beginPath();
    context.arc(x, y, 60, 0, 2 * Math.PI);
    context.fill();
    context.restore();
    context.fillStyle = "#FFFFFF";
    context.fillText(type, x, y);
}

function drawTriangle(x, y, type){
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x+70, y+140);
    context.lineTo(x+140, y);
    context.fill();
    context.restore();
    context.fillStyle = "#FFFFFF";
    context.fillText(type, x + 70, y + 70);

}

function drawEllipse(x, y, type){
    context.save(); // save state
    context.beginPath();
    context.ellipse(x, y, 60, 80, Math.PI/4, 0, 2*Math.PI);
    context.fill();
    context.restore(); // restore to original state
    //context.stroke();
    context.fillStyle = "#FFFFFF";
    context.fillText(type, x, y);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}