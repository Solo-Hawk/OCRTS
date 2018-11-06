// JavaScript source code
var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
ctx.canvas.width  = 800;
ctx.canvas.height = 800;
var count = 0


var game = {
    config: {
        lasttimestamp: 0,
        preload: function () { },
        create: function () { },
        update: function () { },
        render: function (timestamp) {
            if (count == 10) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var delta = (timestamp - this.lasttimestamp) / 1000;
                this.lasttimestamp = timestamp;
                delta = Math.round(delta * 100000) / 100000
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
        ctx.drawImage(image, - (image.width / 2), - (image.height / 2));
        ctx.restore();
    },
    Sprite: function (image) {
        var s = {
            image: image,
            getImage: function () {
                return this.image
            }
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
                console.log(angle)
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
    }
}

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






