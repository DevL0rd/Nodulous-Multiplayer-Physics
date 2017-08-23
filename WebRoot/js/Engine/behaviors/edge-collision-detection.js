
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

    Physics.behavior('edge-collision-detection', function( parent ){
    
        var checkGeneral = function checkGeneral( body, bounds, dummy ){
    
            var overlap
                ,aabb = body.aabb()
                ,scratch = Physics.scratchpad()
                ,offset = body.getGlobalOffset( scratch.vector() )
                ,trans = scratch.transform()
                ,dir = scratch.vector()
                ,result = scratch.vector()
                ,collision = false
                ,collisions = []
                ;
    
            // right
            overlap = (aabb.x + aabb.hw) - bounds.max.x;
    
            if ( overlap >= 0 ){
    
                dir.set( 1, 0 ).rotateInv( trans.setRotation( body.state.angular.pos ) );
    
                collision = {
                    bodyA: body,
                    bodyB: dummy,
                    overlap: overlap,
                    norm: {
                        x: 1,
                        y: 0
                    },
                    mtv: {
                        x: overlap,
                        y: 0
                    },
                    pos: body.geometry.getFarthestHullPoint( dir, result ).rotate( trans ).vadd( offset ).values()
                };
    
                collisions.push(collision);
            }
    
            // bottom
            overlap = (aabb.y + aabb.hh) - bounds.max.y;
    
            if ( overlap >= 0 ){
    
                dir.set( 0, 1 ).rotateInv( trans.setRotation( body.state.angular.pos ) );
    
                collision = {
                    bodyA: body,
                    bodyB: dummy,
                    overlap: overlap,
                    norm: {
                        x: 0,
                        y: 1
                    },
                    mtv: {
                        x: 0,
                        y: overlap
                    },
                    pos: body.geometry.getFarthestHullPoint( dir, result ).rotate( trans ).vadd( offset ).values()
                };
    
                collisions.push(collision);
            }
    
            // left
            overlap = bounds.min.x - (aabb.x - aabb.hw);
    
            if ( overlap >= 0 ){
    
                dir.set( -1, 0 ).rotateInv( trans.setRotation( body.state.angular.pos ) );
    
                collision = {
                    bodyA: body,
                    bodyB: dummy,
                    overlap: overlap,
                    norm: {
                        x: -1,
                        y: 0
                    },
                    mtv: {
                        x: -overlap,
                        y: 0
                    },
                    pos: body.geometry.getFarthestHullPoint( dir, result ).rotate( trans ).vadd( offset ).values()
                };
    
                collisions.push(collision);
            }
    
            // top
            overlap = bounds.min.y - (aabb.y - aabb.hh);
    
            if ( overlap >= 0 ){
    
                dir.set( 0, -1 ).rotateInv( trans.setRotation( body.state.angular.pos ) );
    
                collision = {
                    bodyA: body,
                    bodyB: dummy,
                    overlap: overlap,
                    norm: {
                        x: 0,
                        y: -1
                    },
                    mtv: {
                        x: 0,
                        y: -overlap
                    },
                    pos: body.geometry.getFarthestHullPoint( dir, result ).rotate( trans ).vadd( offset ).values()
                };
    
                collisions.push(collision);
            }
    
            scratch.done();
            return collisions;
        };
        var checkEdgeCollide = function checkEdgeCollide( body, bounds, dummy ){
    
            return checkGeneral( body, bounds, dummy );
        };
    
        var defaults = {
    
            aabb: null,
            restitution: 0.99,
            cof: 1.0,
            channel: 'collisions:detected'
        };
    
        return {
    
            // extended
            init: function( options ){
    
                parent.init.call( this );
                this.options.defaults( defaults );
                this.options( options );
    
                this.setAABB( this.options.aabb );
                this.restitution = this.options.restitution;
    
                this.body = Physics.body('point', {
                    treatment: 'static',
                    restitution: this.options.restitution,
                    cof: this.options.cof
                });
            },
    
            setAABB: function( aabb ){
    
                if (!aabb) {
                    throw 'Error: aabb not set';
                }
    
                this._edges = {
                    min: {
                        x: (aabb.x - aabb.hw),
                        y: (aabb.y - aabb.hh)
                    },
                    max: {
                        x: (aabb.x + aabb.hw),
                        y: (aabb.y + aabb.hh)
                    }
                };
    
                return this;
            },
			setRestitution: function( rest ){
				this.restitution = rest
				this.body.restitution = rest
                return this;
            },
			setFriction: function( rest ){
				this.restitution = rest
				this.body.restitution = rest
                return this;
            },
            connect: function( world ){
    
                world.on( 'integrate:positions', this.checkAll, this, 2 );
            },
            disconnect: function( world ){
    
                world.off( 'integrate:positions', this.checkAll, this, 2 );
            },

            checkAll: function( data ){
    
                var bodies = this.getTargets()
                    ,dt = data.dt
                    ,body
                    ,collisions = []
                    ,ret
                    ,bounds = this._edges
                    ,dummy = this.body
                    ,prevContacts = this.prevContacts || {}
                    ,contactList = {}
                    ,pairHash = Physics.util.pairHash
                    ,hash
                    ;
    
                for ( var i = 0, l = bodies.length; i < l; i++ ){
    
                    body = bodies[ i ];
    
                    // only detect dynamic bodies
                    if ( body.treatment === 'dynamic' ){
    
                        ret = checkEdgeCollide( body, bounds, dummy );
    
                        if ( ret ){
                            hash = pairHash( body.uid, dummy.uid );
    
                            for ( var j = 0, ll = ret.length; j < ll; j++ ){
                                contactList[ hash ] = true;
                                ret[ j ].collidedPreviously = prevContacts[ hash ];
                            }
    
                            collisions.push.apply( collisions, ret );
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
    
    // end module: behaviors/edge-collision-detection.js
    return Physics;
}));// UMD