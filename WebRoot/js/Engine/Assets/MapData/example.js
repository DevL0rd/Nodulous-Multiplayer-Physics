
var mapData = {}
var worldWidth = 5000
var worldHeight = 5000

//***************
//**Player Object
//***************
mapData["Player"] = Physics.body('rectangle', {
    x: worldWidth - 50,
    y: worldHeight / 2,
    mass: 1,
    hidden: false,
    width: 40,
    restitution: 0    height: 39,
 //bouncieness
    cof: 0.05, //friction
    label: 'player',
    material: 'player',
    styles: {
        fillStyle: '0x990000'
        ,lineWidth: 1
        ,angleIndicator: '0x990000'
    },
    graphics: {
        texture: '/js/Engine/Assets/Textures/Player/Skin0/texture_0.png',
        anchor: {
            x: 0.5,
            y: 0.5
        }
    },
    hp: 100,
    fuel: 100,
    fuelRechargeRate: 0.15,
    fuelDepleteRate: 0.3,
    forwardPressed: false,
    backPressed: false,
    leftPressed: false,
    rightPressed: false,
    onInit: function () {
        console.log("look i'm a player!")
    },
    onTick: function () {
        //always keep camera on player
        //engine.graphics.setCameraPOS(this.state.pos)
        engine.graphics.setTrasformationPoint(this.state.pos)
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
            }
        } else {
            if (this.fuel < 100) {
                this.fuel += this.fuelRechargeRate
                if (this.fuel > 100) {
                    this.fuel = 100
                }
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
            var deathspeed = 2
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
            for (var objKey in mapData) {
                //add code to get closest object 
                closestobject.onInteract()
            }
        }
    },
    onDestroy: function () {
        var debrisCount = 30
        var debrisToRemove = []
        var readdPlayer = this
        while (debrisCount > 0) {
            var randRadius = Math.random() * 5
            mapData["debris_" + debrisCount] = Physics.body('circle', {
                x: this.state.pos.x,
                y: this.state.pos.y,
                vx: this.state.vel.x * 1.4,
                vy: this.state.vel.y * 1.4,
                radius: randRadius,
                mass: randRadius / 10,
                label: 'debris',
                material: 'debris',
                styles: {
                    fillStyle: '0x990000'
                    , lineWidth: 1
                    , angleIndicator: '0x990000'
                },
                restitution: 0.5, //bouncieness
                cof: 0.005, //friction
                onDestroy: function () {
                }
            })
            engine.world.add(mapData["debris_" + debrisCount])
            debrisToRemove.push(mapData["debris_" + debrisCount])
            debrisCount--;
        }
        setTimeout(function () {
            engine.world.remove(debrisToRemove)
            readdPlayer.forwardPressed = false
            readdPlayer.backPressed = false
            readdPlayer.leftPressed = false
            readdPlayer.rightPressed = false
            readdPlayer.state.vel.x = 0
            readdPlayer.state.vel.y = 0
            readdPlayer.state.pos.x = worldWidth - 50
            readdPlayer.state.pos.y = worldHeight / 2
            engine.world.add(readdPlayer)
        }, 5000)

    }
})





//***************
//**Other Objects
//***************

//Make a blackhole
mapData["blackhole"] = Physics.body('circle', {
    x: 600,
    y: 600,
    mass: 100,
    radius: 200,
    restitution: 0.5, //bouncieness
    cof: 0.01, //friction
    label: 'blackhole',
    material: 'blackhole',
    styles: {
        fillStyle: "0x1c1c1c"
    },
    onInit: function () {
        //setup Attractor
        var attractor = Physics.behavior('attractor', {
            order: 0,
            strength: .0005
        });
        attractor.position(mapData["blackhole"].state.pos);
        engine.world.add(attractor);
    },
    onTick: function () {
        this.state.vel.x = 0
        this.state.vel.y = 0
        this.state.pos.x = 600
        this.state.pos.y = 600
        this.sleep(true);
    },
    onCollision: function (collidedObject) {
        this.state.angular.vel = 0;
        if (collidedObject.label != "player") {
            engine.world.remove(collidedObject)
        }
    }
})


//Start the engine
engine.initWorld(mapData, {
    worldWidth: worldWidth,
    worldHeight: worldHeight,
    bg: "/js/Engine/Assets/Textures/Levels/space-bg.jpg",
    globalFriction: 0.01,
    newtonianGravityStrength: 0,
    globalAcceleration: { x: 0, y: 0 }
})

//************
//**Game Logic
//************


//Play some ambient engine sound
var Ambience = new Audio("/js/Engine/Assets/Audio/AmbientNoise.mp3");
Ambience.play();


//Make particles spawn on edge of world
var particles = 0;
var maxParticleCount = 800
setInterval(function () {
    var edgeParticles = 30
    var particleCount = edgeParticles
    var newParticles = []

    while (particleCount > 0 && particles < maxParticleCount) {
        var randRadius = Math.random() * 6
        var chanceDraw = Math.random() * 100
        if (chanceDraw > 0 && chanceDraw < 26) {
            var nX = Math.random() * worldWidth
            var nY = 0
        } else if (chanceDraw > 25 && chanceDraw < 51) {
            var nX = Math.random() * worldWidth - 12
            var nY = worldHeight
        } else if (chanceDraw > 50 && chanceDraw < 76) {
            var nX = 0
            var nY = Math.random() * worldHeight
        } else if (chanceDraw > 75 && chanceDraw < 101) {
            var nX = worldWidth
            var nY = Math.random() * worldHeight
        }
        //console.log(nX + " - " + nY + "    " + randRadius)
        mapData["particle_" + particleCount] = Physics.body('circle', {
            x: nX,
            y: nY,
            mass: 0.4,
            radius: randRadius,
            label: 'particle',
            material: 'particle',
            restitution: 0.1, //bouncieness
            cof: 0.0001, //friction
            styles: {
                fillStyle: "0xffffff"
            },
            onDestroy: function () {
                particles--
            }
        })
        particles++
        newParticles.push(mapData["particle_" + particleCount])
        particleCount--
    }

    engine.world.add(newParticles)

}, 1000)
