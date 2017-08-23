        engine.objects["playerDebris"] = function(pos, vel, radius) {
		this.object = Physics.body('circle', {
                            x: pos.x,
                            y: pos.y,
                            vx: vel.x * 1.4,
                            vy: vel.y * 1.4,
                            radius: radius,
                            mass: radius / 10,
                            objectType: 'playerDebris',
                            label: 'playerDebris',
                            material: 'playerDebris',
                            styles: {
                                fillStyle: '0x990000'
                                , lineWidth: 1
                                , angleIndicator: '0x990000'
                            },
                            restitution: 0.5, //bouncieness
                            cof: 0.005 //friction
                        })

		}