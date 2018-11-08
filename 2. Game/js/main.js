// JavaScript source code
game.config.preload = preload;
game.config.create = create;
game.config.update = update;

var mousetarget = util.vector2d(0, 0)

function makeShip(sprite, spawn) {
    var s = {
        health:10,
        range: 120,
        reload: 800 + (Math.random() * 400), // Random reload factor
        lastShot: performance.now(),
        sprite: graphics.Sprite(sprite,10,10),
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

                    this.lastShot = performance.now()
                    this.reload = 800 + (Math.random() * 400)
                    return
                }
            }
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
    add: function (x, y, team) {
        console.log(team)
        var image;
        if (team == ocrts.team.neutral) {
            image = "neutral_base_1"
        } else {
            image = team == ocrts.team.player ? "blue_base_1" : "red_base_1"
        }
        var n = {
            home:false,
            team: team || 2,
            capture: 0,
            rotation: 0,
            spriteSet: [
                graphics.Sprite(game.preloader.images["blue_base_1"], 40 / 2, 168 / 2),
                graphics.Sprite(game.preloader.images["red_base_1"], 40 / 2, 168 / 2),
                graphics.Sprite(game.preloader.images["neutral_base_1"], 40 / 2, 168 / 2)
            ],
            sprite: graphics.Sprite(game.preloader.images[image], 40 / 2, 168 / 2),
            pos: util.vector2d(x, y),
            selected: false,
            update: function () {
                if (!this.home) {
                    if (this.capture != 0) {
                        this.capture += this.capture > 0 ? -1 : 1
                    }
                    if (-20 < this.capture && this.capture < 20) {
                        this.team = ocrts.team.neutral
                        this.sprite = this.spriteSet[ocrts.team.neutral]
                    }
                }
            },
            addCapture: function (c) {
                this.capture += c
                if (this.capture < -99) {
                    this.capture = -100
                    this.team = ocrts.team.computer
                    this.sprite = graphics.Sprite(game.preloader.images["red_base_1"], 40 / 2, 168 / 2 )
                
                }
                if (this.capture > 99) {
                    this.capture = 100
                    this.team = ocrts.team.player
                    this.sprite = graphics.Sprite(game.preloader.images["blue_base_1"], 40 / 2, 168 / 2 )
                
                }
                
            }
        }
        this.nodes.push(n)
    },
    update: function () {
        for (var n in this.nodes) {
            var node = this.nodes[n]
            node.rotation++
            node.rotation = node.rotation > 100 ? 0 : node.rotation
            node.update()
        }
        this.arc.s += this.arc.sC
        this.arc.e += this.arc.eC
        if (this.arc.e == 200) {
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
    },
    draw: function () {
        for (var n in this.nodes) {
            var node = this.nodes[n]
            graphics.draw(node.sprite, node.pos, (Math.PI / 100) * node.rotation)
            if (node.selected) {
                graphics.drawArc(node.pos,
                    44,
                    ((2 * Math.PI) / 100) * this.arc.s,
                    ((2 * Math.PI) / 100) * this.arc.e
                )
                


            }
        }
    },
    selected: [],
    deselect: function () {

        this.selected = []
        for (var n in this.nodes) {
            var node = this.nodes[n]
            node.selected = false
        }
    },
    checkNodeSelection: function (pos) {// Too Messy
        for (var n in this.nodes) {
            var node = this.nodes[n]
            if (
                node.pos.x - 20 < pos.x && pos.x < node.pos.x + 20 && node.pos.y - 20 < pos.y && pos.y < node.pos.y + 20
            ) {
                node.selected = true
                this.selected.push(node)
                return true

            }
        }
        return false
    },
    sendToNode: function (pos, half) {// Too Messy
        var targetNode = null
        for (var n in this.nodes) {
            var node = this.nodes[n]
            if (node.pos.x - 20 < pos.x && pos.x < node.pos.x + 20 && node.pos.y - 20 < pos.y && pos.y < node.pos.y + 20) {
                targetNode = node
            }
        }
        if (targetNode == null) {
            return
        }
        var shipsToMove = []
        for (s = 0; s < ocrts.playerShips.length; s++) {
            var ship = ocrts.playerShips[s]
            if (this.selected.indexOf(ship.node) != -1) {
                shipsToMove.push(ship)
            }
        }
        for (s = 0; s < (half ? shipsToMove.length/2 : shipsToMove.length); s++) {
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
    computer: {
        lastdecision: performance.now(),
        thinktime: 500,
        update: function () {
            if (performance.now() - ocrts.computer.lastdecision > ocrts.computer.thinktime) {
                var nodes = []
                var targets = []
                for (n in nodeManager.nodes) {
                    var node = nodeManager.nodes[n]
                    if (node.team == ocrts.team.computer) {
                        nodes.push(node)
                    } else {
                        targets.push(node)
                    }
                }
                for (n in nodes) {
                    var node = nodes[n]
                    var targetNode = targets[Math.floor(Math.random() * targets.length)]
                    var shipsToMove = []
                    for (s = 0; s < ocrts.computerShips.length; s++) {
                        var ship = ocrts.computerShips[s]
                        if (nodes.indexOf(ship.node) != -1) {
                            shipsToMove.push(ship)
                        }
                    }
                    for (s = 0; s < ((Math.random < 0.5) ? shipsToMove.length / 2 : shipsToMove.length); s++) {
                        var ship = shipsToMove[s]
                        ship.setNode(targetNode)
                    }


                }
                ocrts.computer.lastdecision = performance.now()
                }


                
            }

            
        },
    running: true,
    winner: null,
    team: {// now that there are team statics, clean game-wide checks into their respective objects
        player:0,
        computer:1,
        neutral:2
    },
    player: {
        input: {
            state: 0,
            states: {
                clear: 0,
                selecting: 1
            },
            click: function (mouse,evt) {
                if (ocrts.player.input.state == ocrts.player.input.states.clear) {
                    
                    if (nodeManager.checkNodeSelection(mouse)) {
                        ocrts.player.input.state = ocrts.player.input.states.selecting
                    }
                    
                    
                } else if (ocrts.player.input.state == ocrts.player.input.states.selecting) {
                    if (evt.shiftKey) {
                        nodeManager.checkNodeSelection(mouse)

                    } else {
                        nodeManager.sendToNode(mouse,evt.ctrlKey)
                        ocrts.player.input.state = ocrts.player.input.states.clear
                        nodeManager.deselect()
                    }
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
    update: function () { // Too Messy
        ocrts.computer.update()
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
                this.playerShips.splice(this.playerShips.indexOf(ship), 1)
                shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
            }
        }
        for (s in this.computerShips) {
            var ship = this.computerShips[s]
            if (ship.isDead()) {
                this.computerShips.splice(this.computerShips.indexOf(ship), 1)
                shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
            }
        }
        for (s in this.playerShips) {
            var ship = this.playerShips[s]
            if (ship.node != spawner.config.player.home && ship.node != spawner.config.computer.home) {
                if (ship.pos.clone().subtract(ship.node.pos).length() < 80) {// quick hack - clean up - make static vector functions for this
                    ship.node.addCapture(1)
                }
            }
        }
        for (s in this.computerShips) {
            var ship = this.computerShips[s]
            if (ship.node != spawner.config.player.home && ship.node != spawner.config.computer.home) {
                if (ship.pos.clone().subtract(ship.node.pos).length() < 80) {// quick hack - clean up - make static vector functions for this
                    ship.node.addCapture(-1)
                }
            }
        }
    }
}

var spawner = {
    maxSpawn: 150,
    lastSpawn : 0,
    config: {
        player: {
            home: null

        },
        computer: {
            home: null
        }
    },
    start: function () {
        for (var x = 0; x < 20; x++) {
            spawner.create.playerShip(spawner.config.player.home)
        } for (var x = 0; x < 20; x++) {
            spawner.create.computerShip(spawner.config.computer.home)
        }
    },
    update: function () {

        if (performance.now() - spawner.lastSpawn > 3000) {// Clean up
            var count
            for (n in nodeManager.nodes) {
                var node = nodeManager.nodes[n]
                if (node.team == ocrts.team.player) {
                    count = spawner.maxSpawn - ocrts.playerShips.length
                    spawn = count > 2 ? 2 : count
                    for (var x = 0; x < spawn; x++) {
                        spawner.create.playerShip(node)
                    }
                }
                else if (node.team == ocrts.team.computer) {
                    count = spawner.maxSpawn - ocrts.computerShips.length
                    spawn = count > 2 ? 2 : count
                    for (var x = 0; x < spawn; x++) {
                        spawner.create.computerShip(node)
                    }
                }
            }
            
            spawner.lastSpawn = performance.now()
        }
        if (ocrts.playerShips.length == 0) {
            ocrts.running = false
            //player lose
        } else if (ocrts.computerShips.length == 0) {

            ocrts.running = false
            // player wins
        }
    },
    create: {
        playerShip: function (node) {
            var ship = makeShip(
                game.preloader.images[["blue_ship_1", "blue_ship_2", "blue_ship_3", "blue_ship_4", "blue_ship_5"][Math.floor(Math.random() * 5)]],
                node.pos
            );
            shipsManager.add(ship)
            ocrts.addPlayerShip(ship)
            ship.setNode(node)

        },
        computerShip: function (node) {
            var ship = makeShip(
                game.preloader.images[["red_ship_1", "red_ship_2", "red_ship_3", "red_ship_4", "red_ship_5"][Math.floor(Math.random() * 5)]],
                node.pos
            );
            shipsManager.add(ship)
            ocrts.addComputerShip(ship)
            ship.setNode(node)
        }
    }
}

var ui = {
    draw: function () {
        if (ocrts.player.input.state == ocrts.player.input.states.selecting) {
            for (n in nodeManager.selected) {
                var node = nodeManager.selected[n]
                graphics.drawLine(node.pos, input.mouse.getPos())
            }
            
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

function create() {// Clean up

    nodeManager.add(100, 100, ocrts.team.player) //0
    nodeManager.add(200 + Math.floor(Math.random() * 400), Math.floor(200 + Math.random() * 400),ocrts.team.neutral) //3
    nodeManager.add(200 + Math.floor(Math.random() * 400), Math.floor(200 + Math.random() * 400),ocrts.team.neutral) //3
    nodeManager.add(200 + Math.floor(Math.random() * 400), Math.floor(200 + Math.random() * 400),ocrts.team.neutral) //3
    nodeManager.add(200 + Math.floor(Math.random() * 400), Math.floor(200 + Math.random() * 400),ocrts.team.neutral) //3
    nodeManager.add(700, 700, ocrts.team.computer) //4

    // clean up - too hacky
    spawner.config.player.home = nodeManager.nodes[0]
    nodeManager.nodes[0].home = true
    nodeManager.nodes[0].team = 0 // check bug

    spawner.config.computer.home = nodeManager.nodes[nodeManager.nodes.length - 1]
    nodeManager.nodes[nodeManager.nodes.length - 1].home = true

    input.addOnClickEvent(function (mouse, evt) {
        ocrts.player.input.click(mouse,evt)
    })

    spawner.start()
}

function update(delta) {
    if (ocrts.running) {
        shipsManager.move(delta)
        shipsManager.update()
        nodeManager.update()
        ocrts.update()
        shipsManager.draw()
        nodeManager.draw()

        spawner.update()

        ui.draw();

        mousetarget.set(input.mouse.x, input.mouse.y)
    }
    shipsManager.draw()
    nodeManager.draw()

}

game.run()

//update: function () { // Too Messy
//    for (s in this.playerShips) {
//        var ship = this.playerShips[s]
//        ship.shoot(this.computerShips)
//    }
//    for (s in this.computerShips) {
//        var ship = this.computerShips[s]
//        ship.shoot(this.playerShips)
//    }
//    for (s in this.playerShips) {
//        var ship = this.playerShips[s]
//        if (ship.isDead()) {
//            this.playerShips.splice(this.playerShips.indexOf(ship), 1)
//            shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
//        }
//    }
//    for (s in this.computerShips) {
//        var ship = this.computerShips[s]
//        if (ship.isDead()) {
//            this.computerShips.splice(this.computerShips.indexOf(ship), 1)
//            shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
//        }
//    }
//    for (s in this.playerShips) {
//        var ship = this.playerShips[s]
//        if (ship.node != spawner.config.player.home && ship.node != spawner.config.computer.home) {
//            if (ship.pos.clone().subtract(ship.node.pos).length() < 80) {// quick hack - clean up - make static vector functions for this
//                ship.node.addCapture(1)
//            }
//        }
//    }
//    for (s in this.computerShips) {
//        var ship = this.computerShips[s]
//        if (ship.isDead()) {
//            this.computerShips.splice(this.computerShips.indexOf(ship), 1)
//            shipsManager.ships.splice(shipsManager.ships.indexOf(ship), 1)
//        }
//    }

//}