
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['physicsjs'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';

    Physics.behavior('body-collision-detection', function( parent ){
    
        var supportFnStack = [];

        var getSupportFn = function getSupportFn( bodyA, bodyB ){
    
            var hash = Physics.util.pairHash( bodyA.uid, bodyB.uid )
                ,fn = supportFnStack[ hash ]
                ;
    
            if ( !fn ){
                fn = supportFnStack[ hash ] = function pairSupportFunction( searchDir ){
    
                    var tA = fn.tA
                        ,tB = fn.tB
                        ,vA = fn.tmpv1
                        ,vB = fn.tmpv2
                        ;
    
                    if ( fn.useCore ){
                        vA = bodyA.geometry.getFarthestCorePoint( searchDir.rotateInv( tA ), vA, fn.marginA );
                        vB = bodyB.geometry.getFarthestCorePoint( searchDir.rotate( tA ).rotateInv( tB ).negate(), vB, fn.marginB );
                    } else {
                        vA = bodyA.geometry.getFarthestHullPoint( searchDir.rotateInv( tA ), vA );
                        vB = bodyB.geometry.getFarthestHullPoint( searchDir.rotate( tA ).rotateInv( tB ).negate(), vB );
                    }
    
                    vA.vadd( bodyA.offset ).transform( tA );
                    vB.vadd( bodyB.offset ).transform( tB );
                    searchDir.negate().rotate( tB );
    
                    return {
                        a: vA.values(),
                        b: vB.values(),
                        pt: vA.vsub( vB ).values()
                    };
                };
    
                fn.tA = new Physics.transform();
                fn.tB = new Physics.transform();
    
                fn.tmpv1 = new Physics.vector();
                fn.tmpv2 = new Physics.vector();
            }
    
            fn.useCore = false;
            fn.margin = 0;
            fn.tA.setRotation( bodyA.state.angular.pos ).setTranslation( bodyA.state.pos );
            fn.tB.setRotation( bodyB.state.angular.pos ).setTranslation( bodyB.state.pos );
            fn.bodyA = bodyA;
            fn.bodyB = bodyB;
    
            return fn;
        };
    
        var checkGJK = function checkGJK( bodyA, bodyB ){
    
            var scratch = Physics.scratchpad()
                ,d = scratch.vector()
                ,tmp = scratch.vector()
                ,os = scratch.vector()
                ,overlap
                ,result
                ,support
                ,inc
                ,collision = false
                ,aabbA = bodyA.aabb()
                ,dimA = Math.min( aabbA.hw, aabbA.hh )
                ,aabbB = bodyB.aabb()
                ,dimB = Math.min( aabbB.hw, aabbB.hh )
                ;
    
            support = getSupportFn( bodyA, bodyB );
            d.clone( bodyA.state.pos )
                .vadd( bodyA.getGlobalOffset( os ) )
                .vsub( bodyB.state.pos )
                .vsub( bodyB.getGlobalOffset( os ) )
                ;
            result = Physics.gjk(support, d, true);
    
            if ( result.overlap ){
    
                collision = {
                    bodyA: bodyA,
                    bodyB: bodyB
                };
    
                inc = 1e-2 * Math.min(dimA || 1, dimB || 1);
    
                support.useCore = true;
                support.marginA = 0;
                support.marginB = 0;
    
                while ( (result.overlap || result.distance === 0) && (support.marginA < dimA || support.marginB < dimB) ){
                    if ( support.marginA < dimA ){
                        support.marginA += inc;
                    }
                    if ( support.marginB < dimB ){
                        support.marginB += inc;
                    }
    
                    result = Physics.gjk(support, d);
                }
    
                if ( result.overlap || result.maxIterationsReached ){
                    return scratch.done(false);
                }
    
                overlap = (support.marginA + support.marginB) - result.distance;
    
                if ( overlap <= 0 ){
                    return scratch.done(false);
                }
    
                collision.overlap = overlap;
                collision.norm = d.clone( result.closest.b ).vsub( tmp.clone( result.closest.a ) ).normalize().values();
                collision.mtv = d.mult( overlap ).values();
                collision.pos = d.clone( collision.norm ).mult( support.marginA ).vadd( tmp.clone( result.closest.a ) ).vsub( bodyA.state.pos ).values();
            }
    
            return scratch.done( collision );
        };
        var checkCircles = function checkCircles( bodyA, bodyB ){
    
            var scratch = Physics.scratchpad()
                ,d = scratch.vector()
                ,tmp = scratch.vector()
                ,overlap
                ,collision = false
                ;
    
            d.clone( bodyB.state.pos )
                .vadd( bodyB.getGlobalOffset( tmp ) )
                .vsub( bodyA.state.pos )
                .vsub( bodyA.getGlobalOffset( tmp ) )
                ;
            overlap = d.norm() - (bodyA.geometry.radius + bodyB.geometry.radius);
    
            if ( d.equals( Physics.vector.zero ) ){
    
                d.set( 1, 0 );
            }
    
            if ( overlap <= 0 ){
    
                collision = {
                    bodyA: bodyA,
                    bodyB: bodyB,
                    norm: d.normalize().values(),
                    mtv: d.mult( -overlap ).values(),
                    pos: d.mult( -bodyA.geometry.radius/overlap ).vadd( tmp ).values(),
                    overlap: -overlap
                };
            }
    
            return scratch.done( collision );
        };

        var checkPair = function checkPair( bodyA, bodyB ){
    
            if (
                ( bodyA.treatment === 'static' || bodyA.treatment === 'kinematic' ) &&
                ( bodyB.treatment === 'static' || bodyB.treatment === 'kinematic' )
            ){
                return false;
            }
    
            if ( bodyA.geometry.name === 'circle' && bodyB.geometry.name === 'circle' ){
				
                return checkCircles( bodyA, bodyB );
    
            } else if ( bodyA.geometry.name === 'compound' || bodyB.geometry.name === 'compound' ){
				
                var test = (bodyA.geometry.name === 'compound')
                    ,compound = test ? bodyA : bodyB
                    ,other = test ? bodyB : bodyA
                    ,cols
                    ,ch
                    ,ret = []
                    ,scratch = Physics.scratchpad()
                    ,vec = scratch.vector()
                    ,oldPos = scratch.vector()
                    ,otherAABB = other.aabb()
                    ,i
                    ,l
                    ;
    
                for ( i = 0, l = compound.children.length; i < l; i++ ){
    
                    ch = compound.children[ i ];
                    oldPos.clone( ch.state.pos );
                    ch.offset.vadd( oldPos.vadd( compound.offset ).rotate( -ch.state.angular.pos ) );
                    ch.state.pos.clone( compound.state.pos );
                    ch.state.angular.pos += compound.state.angular.pos;
    
                    if ( Physics.aabb.overlap(otherAABB, ch.aabb()) ){
    
                        cols = checkPair( other, ch );
    
                        if ( cols instanceof Array ){
                            for ( var j = 0, c, ll = cols.length; j < ll; j++ ){
                                c = cols[j];
                                if ( c.bodyA === ch ){
                                    c.bodyA = compound;
                                } else {
                                    c.bodyB = compound;
                                }
                                ret.push( c );
                            }
    
                        } else if ( cols ) {
                            if ( cols.bodyA === ch ){
                                cols.bodyA = compound;
                            } else {
                                cols.bodyB = compound;
                            }
                            ret.push( cols );
                        }
                    }
    
                    // transform it back
                    ch.state.angular.pos -= compound.state.angular.pos;
                    ch.offset.vsub( oldPos );
                    ch.state.pos.clone( oldPos.rotate( ch.state.angular.pos ).vsub( compound.offset ) );
                }
    
                return scratch.done( ret );
    
            } else {
    
                return checkGJK( bodyA, bodyB );
            }
        };
    
        var defaults = {
    
            check: 'collisions:candidates',
    
            channel: 'collisions:detected'
        };
    
        return {
    
            // extended
            init: function( options ){
    
                parent.init.call( this );
                this.options.defaults( defaults );
                this.options( options );
            },
    
            connect: function( world ){
    
                if ( this.options.check === true ){
    
                    world.on( 'integrate:velocities', this.checkAll, this );
    
                } else {
    
                    world.on( this.options.check, this.check, this );
                }
            },
    
            disconnect: function( world ){
    
                if ( this.options.check === true ){
    
                    world.off( 'integrate:velocities', this.checkAll, this );
    
                } else {
    
                    world.off( this.options.check, this.check, this );
                }
            },

            check: function( data ){
    
                var candidates = data.candidates
                    ,pair
                    ,targets = this.getTargets()
                    ,collisions = []
                    ,ret
                    ,prevContacts = this.prevContacts || {}
                    ,contactList = {}
                    ,pairHash = Physics.util.pairHash
                    ,hash
                    ;
    
                for ( var i = 0, l = candidates.length; i < l; ++i ){
    
                    pair = candidates[ i ];
    
                    if ( targets === this._world._bodies ||
                        (Physics.util.indexOf( targets, pair.bodyA ) > -1) &&
                        (Physics.util.indexOf( targets, pair.bodyB ) > -1)
                    ){
                        ret = checkPair( pair.bodyA, pair.bodyB );
    
                        if ( ret instanceof Array ){
    
                            for ( var j = 0, r, ll = ret.length; j < ll; j++ ){
                                r = ret[j];
                                if ( r ){
                                    hash = pairHash( pair.bodyA.uid, pair.bodyB.uid );
                                    contactList[ hash ] = true;
                                    r.collidedPreviously = prevContacts[ hash ];
                                    collisions.push( r );
                                }
                            }
    
                        } else if ( ret ){
                            hash = pairHash( pair.bodyA.uid, pair.bodyB.uid );
                            contactList[ hash ] = true;
                            ret.collidedPreviously = prevContacts[ hash ];
    
                            collisions.push( ret );
                        }
                    }
                }
    
                this.prevContacts = contactList;
    
                if ( collisions.length ){
                    this._world.emit( this.options.channel, {
                        collisions: collisions
                    });
                }
            },
            checkAll: function( data ){
    
                var bodies = this.getTargets()
                    ,dt = data.dt
                    ,bodyA
                    ,bodyB
                    ,collisions = []
                    ,ret
                    ,prevContacts = this.prevContacts || {}
                    ,contactList = {}
                    ,pairHash = Physics.util.pairHash
                    ,hash
                    ;
    
                for ( var j = 0, l = bodies.length; j < l; j++ ){
    
                    bodyA = bodies[ j ];
    
                    for ( var i = j + 1; i < l; i++ ){
    
                        bodyB = bodies[ i ];
    
                        ret = checkPair( bodyA, bodyB );
						
                        if ( ret instanceof Array ){
    
                            for ( var k = 0, r, ll = ret.length; k < ll; k++ ){
                                r = ret[k];
                                if ( r ){
                                    hash = pairHash( bodyA.uid, bodyB.uid );
									
                                    contactList[ hash ] = true;
                                    r.collidedPreviously = prevContacts[ hash ];
                                    collisions.push( r );
                                }
                            }
    
                        } else if ( ret ){
                            hash = pairHash( bodyA.uid, bodyB.uid );
                            contactList[ hash ] = true;
                            ret.collidedPreviously = prevContacts[ hash ];
    
                            collisions.push( ret );
                        }
                    }
                }
    
                this.prevContacts = contactList;
    
                if ( collisions.length ){
    
                    this._world.emit( this.options.channel, {
                        collisions: collisions
                    });
                }
            }
        };
    
    });
    
    return Physics;
}));// UMD