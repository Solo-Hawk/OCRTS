console.log("Loaded")
var steeringAI = {

    states: {
        seek: 0,
        flee: 1,
        orbit: 2,
    },
    newAgent: function (object) {
        console.log(object);
        var a = {
            host: object,
            state: 0,
            target: util.vector2d(200, 200),
            // Controlling Variables
            maxVel: 3,
            force: 3,


            setTarget: function (object) {

            },
            getTarget: function () {
                return target
            },
            getPos: function () {
                return this.host.pos;
            },
            getVector: function () {
                return this.host.vector;
            },
            update: function () {
                if(this.target != null){
                    switch (this.state) {
                        case 0:
                            this.seek();
                            break;
                        case 1:
                            this.flee();
                            break;
                        case 2:
                            this.orbit();
                            break;

                    }
                }
            },
            seek: function () {
                console.log("---")
                var pos = this.getPos();
                var vel = this.getVector();
                var desVel = this.target.clone().subtract(pos).normalise(); // normalise
                console.log(desVel)
                console.log(pos.x + " " +  pos.y)
                console.log(desVel.x + " " + desVel.y)

                console.log((pos.y - desVel.y) + " " + (pos.x - desVel.x))
                var angle = Math.atan2(pos.y - desVel.y, pos.x - desVel.x);
                console.log(angle)
                console.log(angle * 180 / Math.PI)
                vel.rotate(angle * 180 / Math.PI);
                pos.add(vel)








                ctx.save();
                ctx.strokeStyle = "#FF0000";
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x + (vel.x * 30), pos.y + (vel.y * 30))
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#0000FF";
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x + (desVel.x * 300), pos.y + (desVel.y * 300))
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#00FF00";
                ctx.beginPath();
                ctx.arc(this.target.x, this.target.y, 10, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

            },
            flee: function () {

            },
            orbit: function () {

            }
        }
        return a;
    }

}