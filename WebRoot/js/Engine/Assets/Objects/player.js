var bullets = 0
engine.objects["Player"] = function (spawnX = 0, spawnY = 0) {
    this.object = Physics.body('rectangle', {
        x: spawnX,
        y: spawnY,
        mass: 0.2,
        hidden: false,
        width: 96,
        restitution: 0,
        height: 65,
        //bouncieness
        cof: 0.001, //friction
        objectType: 'Player',
        label: 'player',
        material: 'player',
        styles: {
            fillStyle: '0x990000'
            , lineWidth: 1
            , angleIndicator: '0x990000'
        },
        sprite: "astronautStill",
        animationSpeed: 300,
        hp: 100,
        fuel: 100,
        fuelRechargeRate: 0.15,
        fuelDepleteRate: 0.3,
        forwardPressed: false,
        backPressed: false,
        leftPressed: false,
        rightPressed: false,
        spacePressed: false,
        bulletCharge: 0,
        bulletChargeRate: 0.01,
        bulletMaxCharge: 10,
        onInit: function () {
            var randRadius = engine.Math.getRandomInt(6, 35)
            var chanceDraw = engine.Math.getRandomInt(0, 100)
            var wallOffset = 50
            if (chanceDraw > 0 && chanceDraw < 26) {
                var nX = engine.Math.getRandomInt(wallOffset, worldWidth - wallOffset)
                var nY = wallOffset
            } else if (chanceDraw > 25 && chanceDraw < 51) {
                var nX = engine.Math.getRandomInt(wallOffset, worldWidth - wallOffset)
                var nY = worldHeight
            } else if (chanceDraw > 50 && chanceDraw < 76) {
                var nX = wallOffset
                var nY = engine.Math.getRandomInt(wallOffset, worldHeight - wallOffset)
            } else if (chanceDraw > 75 && chanceDraw < 101) {
                var nX = worldWidth - wallOffset
                var nY = engine.Math.getRandomInt(wallOffset, worldHeight - wallOffset)
            }
            this.state.pos.set(nX, nY)
        },
        onTick: function () {
            //always keep camera on player
            engine.graphics.setCameraPOS(this.state.pos)
            //engine.graphics.setTrasformationPoint(this.state.pos)
            this.state.angular.vel = 0;
            if (this.rightPressed) {
                this.sleep(false);
                this.state.angular.vel += 0.02;
            }
            if (this.leftPressed) {
                this.sleep(false);
                this.state.angular.vel -= 0.02;
            }
            if (this.forwardPressed) {
                this.sleep(false);
                if (this.fuel > 0) {
                    this.sprite = "astronautMoving"
                    var angle = this.state.angular.pos;
                    var scratch = Physics.scratchpad();
                    // scale the amount to something not so crazy
                    var thrust = 0.02;
                    // point the acceleration in the direction of the ship's nose
                    var v = scratch.vector().set(
                        thrust * Math.cos(angle),
                        thrust * Math.sin(angle)
                    );
                    // accelerate self
                    this.accelerate(v);
                    scratch.done();
                    this.fuel -= this.fuelDepleteRate
                    if (this.fuel < 0) {
                        this.fuel = 0
                    }
                } else {
                    this.sprite = "astronautStill"
                }
            } else {
                this.sprite = "astronautStill"
                if (this.fuel < 100) {
                    this.fuel += this.fuelRechargeRate
                    if (this.fuel > 100) {
                        this.fuel = 100
                    }
                }
            }
            if (this.spacePressed) {
                //charge up bullet if space is pressed
                this.bulletCharge += this.bulletChargeRate
                 console.log(this.bulletCharge)
            } else {
               
                //after charging bullet
                if (this.bulletCharge > 0) {
                    this.sleep(false);
                    if (this.forwardPressed) {
                        this.sprite = "astronautMovingFire"
                    } else {
                        this.sprite = "astronautStillFire"
                     }
                    engine.mapData["bullet_" + this.bulletsFiredCount] = new engine.objects["bullet"](this.state.pos, this.state.angular.pos, this.bulletCharge).object
                    this.bulletCharge = 0
                    }
                }
           
            //handle Input
        },
        onCollision: function (collidedObject) {
            //prevent player rotation, on collision
            this.state.angular.vel = 0;
            if (collidedObject.material == "blackhole") {
                engine.world.remove(this)
            } else {
                var deathspeed = 10
                if (this.state.vel.x > deathspeed || this.state.vel.x < -deathspeed) {
                    engine.world.remove(this)
                } else if (this.state.vel.y > deathspeed || this.state.vel.y < -deathspeed) {
                    engine.world.remove(this)
                }
            }
        },
        onInteract: function () {

        },
        onMouseDown: function (pos) {
            //notworking
        },
        onMouseUp: function (pos) {
            //notworking
        },
        onMouseMove: function (e) {
            //notworking
        },
        onMouseEnter: function () {
            //notworking
        },
        onMouseLeave: function () {
            //notworking
        },
        onKeyEvent: function (UnicodeCode, direction) {
            if (UnicodeCode == 87) { //W
                if (direction == "down") {
                    this.forwardPressed = true
                } else if (direction == "up") {
                    this.forwardPressed = false
                }
            } else if (UnicodeCode == 65) { //A
                if (direction == "down") {
                    this.leftPressed = true
                } else if (direction == "up") {
                    this.leftPressed = false
                }
            } else if (UnicodeCode == 83) { //S
                if (direction == "down") {
                    this.backPressed = true
                } else if (direction == "up") {
                    this.backPressed = false
                }
            } else if (UnicodeCode == 68) { //D
                if (direction == "down") {
                    this.rightPressed = true
                } else if (direction == "up") {
                    this.rightPressed = false
                }
            } else if (UnicodeCode == "e") {
                for (var objKey in engine.mapData) {
                    //add code to get closest object 
                    closestobject.onInteract()
                }
            } else if (UnicodeCode == 32) { //SpaceBar
                if (direction == "down") {
                    this.spacePressed = true;
                } else if (direction == "up") {
                    this.spacePressed = false;
                }
            }
        },
        onDestroy: function () {
            var debrisCount = 50
            var debrisToRemove = []
            while (debrisCount > 0) {
                var randRadius = Math.random() * 5
                engine.mapData["debris_" + debrisCount] = new engine.objects["playerDebris"](this.state.pos, { x: this.state.vel.x * 1.4, y: this.state.vel.y * 1.4 }, randRadius).object

                if (debrisCount == 1) {
                    engine.mapData["debris_" + debrisCount].onTick = function () {
                        engine.graphics.setCameraPOS(this.state.pos)
                    }
                }
                engine.world.add(engine.mapData["debris_" + debrisCount])
                debrisToRemove.push(engine.mapData["debris_" + debrisCount])
                debrisCount--;
            }
            setTimeout(function () {
                engine.world.remove(debrisToRemove)
                engine.mapData["Player"] = new engine.objects["Player"](0, 0).object
                engine.world.add(engine.mapData["Player"])
            }, 5000)

        }
    })
    return this
}