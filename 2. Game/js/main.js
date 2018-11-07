// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;

var mousetarget = util.vector2d(0, 0)

function makeShip(sprite, spawn) {
    var s = {
        health:10,
        range: 80,
        reload: 800 + (Math.random() * 400), // Random reload factor
        lastShot: performance.now(),
        sprite: graphics.Sprite(sprite,6,6),
        pos: util.vector2d(spawn.x, spawn.y),
        vector: util.vector2d(1 - (Math.random() * 2), 1 - (Math.random() * 2)), // This should actually be called "velocity"
        steering: null,

        node: null,
        setNode: function (node) {
            this.node = node
            this.steering.setTarget(node.pos)
        },
        move: function () {
            this.steering.update();
        },
        update: function () {
        },
        canShoot: function () {
            return performance.now() - this.lastShot > this.reload
        },
        shoot: function (targets) {
            if (!this.canShoot()) {
                return
            }
            for (s in targets) {
                var ship = targets[s]
                
                if (this.pos.clone().subtract(ship.pos).length() < this.range) {
                    graphics.drawLine(this.pos, ship.pos)
                    ship.damage(4)
                }
            }
            this.lastShot = performance.now()
            this.reload = 800 + (Math.random() * 400)
        },
        damage: function (d) {
            this.health -= d
        },
        isDead: function () {
            return this.health < 1
        }
    }
    s.steering = steeringAI.newAgent(s)
    return s
}

