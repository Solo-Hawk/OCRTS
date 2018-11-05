// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;

function makeShip(sprite) {
    var s = {
        sprite: graphics.Sprite(sprite),
        pos: util.vector2d(400, 400),
        vector: util.vector2d(1 - (Math.random() * 2), 1 - (Math.random() * 2)), // This should of actually be called "velocity"
        steering: null,
        move: function () {
            this.steering.update();
        }
    }
    s.steering = steeringAI.newAgent(s)
    return s
}

var shipsManager = {
    ships: [],
    add: function (ship) {
        this.ships.push(ship)
    },
    move: function () {
        for (var s in this.ships) {
            var ship = this.ships[s]
            ship.move()
        }
    },
    draw: function () {
        for (var s in this.ships) {
            var ship = this.ships[s]
            graphics.draw(ship.sprite, ship.pos, ship.vector.toAngle())
        }
    }
    
}

var nodeManager = {
    nodes: [],
    add: function (x, y) {
        this.nodes.push({ x: x, y: y })
    }
}

var spawner = {
    
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
    for (var x = 0; x < 1; x++) {
        ship = makeShip(game.preloader.images["blue_ship_1"])
        console.log(ship)
        shipsManager.add(ship)
    }
}


function update(delta) {
    shipsManager.move()
    shipsManager.draw()
}



var target = { x: 0, y: 0 };

game.run()
