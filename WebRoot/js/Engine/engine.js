
var engine = {}

engine.mapData = {}
var viewportStr = "viewport"
var isHosting = false;
var hostInterval = 0
engine.init = function (viewport) {
    engine.load('test')
    //socket.on('host', function() {
    //	isHosting = true
    //	engine.load('test')
    //	hostInterval = setInterval(function () {
    //		for (var objKey in engine.mapData) {
    //			if (engine.mapData[objKey].state != null){
    //				socket.emit('worldUpdate', {objectKey:objKey, 
    //				state: engine.mapData[objKey].state,
    //				geometryType: engine.mapData[objKey].geometry.name,
    //				geometry: engine.mapData[objKey].geometry,
    //				mass: engine.mapData[objKey].mass,
    //				label: engine.mapData[objKey].label,
    //				mass: engine.mapData[objKey].mass,
    //				material: engine.mapData[objKey].material,
    //				sprite: engine.mapData[objKey].sprite,
    //				styles: {
    //                               fillStyle: '0x4268f4'
    //                               , lineWidth: 1
    //                               , angleIndicator: '0x4268f4'
    //                           }
    //				})

    //			}

    //		}
    //	}, 40)
    //   });
    //socket.on('client', function() {
    //	isHosting = false
    //	engine.load('test')

    //});
    //socket.on('worldUpdate', function (objectData){
    //	if (isHosting == false){
    //			if (engine.mapData[objectData.objectKey] != null) {
    //			if (engine.mapData[objectData.objectKey].state != null && objectData.objectKey != "blackhole"){
    //				engine.mapData[objectData.objectKey].state.pos.set(objectData.state.pos._["0"], objectData.state.pos._["1"]);
    //				engine.mapData[objectData.objectKey].state.vel.set(objectData.state.vel._["0"], objectData.state.vel._["1"]);
    //				engine.mapData[objectData.objectKey].sprite = objectData.sprite
    //				engine.mapData[objectData.objectKey].state.angular = objectData.state.angular
    //			}
    //		} else {
    //			if (objectData.geometryType === 'circle') {
    //				engine.mapData[objectData.objectKey] = Physics.body('circle', {
    //                           x: objectData.state.pos._["0"],
    //                           y: objectData.state.pos._["1"],
    //                           vx: objectData.state.vel._["0"],
    //                           vy: objectData.state.vel._["1"],
    //						sprite: objectData.sprite,
    //                           radius: objectData.geometry._aabb.radius,
    //                           mass: objectData.mass,
    //                           label: objectData.label,
    //                           material: objectData.material,
    //                           styles: objectData.styles,
    //                           restitution: 1, //bouncieness
    //                           cof: 0 //friction

    //                       })
    //					engine.world.add(engine.mapData[objectData.objectKey])

    //			} else if (objectData.geometryType === 'rectangle') {
    //				engine.mapData[objectData.objectKey] = Physics.body('rectangle', {
    //                           x: objectData.state.pos._["0"],
    //                           y: objectData.state.pos._["1"],
    //                           vx: objectData.state.vel._["0"],
    //                           vy: objectData.state.vel._["1"],
    //						sprite: objectData.sprite,
    //                           width: objectData.geometry._aabb.width,
    //						height: objectData.geometry._aabb.height,
    //                           mass: objectData.mass,
    //                           label: objectData.label,
    //                           material: objectData.material,
    //                           styles: objectData.styles,
    //                           restitution: 1, //bouncieness
    //                           cof: 0 //friction

    //                       })
    //					engine.world.add(engine.mapData[objectData.objectKey])
    //			} else if (objectData.geometry.name === 'compound') {

    //			}
    //		}
    //	}	

    //})


    //********
    //Graphics
    //********
    //Init graphics system with pixi
    var w = $('#' + viewportStr).width();
    var h = $('#' + viewportStr).height();
    viewportStr = viewport
    engine.graphics = Physics.renderer('pixi', {
        el: viewportStr, // id of the canvas element
        meta: true,
        width: w,
        height: h
    });

    engine.graphics.offset = { x: 0, y: 0 }
    engine.graphics.scale = { x: 1, y: 1 }
    engine.graphics.rot = 0
    engine.graphics.cameraPos = { x: 0, y: 0 }
    engine.graphics.lastCameraPos = { x: 0, y: 0 }
    engine.graphics.setCameraPOS = function (pos) {
        var newPos = { x: pos.x - (($('#' + viewportStr).width() / engine.graphics.scale.x) / 2), y: pos.y - (($('#' + viewportStr).height() / engine.graphics.scale.x) / 2) }
        engine.graphics.cameraPos = newPos
        var diffX = newPos.x - engine.graphics.lastCameraPos.x
        var diffY = newPos.y - engine.graphics.lastCameraPos.y
        engine.graphics.bgSprite.tilePosition.x += diffX / (1 + engine.graphics.bg.tilingSpeed)
        engine.graphics.bgSprite.tilePosition.y += diffY / (1 + engine.graphics.bg.tilingSpeed)
        engine.graphics.lastCameraPos = newPos
        this.stage.setTransform(engine.graphics.offset.x, engine.graphics.offset.y, engine.graphics.scale.x, engine.graphics.scale.y, engine.graphics.rot, 0, 0, engine.graphics.cameraPos.x, engine.graphics.cameraPos.y)
    }
    engine.graphics.setOffset = function (pos, speed = 0) {
        engine.graphics.offset = pos
        if (speed != 0) {
            d
        } else {
            this.stage.setTransform(engine.graphics.offset.x, engine.graphics.offset.y, engine.graphics.scale.x, engine.graphics.scale.y, engine.graphics.rot, 0, 0, engine.graphics.cameraPos.x, engine.graphics.cameraPos.y)
        }
    }
    engine.graphics.setRotation = function (rot) {
        engine.graphics.rot = rot
        this.stage.setTransform(engine.graphics.offset.x, engine.graphics.offset.y, engine.graphics.scale.x, engine.graphics.scale.y, engine.graphics.rot, 0, 0, engine.graphics.cameraPos.x, engine.graphics.cameraPos.y)
    }
    engine.graphics.setRotation = function (rot) {
        engine.graphics.rot = rot
        this.stage.setTransform(engine.graphics.offset.x, engine.graphics.offset.y, engine.graphics.scale.x, engine.graphics.scale.y, engine.graphics.rot, 0, 0, engine.graphics.cameraPos.x, engine.graphics.cameraPos.y)
    }
    engine.graphics.setScale = function (x, y, speed = 0) {
        engine.graphics.scale = { x: x, y: y }
        if (speed != 0) {
            for (i = 0; i <= 1; i += 0.01) {
                a
                setTimeout("SetOpa(" + i + ")", i * duration);
            }
        } else {
            this.stage.setTransform(engine.graphics.offset.x, engine.graphics.offset.y, engine.graphics.scale.x, engine.graphics.scale.y, engine.graphics.rot, 0, 0, engine.graphics.cameraPos.x, engine.graphics.cameraPos.y)
        }
    }
}


