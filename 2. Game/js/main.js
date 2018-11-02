// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;









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
    ship.sprite = graphics.Sprite(game.preloader.images["blue_ship_1"], ship)
    ship.setPos(50,50)
    console.log(ship)

}


function update(delta) {
    graphics.draw(ship.sprite, ship.getPos(), ship.getAngle())
    var pos = ship.getPos();
    ship.setPos(pos.x, pos.y + 1)
    ship.rotate(3)
}

var ship = {
    sprite: null,
    x: 0,
    y: 0,
    angle: 0,
    setPos: function (x, y) {
        this.x = x;
        this.y = y
    },
    getPos: function () {
        return { x: this.x, y: this.y }
    },
    rotate: function (rotation) {
        this.angle += rotation
    },
    setAngle: function (angle) {
        this.angle = angle
    },
    getAngle: function () {
        return this.angle
    }

}
var target = { x: 0, y: 0 };

game.run()
