
var mapData = {}
var tileSets = ["/js/Engine/Assets/Textures/Player/Skin0/astronaut.json"]
var worldWidth = 10000
var worldHeight = worldWidth

//***************
//**Player Object
//***************

mapData["Player"] = new engine.objects["Player"](worldWidth - 50, worldHeight / 2).object


//***************
//**Other Objects
//***************

//Make a blackhole
mapData["blackhole"] = new engine.objects["BlackHole"]().object


//Start the engine
engine.initWorld(
    mapData,
    tileSets,
    {
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        bg: { src: "/js/Engine/Assets/Textures/Levels/Fog.jpg", transparency: 0.5, tilingSpeed: 0.4 },
        globalFriction: 0.01,
        newtonianGravityStrength: 0,
        globalAcceleration: { x: 0, y: 0 },
        zoomSpeed: 0.01,
        maxZoom: 0.25
    }
)

//************
//**Game Logic
//************


//Play some ambient engine sounda
var Ambience = new Audio("/js/Engine/Assets/Audio/AmbientNoise.mp3");
Ambience.play();


//Make particles spawn on edge of world

if (true) {
    var particles = 0;
    var maxParticleCount = 200
    setInterval(function () {
        var edgeParticles = 30
        var particleCount = edgeParticles
        var newParticles = []

        while (particleCount > 0 && particles < maxParticleCount) {
            var randRadius = engine.Math.getRandomInt(6, 35)
            var chanceDraw = engine.Math.getRandomInt(0, 100)
            var wallOffset = 8
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
            //console.log(nX + " - " + nY + "    " + randRadius)
            mapData["particle_" + particleCount] = Physics.body('circle', {
                x: nX,
                y: nY,
                mass: 0.1,
                radius: randRadius,
                label: 'particle',
                material: 'particle',
                restitution: 0.1, //bouncieness
                cof: 0.0001, //friction
                styles: {
                    fillStyle: "0x605b55"
                },
                onCollision: function (collidedObject) {
                    if (this.radius > 8 && collidedObject.label != null && collidedObject.label != "blackhole" && collidedObject.label != "particleDebris" && collidedObject.label != "particle") {
                        var particleDebrisCount = this.radius
                        var particlesToSpawn = particleDebrisCount
                        var debrisToRemove = [];
                        while (particleDebrisCount > 0) {
                            mapData["particleDebris_" + particleDebrisCount] = Physics.body('circle', {
                                x: this.state.pos.x,
                                y: this.state.pos.y,
                                vx: this.state.vel.x + (collidedObject.state.vel.x / 20),
                                vy: this.state.vel.y + (collidedObject.state.vel.y / 20),
                                mass: 0.8,
                                radius: 4,
                                label: 'particleDebris',
                                material: 'particleDebris',
                                restitution: 1, //bouncieness
                                cof: 0.0001, //friction
                                styles: {
                                    fillStyle: "0x5e3232"
                                },
                            })
                            engine.world.add(mapData["particleDebris_" + particleDebrisCount])
                            debrisToRemove.push(mapData["particleDebris_" + particleDebrisCount])
                            particleDebrisCount--
                        }
                        setTimeout(function () {
                            engine.world.remove(debrisToRemove)
                        }, 5000)
                        engine.world.remove(this)
                        if (collidedObject.label == "bullet") {
                            engine.world.remove(collidedObject)
                        }
                    } else {

                    }
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

}
