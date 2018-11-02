// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;


var shipsManager = {
    ships: [],
    add: function (ship) {
        this.ships.push(ship)
    },
    move: function () {
        for (var s in this.ships) {
            var ship = this.ships[s]
            ship.move()
            ship.vector.rotate(5 - (Math.random() * 10));
        }
    },
    draw: function () {
        for (var s in this.ships) {
            var ship = this.ships[s]
            graphics.draw(ship.sprite, ship.pos, ship.vector.toAngle())
        }
    }
    
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
    for (var x = 0; x < 10; x++) {
        ship = makeShip(game.preloader.images["blue_ship_1"])
        console.log(ship)
        shipsManager.add(ship)
    }
}


function update(delta) {
    shipsManager.move()
    shipsManager.draw()
}

function makeShip(sprite) {
    var s = {
        sprite: graphics.Sprite(sprite),
        pos: util.vector2d(400, 400),
        vector: util.vector2d(1 - (Math.random() * 2), 1 - (Math.random() * 2)),
        move: function () {
            this.pos.add(this.vector)
        }
    }
    return s
}

var target = { x: 0, y: 0 };

game.run()
