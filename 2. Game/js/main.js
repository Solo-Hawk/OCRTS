// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;

var mousetarget = util.vector2d(0, 0)

function makeShip(sprite) {
    var s = {
        sprite: graphics.Sprite(sprite,8,8),
        pos: util.vector2d(400, 400),
        vector: util.vector2d(1 - (Math.random() * 2), 1 - (Math.random() * 2)), // This should of actually be called "velocity"
        steering: null,
        move: function () {
            this.steering.update();
        },
        update: function () {

        }
    }
    s.steering = steeringAI.newAgent(s)
    s.steering.setTarget(mousetarget)
    console.log("Target Set")
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
    update: function () {
        for (var s in this.ships) {
            var ship = this.ships[s]
            ship.update()
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
        var n = {
            sprite: graphics.Sprite(game.preloader.images["red_ship_1"],20,20),
            pos: util.vector2d(x,y)
        }


        this.nodes.push(n)
    },
    draw: function () {
        for (var n in this.nodes) {
            var node = this.nodes[n]
            graphics.draw(node.sprite, node.pos, 90)
        }
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
    for (var x = 0; x < 200; x++) {
        ship = makeShip(game.preloader.images["blue_ship_1"])
        shipsManager.add(ship)
    }
    nodeManager.add(100,100)
    nodeManager.add(200,200)
    nodeManager.add(400,400)
    nodeManager.add(600,600)
    nodeManager.add(700,700)
}


function update(delta) {
    shipsManager.move(delta)
    shipsManager.update()
    
    shipsManager.draw()
    nodeManager.draw()
    mousetarget.set(input.mouse.x, input.mouse.y)

}


game.run()