engine.mapStr = ""
engine.objects = {}
engine.load = function (mapStr) {
    engine.doneLoadingAssets = function () {
        $.getScript('/js/Engine/Assets/MapData/' + mapStr + ".js", function () {

        })
    }
    $.getScript('/js/Engine/Assets/MapData/' + mapStr + "_objects.js", function () {

    })

    engine.mapStr = mapStr
}

engine.onWindowResize = function () {

}
engine.initWorld = function (mapData, tileSetsArray, options, onLoad) {
    engine.mapData = mapData
    //*******************
    //Physics Setup
    //*******************


    Physics({ timestep: 1 }, function (world) {
        engine.world = world
        engine.world.width = options.worldWidth
        engine.world.height = options.worldHeight
        engine.graphics.bg = {}
        engine.graphics.bg.src = options.bg.src
        engine.graphics.bg.transparency = options.bg.transparency
        engine.globalFriction = options.globalFriction
        engine.newtonianGravityStrength = options.newtonianGravityStrength
        engine.globalAcceleration = Physics.behavior('constant-acceleration')
        engine.world.add(engine.globalAcceleration);
        engine.globalAcceleration.set(options.globalAcceleration)
        if (options.zoomSpeed == null) {
            engine.graphics.zoomSpeed = 0
        } else {
            engine.graphics.zoomSpeed = options.zoomSpeed
        }
        if (options.maxZoom == null) {
            engine.graphics.maxZoom = 0.25
        } else {
            engine.graphics.maxZoom = options.maxZoom
        }

        //*******************
        //Rendering Setup
        //*******************
        if (engine.graphics.bg != null && engine.graphics.bg.src != null) {
            if (engine.graphics.bg.transparency == null) {
                engine.graphics.bg.transparency = 0.5
            }
            if (engine.graphics.bg.tilingSpeed == null) {
                engine.graphics.bg.tilingSpeed = 0.5
            }
            // Add a background to the stage
            var texture = PIXI.Texture.fromImage(engine.graphics.bg.src);
            engine.graphics.bgSprite = new PIXI.TilingSprite(
                texture,
                options.worldWidth + 20000,
                options.worldHeight + 20000
            );
            engine.graphics.stage.addChild(engine.graphics.bgSprite);
            engine.graphics.bgSprite.position.x = -10000
            engine.graphics.bgSprite.position.y = -10000
            engine.graphics.bgSprite.alpha = engine.graphics.bg.transparency;

        }
        //add engine grid
        texture = PIXI.Texture.fromImage('/js/Engine/Assets/Textures/Levels/grid.png');
        var grid = new PIXI.TilingSprite(
            texture,
            options.worldWidth + 20000,
            options.worldHeight + 20000
        );
        engine.graphics.stage.addChild(grid);
        grid.position.x = -10000
        grid.position.y = -10000
        grid.alpha = 1;
        engine.graphics.resize($('#' + viewportStr).width(), $('#' + viewportStr).height())
        var worldEdge = new PIXI.Graphics();

        // set the line style to have a width of 5 and set the color to red
        worldEdge.lineStyle(5, 0xFF0000);

        // draw a rectangle
        worldEdge.drawRect(0, 0, engine.world.width, engine.world.height);

        engine.graphics.stage.addChild(worldEdge);
        //and renderer to physics engine
        engine.world.add(engine.graphics);

        // render on each step
        engine.world.on('step', function () {
            world.render();
        });




        //*******************
        //Physics Parameters Setup
        //*******************
        //set world bounds to size of screen
        var bounds = Physics.aabb(0, 0, options.worldWidth, options.worldHeight);
        engine.edgeCollision = Physics.behavior('edge-collision-detection', {
            aabb: bounds,
            restitution: 0, //bouncieness
            cof: 1 //friction
        })
        engine.world.add(engine.edgeCollision);
        // ensure objects bounce when edge collision is detected
        if (engine.newtonianGravityStrength != 0) {
            engine.world.add(Physics.behavior('newtonian', { strength: engine.newtonianGravityStrength }));
        }


        engine.world.add(Physics.behavior('body-impulse-response'));
        engine.world.add(Physics.behavior('sweep-prune'));
        engine.world.add(Physics.behavior('body-collision-detection', { checkAll: false }));
        var friction = Physics.behavior('constant-friction', {
            f: engine.globalFriction //this is the default
        })
        engine.world.add(friction);




        //*******************
        //Interaction Setup
        //*******************

        //engine.world.on({
        //    'interact:poke': function (pos) {
        //        engine.world.wakeUpAll();
        //        attractor.position(pos);
        //        engine.world.add(attractor);
        //    }
        //    , 'interact:move': function (pos) {
        //        attractor.position(pos);
        //    }
        //    , 'interact:release': function () {
        //        engine.world.wakeUpAll();
        //        engine.world.remove(attractor);
        //    }
        //});
        $('#' + viewportStr).onresize = function () {
            engine.onWindowResize();
            var w = $('#' + viewportStr).width();
            var h = $('#' + viewportStr).height();
            engine.graphics.resize(w, h)
        }
        document.body.onkeydown = function (event) {
            for (var objKey in engine.mapData) {
                //add each object
                if (engine.mapData[objKey].onKeyEvent != null) {
                    engine.mapData[objKey].onKeyEvent(event.keyCode, "down")
                }
            }
        };
        document.body.onkeyup = function (event) {
            for (var objKey in engine.mapData) {
                //add each object
                if (engine.mapData[objKey].onKeyEvent != null) {
                    engine.mapData[objKey].onKeyEvent(event.keyCode, "up")
                }
            }
        };
        document.body.onmousemove = function (event) {
            for (var objKey in engine.mapData) {
                //add each object
                if (engine.mapData[objKey].onMouseMove != null) {
                    engine.mapData[objKey].onMouseMove(event)
                }
            }
        };
        document.body.onmousewheel = function (e) {
            // cross-browser wheel delta
            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            engine.graphics.scale.x += delta * engine.graphics.zoomSpeed
            engine.graphics.scale.y += delta * engine.graphics.zoomSpeed
            if (engine.graphics.scale.x > 1) {
                engine.graphics.scale.x = 1
            } else if (engine.graphics.scale.x < engine.graphics.maxZoom) {
                engine.graphics.scale.x = engine.graphics.maxZoom
            }
            if (engine.graphics.scale.y > 1) {
                engine.graphics.scale.y = 1
            } else if (engine.graphics.scale.y < engine.graphics.maxZoom) {
                engine.graphics.scale.y = engine.graphics.maxZoom

            }
        };
        $('#' + viewportStr).onmousemove = function (e) {
            for (var objKey in engine.mapData) {
                //add each object
                if (engine.mapData[objKey].onKeyEvent != null) {
                    engine.mapData[objKey].onKeyEvent(event.keyCode, "up")
                }
            }
        };
        engine.world.on('collisions:detected', function (data) {
            for (var i = 0, l = data.collisions.length; i < l; ++i) {
                if (data.collisions[i].bodyA.onCollision != null) {
                    data.collisions[i].bodyA.onCollision(data.collisions[i].bodyB)
                }
                if (data.collisions[i].bodyB.onCollision != null) {
                    data.collisions[i].bodyB.onCollision(data.collisions[i].bodyA)
                }
            }

        });

        engine.world.on('remove:body', function (body) {


        });

        engine.world.on('add:body', function (body) {

        });

        for (var objKey in engine.mapData) {
            //add each object
            engine.world.add(engine.mapData[objKey]);
        }

        //update the screen after adding everything.
        engine.world.render();
        var loadedTimeout = 0
        for (i = 0; i < tileSetsArray.length; ++i) {
            PIXI.loader
                .add(tileSetsArray[i])
                .load(function () {
                    clearTimeout(loadedTimeout)
                    loadedTimeout = setTimeout(onLoad, 1000)
                })
        }
        var sprites = {}
        // subscribe to the ticker

        Physics.util.ticker.on(function (time) {
            var d = new Date();
            var n = d.getTime();
            for (var objKey in engine.mapData) {
                //add each object
                if (engine.mapData[objKey].onTick != null) {
                    engine.mapData[objKey].onTick()

                }

                if (engine.mapData[objKey].sprite != null) {
                    if (engine.mapData[objKey].nextAnimateTime == null) {
                        engine.mapData[objKey].nextAnimateTime = 0
                    }
                    if (engine.mapData[objKey].frameNumber == null) {
                        engine.mapData[objKey].frameNumber = -1
                    }
                    if (engine.mapData[objKey].lastSprite != engine.mapData[objKey].sprite) {
                        engine.mapData[objKey].frameNumber = 0

                    }
                    if (engine.mapData[objKey].nextAnimateTime <= n) {
                        engine.mapData[objKey].nextAnimateTime = n + engine.mapData[objKey].animationSpeed
                        engine.mapData[objKey].frameNumber++
                        var textureString = engine.mapData[objKey].sprite + "_" + engine.mapData[objKey].frameNumber

                        if (PIXI.utils.TextureCache[textureString + ".png"] == null) {
                            engine.mapData[objKey].frameNumber = 0
                        }
                        textureString = engine.mapData[objKey].sprite + "_" + engine.mapData[objKey].frameNumber
                        if (sprites[textureString] == null) {
                            if (PIXI.utils.TextureCache[textureString + ".png"] != null) {
                                sprites[textureString] = new PIXI.Sprite(PIXI.utils.TextureCache[textureString + ".png"]);
                                sprites[textureString].anchor = { x: 0.5, y: 0.5 }
                                engine.graphics.stage.removeChild(engine.mapData[objKey].view)
                                engine.mapData[objKey].view = sprites[textureString]
                                engine.graphics.stage.addChild(engine.mapData[objKey].view)
                                engine.mapData[objKey].lastSprite = textureString
                            }

                        } else {
                            engine.graphics.stage.removeChild(engine.mapData[objKey].view)
                            engine.mapData[objKey].view = sprites[textureString]
                            engine.graphics.stage.addChild(engine.mapData[objKey].view)
                            engine.mapData[objKey].lastSprite = textureString
                        }
                    }


                }

            };
            engine.world.step(time);
        })
        // start the ticker
        Physics.util.ticker.start();
    });



}




//Math
engine.Math = {}
engine.Math.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
engine.Math.getRandomInt = function (min, max) {
    return Math.random() * (max - min) + min;
}