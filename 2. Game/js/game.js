// JavaScript source code
var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
ctx.canvas.width  = 800;
ctx.canvas.height = 800;

var ship;
var target = { x: 0, y: 0 };

var game = {
    run: function () {
        console.log("Preloading")
        preload();
        create();
    
    
        },
    preloader: {
        images: {},
        toLoad: 0,
        hasLoad: 0,
        isReady: function () {
            console.log(this.toLoad + " - " + this.hasLoad);
            return this.toLoad == this.hasLoad
        },
        loaded: function () {
            console.log("Loaded")
            game.preloader.hasLoad++
        },
        loadImage: function (name, src) {
            var image = new Image();
            this.toLoad++;
            image.onload = game.preloader.loaded;
            image.src = src;
            this.images[name] = image;
            
        }

    }
    
    
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function preload() {
    game.preloader.loadImage("blue_ship_1", "assets/ships/ship_blue_1.png")
    game.preloader.loadImage("blue_ship_2", "assets/ships/ship_blue_2.png")
    game.preloader.loadImage("blue_ship_3", "assets/ships/ship_blue_3.png")
    game.preloader.loadImage("blue_ship_4", "assets/ships/ship_blue_4.png")
    game.preloader.loadImage("blue_ship_5", "assets/ships/ship_blue_5.png")
    game.preloader.loadImage("red_ship_1", "assets/ships/ship_red_1.png")
    game.preloader.loadImage("red_ship_2", "assets/ships/ship_red_2.png")
    game.preloader.loadImage("red_ship_3", "assets/ships/ship_red_3.png")
    game.preloader.loadImage("red_ship_4", "assets/ships/ship_red_4.png")
    game.preloader.loadImage("red_ship_5", "assets/ships/ship_red_5.png")

    
}
function create() {
    if (game.preloader.isReady() == false) {
        window.setTimeout(create, 100);
    } else {
        console.log("Done");
        ship = createShip();


        update();
    }
}

function update() {


    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(Math.PI / 180 * ship.rotation);
    ctx.drawImage(ship.image, - (ship.image.width / 2), - (ship.image.height / 2));
    ctx.restore();

    window.requestAnimationFrame(update)
}

function createShip(){
    var ship = {
        image: game.preloader.images["blue_ship_1"],
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
        rotation: 0
    }
    return ship
}

canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    target.x = mousePos.x;
    target.y = mousePos.y;
})







game.run();