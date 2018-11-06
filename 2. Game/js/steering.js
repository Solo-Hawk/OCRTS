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
            target: null,
            // Controlling Variables
            maxVel: 3,
            force: 3,


            setTarget: function (object) {
                this.target = object
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
                
                var pos = this.getPos();
                var vel = this.getVector().normalise();
                var desVel = this.target.clone().subtract(pos).normalise(); // normalise
                var steering = desVel.clone().subtract(vel)
                steering.normalise().scale(0.5)
                var distance = steering.clone().subtract(desVel)
                distance = distance.length()
                console.log(steering)
                vel.add(steering).normalise().scale(distance)
                pos.add(vel)







                ctx.save();
                ctx.strokeStyle = "#FF0000";
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x + (vel.x * 50), pos.y + (vel.y * 50))
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#0000FF";
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x + (desVel.x * 150), pos.y + (desVel.y * 150))
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#00FF00";
                ctx.beginPath();
                ctx.moveTo(pos.x + (vel.x * 50), pos.y + (vel.y * 50));
                ctx.lineTo(pos.x + (vel.x * 50) + (steering.x * 100), pos.y + (vel.y * 50)+(steering.y * 100))
                ctx.stroke();
                ctx.closePath();
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