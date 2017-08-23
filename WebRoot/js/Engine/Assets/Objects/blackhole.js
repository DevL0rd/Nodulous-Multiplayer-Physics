engine.objects["BlackHole"] = function () {
    this.object = Physics.body('circle', {
        x: worldWidth / 2,
        y: worldHeight / 2,
        mass: 100,
        radius: 200,
        restitution: 0, //bouncieness
        cof: 0.01, //friction
        objectType: 'BlackHole',
        label: 'blackhole',
        material: 'blackhole',
        styles: {
            fillStyle: "0x1c1c1c"
        },
        onInit: function () {
            //setup Attractor
            var attractor = Physics.behavior('attractor', {
                order: 0,
                strength: .003
            });
            attractor.position(mapData["blackhole"].state.pos);
            engine.world.add(attractor);
        },
        onTick: function () {
            this.sleep(true);
        },
        onCollision: function (collidedObject) {
            this.state.angular.vel = 0;
            if (collidedObject.label != "player") {
                engine.world.remove(collidedObject)
            }
        }
    })

}