var nodeManager = {
    nodes: [],
    arc: {
        s: 0,
        sC: 0,
        e: 199,
        eC: 1

    },
    add: function (x, y, side) {
        var image;
        if (side == window.undefined) {
            image = "neutral_base_1"
        } else {
            image = side == 0 ? "blue_base_1" : "red_base_1"
        }
        var n = {
            rotation: 0,
            sprite: graphics.Sprite(game.preloader.images[image],40/4,168/4 ),
            pos: util.vector2d(x, y),
            selected: false
        }


        this.nodes.push(n)
    },
    draw: function () {
        for (var n in this.nodes) {
            var node = this.nodes[n]
            graphics.draw(node.sprite, node.pos, (Math.PI / 100) * node.rotation)
            node.rotation++
            node.rotation = node.rotation > 100 ? 0 : node.rotation
            if (node.selected) {
                graphics.drawArc(node.pos,
                    22,
                    ((2 * Math.PI) / 100) * this.arc.s,
                    ((2 * Math.PI) / 100) * this.arc.e
                )
                this.arc.s += this.arc.sC
                this.arc.e += this.arc.eC
                if (this.arc.e == 200) {
                    console.log("change")
                    this.arc.e = 0
                    this.arc.s = 0
                    this.arc.eC = 0.5
                    this.arc.sC = 1
                } else if (this.arc.s == 200) {
                    this.arc.e = 0
                    this.arc.s = 0
                    this.arc.eC = 1
                    this.arc.sC = 0.5
                }


            }
        }
    },
    selected: null,
    deselect: function () {

        this.selected = null
        for (var n in this.nodes) {
            var node = this.nodes[n]
            node.selected = false
        }
    },
    checkNodeSelection: function (pos) {
        for (var n in this.nodes) {
            var node = this.nodes[n]
            if (
                node.pos.x - 10 < pos.x && pos.x < node.pos.x + 10 && node.pos.y - 10 < pos.y && pos.y < node.pos.y + 10
            ) {
                node.selected = true
                this.selected = node
                return true

            } else {
                node.selected = false
            }
        }
        return false
    },
    sendToNode: function (pos) {
        console.log(this.selected)
        var targetNode = null
        for (var n in this.nodes) {
            var node = this.nodes[n]
            if (node.pos.x - 10 < pos.x && pos.x < node.pos.x + 10 && node.pos.y - 10 < pos.y && pos.y < node.pos.y + 10) {
                targetNode = node
            }
        }
        if (targetNode == null) {
            return
        }
        var shipsToMove = []
        for (s = 0; s < ocrts.playerShips.length; s++) {
            var ship = ocrts.playerShips[s]
            if (ship.node == this.selected) {
                shipsToMove.push(ship)
            }
        }
        for (s = 0; s < shipsToMove.length; s++) {
            var ship = shipsToMove[s]
            ship.setNode(targetNode)
        }
        

    }
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

var ocrts = {
    player: {
        input: {
            state: 0,
            states: {
                clear: 0,
                selecting: 1
            },
            click: function (mouse) {
                if (ocrts.player.input.state == ocrts.player.input.states.clear) {
                    
                    if (nodeManager.checkNodeSelection(mouse)) {
                        ocrts.player.input.state = ocrts.player.input.states.selecting
                    }
                    
                    
                } else if (ocrts.player.input.state == ocrts.player.input.states.selecting) {
                    nodeManager.sendToNode(mouse)
                    ocrts.player.input.state = ocrts.player.input.states.clear
                    nodeManager.deselect()
                }
            }
        }
    },
    playerShips: [],
    computerShips: [],
    addPlayerShip: function(ship) {
        this.playerShips.push(ship)
    },
    addComputerShip: function(ship) {
        this.computerShips.push(ship)
    },
    update: function () {
        console.log("update")
        for (s in this.playerShips) {
            var ship = this.playerShips[s]
            ship.shoot(this.computerShips)
        }
        for (s in this.computerShips) {
            var ship = this.computerShips[s] 
            ship.shoot(this.playerShips)
        }
        for (s in this.playerShips) {
            var ship = this.playerShips[s]
            if (ship.isDead()) {
                this.playerShips.splice(this.playerShips.indexOf(ship),1)
                shipsManager.ships.splice(shipsManager.ships.indexOf(ship),1)
            }
            
        }
        for (s in this.computerShips) {
            var ship = this.computerShips[s] 
            if (ship.isDead()) {
                this.computerShips.splice(this.computerShips.indexOf(ship), 1)
                shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
            }
        }
        
    }
}

var spawner = {
    maxSpawn: 500,
    lastSpawn : 0,
    config: {
        player: {
            spawn: {x: 0, y:0},
            home: null

        },
        computer: {
            spawn: { x: 800, y: 800 },
            home: null
        }
    },
    start: function () {
        for (var x = 0; x < 50; x++) {
            spawner.create.playerShip()
        } for (var x = 0; x < 50; x++) {
            spawner.create.computerShip()
        }
    },
    update: function () {

        if (performance.now() - spawner.lastSpawn > 4000) {
            var count
            count = spawner.maxSpawn - ocrts.playerShips.length
            spawn = count > 20 ? 20 : count
            for (var x = 0; x < spawn; x++) {
                spawner.create.playerShip()
            }
            count = spawner.maxSpawn - ocrts.computerShips.length
            spawn = count > 20 ? 20 : count
            for (var x = 0; x < spawn; x++) {
                spawner.create.computerShip()
            }
            spawner.lastSpawn = performance.now()
        }
    },
    create: {
        playerShip: function () {
            var ship = makeShip(game.preloader.images[["blue_ship_1", "blue_ship_2", "blue_ship_3", "blue_ship_4", "blue_ship_5"][Math.floor(Math.random() * 5)]],spawner.config.player.spawn);
            shipsManager.add(ship)
            ocrts.addPlayerShip(ship)
            ship.setNode(spawner.config.player.home)

        },
        computerShip: function () {
            var ship = makeShip(game.preloader.images[["red_ship_1", "red_ship_2", "red_ship_3", "red_ship_4", "red_ship_5"][Math.floor(Math.random() * 5)]], spawner.config.computer.spawn);
            shipsManager.add(ship)
            ocrts.addComputerShip(ship)
            ship.setNode(spawner.config.computer.home)
        }
    }
}

var ui = {
    draw: function () {
        if (ocrts.player.input.state == ocrts.player.input.states.selecting) {
            graphics.drawLine(nodeManager.selected.pos, input.mouse.getPos())
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
    game.preloader.loadImage("blue_base_1", "assets/bases/blue_base_01.png")
    game.preloader.loadImage("red_base_1", "assets/bases/red_base_01.png")
    game.preloader.loadImage("neutral_base_1", "assets/bases/neutral_base_01.png")
}

function create() {

    nodeManager.add(100, 100, 0) //0
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(Math.floor(Math.random() * 800), Math.floor(Math.random() * 800)) //3
    nodeManager.add(700, 700,1) //4

    spawner.config.player.home = nodeManager.nodes[0]
    spawner.config.player.spawn = {x: nodeManager.nodes[0].pos.x, y: nodeManager.nodes[0].pos.y}
    spawner.config.computer.home = nodeManager.nodes[nodeManager.nodes.length-1]
    spawner.config.computer.spawn = { x: nodeManager.nodes[nodeManager.nodes.length - 1].pos.x, y: nodeManager.nodes[nodeManager.nodes.length - 1].pos.y}

    input.addOnClickEvent(function (mouse) {
        ocrts.player.input.click(mouse)
    })

    spawner.start()
}

function update(delta) {
    shipsManager.move(delta)
    shipsManager.update()
    ocrts.update()
    shipsManager.draw()
    nodeManager.draw()

    spawner.update()

    ui.draw();

    mousetarget.set(input.mouse.x, input.mouse.y)

}

game.run()
