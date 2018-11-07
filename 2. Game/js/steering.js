var steeringAI = {

    states: {
        seeknwander: 0,
        orbit: 1,
        seek: 2,
        flee: 3,
        arrival: 4,
        wander: 5
    },
    speeds: {
        maxSpeed: 2,
        angularRotation: 0.4,
        seek: {
            offset:200
        },
        orbit: {
            maxSpeed: 1,
            angularRotation: 0.2
        },
        wander: {
            maxSpeed: 1,
            angularRotation: 0.1,
            radius: 1,
            reach: 40
        }

    },
    newAgent: function (object) {
        var a = {
            
            host: object,
            state: 0,
            target: null,
            // Controlling Variables

            lastDecision: game.config.lasttimestamp,

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
                        case steeringAI.states.seeknwander:
                            this.seekNWander();
                            break;
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
                        case steeringAI.states.wander:
                            this.wander();
                            break;
                    }
                }
            },
            seekNWander: function () {
                var pos = this.getPos();
                var distanceVector = this.target.clone().subtract(pos)
                var distance = distanceVector.length();
                if (distance < 30) {
                    this.flee();
                }else if (distance < steeringAI.speeds.wander.reach) {
                    this.wander();
                } else {
                    this.seek()
                }
            },
            seek: function () {
                var pos = this.getPos();
                var vel = this.getVector().normalise();
                var desVel =
                    this.target.clone()
                        .add(util.vector2d(
                            steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2),
                            steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2)
                        ))
                        .subtract(pos)
                        .normalise(); // normalise
                var steering = desVel.clone().subtract(vel)
                steering.scale(steeringAI.speeds.angularRotation)
                //steering.scale(game.delta)
                vel.add(steering).normalise()
                vel.scale(steeringAI.speeds.maxSpeed)
                //vel.scale(game.delta)
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

            },
            wander: function () {

                var pos = this.getPos();
                var vel = this.getVector()
                if (performance.now() - this.lastDecision > 10) {
                    for (i = 0; i < 3; i++) {
                        var force = util.vector2d(1 - Math.random() * 2, 1 - Math.random() * 2)
                        force.normalise().scale(0.2)
                        vel.add(force)
                    }
                    this.lastDecision = game.config.lasttimestamp
                }

                vel.normalise().scale(steeringAI.speeds.wander.maxSpeed)
                pos.add(vel)

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