		var bulletOffsetX = 30
        var bulletOffsetY = 30
	   engine.objects["bullet"] = function(pos, angle, radius = 3) {
		this.object = Physics.body('circle', {
                            x: pos.x + (bulletOffsetX * Math.cos(angle)),
                            y: pos.y + (bulletOffsetY * Math.sin(angle)),
                            vx: 10 * Math.cos(angle),
                            vy: 10 * Math.sin(angle),
							firedAngle: angle,
                            radius: radius,
                            mass: radius / 10,
							objectType: 'bullet',
                            label: 'bullet',
                            material: 'bullet',
                            styles: {
                                fillStyle: '0x4268f4'
                                , lineWidth: 1
                                , angleIndicator: '0x4268f4'
                            },
                            restitution: 1, //bouncieness
                            cof: 0 //friction

                        })
	   }