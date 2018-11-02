// JavaScript source code
var canvas = document.getElementById('stage');
var ctx = canvas.getContext('2d');
ctx.canvas.width  = 800;
ctx.canvas.height = 800;



var game = {
    config: {
        lasttimestamp: 0,
        preload: function () { },
        create: function () { },
        update: function () { },
        render: function (timestamp) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var delta = (timestamp - this.lasttimestamp) / 1000;
            this.lasttimestamp = timestamp;
            delta = Math.round(delta * 100000) / 100000
            game.config.update(delta)
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
        ctx.rotate(Math.PI / 180 * angle);
        var image = sprite.getImage()
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






