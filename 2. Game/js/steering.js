var steeringAI = {

    states: {
        seek: 0,
        flee: 1,
        orbit: 2,
        arrival: 3
    },
    speeds: {
        maxSpeed: 300,
        angularRotation: 10

    },
    newAgent: function (object) {
        var a = {
            host: object,
            state: 0,
            target: null,
            // Controlling Variables

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
                        case steeringAI.states.seek:
                            this.seek();
                            break;
                        case steeringAI.states.flee:
                            this.flee();
                            break;
                        case steeringAI.states.orbit:
                            this.orbit();
                            break;
                        case steeringAI.states.arrival:
                            this.arrival();
                            break;

                    }
                }
            },
            seek: function () {
                var pos = this.getPos();
                var vel = this.getVector().normalise();
                var desVel = this.target.clone().subtract(pos).normalise(); // normalise
                var steering = desVel.clone().subtract(vel)
                steering.scale(steeringAI.speeds.angularRotation)
                steering.scale(game.delta)
                vel.add(steering).normalise()
                vel.scale(steeringAI.speeds.maxSpeed)
                vel.scale(game.delta)
                pos.add(vel)
                
            },
            flee: function () {
                var pos = this.getPos();
                var vel = this.getVector().normalise();
                var desVel = this.target.clone().subtract(pos).normalise(); // normalise
                desVel.rotate(180)
                var steering = desVel.clone().subtract(vel)
                steering.scale(steeringAI.speeds.angularRotation)
                vel.add(steering).normalise()
                vel.scale(steeringAI.speeds.maxSpeed)
                pos.add(vel)
            },
            orbit: function () {

            },
            arrival: function () {

            }
        }
        return a;
    }

}

                //ctx.save();
                //ctx.strokeStyle = "#FF0000";
                //ctx.beginPath();
                //ctx.moveTo(pos.x, pos.y);
                //ctx.lineTo(pos.x + (vel.x * 50), pos.y + (vel.y * 50))
                //ctx.stroke();
                //ctx.closePath();
                //ctx.strokeStyle = "#0000FF";
                //ctx.beginPath();
                //ctx.moveTo(pos.x, pos.y);
                //ctx.lineTo(pos.x + (desVel.x * 150), pos.y + (desVel.y * 150))
                //ctx.stroke();
                //ctx.closePath();
                //ctx.strokeStyle = "#00FF00";
                //ctx.beginPath();
                //ctx.moveTo(pos.x + (vel.x * 50), pos.y + (vel.y * 50));
                //ctx.lineTo(pos.x + (vel.x * 50) + (steering.x * 50), pos.y + (vel.y * 50) + (steering.y * 50))
                //ctx.stroke();
                //ctx.closePath();
                //ctx.beginPath();
                //ctx.arc(this.target.x, this.target.y, 10, 0, 2 * Math.PI);
                //ctx.stroke();
                //ctx.closePath();
                //ctx.restore();