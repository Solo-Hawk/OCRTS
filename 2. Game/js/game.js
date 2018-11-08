console.log("SCRIPT LOADED" )   
// JavaScript source code
var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
ctx.canvas.width  = 800;
ctx.canvas.height = 800;
var count = 0
var game = {
    delta: 0.016,
    config: {
        lasttimestamp: 0,
        preload: function () { },
        create: function () { },
        update: function () { },
        render: function (timestamp) {
            
            if (count == 0) {
                timestamp = Math.floor(timestamp)
                ctx.clearRect(0, 0, canvas.width, canvas.height);


                var delta = (timestamp - game.config.lasttimestamp) / 1000;
                game.config.lasttimestamp = timestamp;
                
                delta = Math.round(delta * 100000) / 100000
                game.delta = delta;
                game.config.update(delta)
                count = 0;
            } else {
                count++

            }
            window.requestAnimationFrame(game.config.render)
        }
    },
    run: function () {
        console.log("Preloading")
        game.config.preload();
        game.preloader.preloading()
        game.config.lasttimestamp = 100;
        console.log(game.config.lasttimestamp)
        
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
            image.width;
            this.images[name] = image;
        },
        preloading: function () {
            if (game.preloader.isReady() == false) {
                window.setTimeout(game.preloader.preloading, 100);
            } else {
                console.log("Done");
                game.config.create()
                game.config.render(performance.now());
            }
        }
    }
}

var graphics = {
    draw: function (sprite, pos, angle) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle - (Math.PI / 180 * 90));
        var image = sprite.getImage();
        ctx.drawImage(image, -sprite.width / 2, - sprite.height / 2, sprite.width, sprite.height);
        ctx.restore();
    },
    drawArc: function (pos,rad,s,e) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, rad, s, e);
        ctx.lineWidth = 5
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
    drawLine: function (start, end) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y)
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
    Sprite: function (image, h , w) {
        var s = {
            image: image,
            getImage: function () {
                return this.image
            },
            width: w || 6,
            height: h || 6
        };
        return s;
    }
}

var util = {
    vector2d: function (x, y) {
        var v = {
            x: x || 0,
            y: y || 0,
            add: function (v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            },
            subtract: function (v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;    
            },
            normalise: function () {
                var len = this.length();
                this.x /= len;
                this.y /= len;
                return this;
            },
            scale: function (s) {
                this.x *= s;
                this.y *= s;
                return this;
            },
            length: function () {
                return Math.sqrt((this.x * this.x) + (this.y * this.y));
            },
            rotate: function (a) {
                var angle = (this.toAngle() * 180 / Math.PI) + a
                this.angleTo(angle);
                return this;
            },
            toAngle: function () {return -Math.atan2(-this.y, this.x) },
            angleTo: function (a) {
                var len = this.length();
                this.x = len * Math.cos(Math.PI / 180 * a);
                this.y = len * Math.sin(Math.PI / 180 * a);
                return this;

            },
            set: function (x, y) {
                this.x = x;
                this.y = y;
                return this;
            },
            clone: function () {
                return util.vector2d(this.x, this.y)
            }

        }
        return v
    }
    
}

var input = {
    mouse: {
        x: 0,
        y: 0,
        getPos: function () {
            return {x: this.x, y: this.y}
        }
    },
    addOnClickEvent: function (func) {
        this.onClickEvents.push(func)
    },
    onClickEvents: [],
    clickEvent: function (mouse,evt) {
        for (var f in this.onClickEvents) {
            var func = this.onClickEvents[f]
            func(mouse,evt)
        }
    }
}

canvas.addEventListener('click', function (evt) {
    input.clickEvent(getMousePos(canvas,evt),evt)
})

function getMousePos(cvs, evt) {
    var rect = cvs.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    input.mouse.x = mousePos.x;
    input.mouse.y = mousePos.y;
})






