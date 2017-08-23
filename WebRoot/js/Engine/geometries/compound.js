
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
    Physics.geometry('compound', function( parent ){
    
        var defaults = {
    
        };
    
        return {
    
            // extended
            init: function( options ){
    
                var self = this;
    
                // call parent init method
                parent.init.call(this, options);
    
                this.options.defaults( defaults );
                this.options( options );
    
                this.children = [];
            },
    
            /**
             * CompoundGeometry#addChild( geometry, pos ) -> this
             * - geometry (Geometry): The child to add.
             * - pos (Physics.vector): The position to add the child at.
             * - angle (Number): The rotation angle
             *
             * Add a child at relative position.
             **/
            addChild: function( geometry, pos, angle ){
    
                this._aabb = null;
                this.children.push({
                    g: geometry
                    ,pos: new Physics.vector( pos )
                    ,angle: angle
                });
    
                return this;
            },
    
            /**
             * CompoundGeometry#clear() -> this
             *
             * Remove all children.
             **/
            clear: function(){
    
                this._aabb = null;
                this.children = [];
    
                return this;
            },
    
            // extended
            aabb: function( angle ){
    
                if (!angle && this._aabb){
                    return Physics.aabb.clone( this._aabb );
                }
    
                var b
                    ,aabb
                    ,ch
                    ,ret
                    ,scratch = Physics.scratchpad()
                    ,pos = Physics.vector()
                    ;
    
                angle = angle || 0;
    
                for ( var i = 0, l = this.children.length; i < l; i++ ) {
                    ch = this.children[ i ];
                    // the aabb rotated by overall angle and the child rotation
                    aabb = ch.g.aabb( angle + ch.angle );
                    pos.clone( ch.pos );
                    if ( angle ){
                        // get the child's position rotated if needed
                        pos.rotate( angle );
                    }
                    // move the aabb to the child's position
                    aabb.x += pos._[0];
                    aabb.y += pos._[1];
                    ret = ret ? Physics.aabb.union(ret, aabb, true) : aabb;
                }
    
                if ( !angle ){
                    // if we don't have an angle specified (or it's zero)
                    // then we can cache this result
                    this._aabb = Physics.aabb.clone( ret );
                }
    
                return scratch.done( ret );
            },
    
            // extended
            // NOTE: unlike other geometries this can't be used in the
            // GJK algorithm because the shape isn't garanteed to be convex
            getFarthestHullPoint: function( dir, result ){
    
                var ch
                    ,i
                    ,l = this.children.length
                    ,scratch = Physics.scratchpad()
                    ,v = scratch.vector()
                    ,len = 0
                    ,maxlen = 0
                    ;
    
                result = result || new Physics.vector();
    
                // find the one with the largest projection along dir
                for ( i = 0; i < l; i++ ) {
                    ch = this.children[ i ];
                    ch.g.getFarthestHullPoint( dir.rotate(-ch.angle), v );
                    len = v.rotate(ch.angle).vadd( ch.pos ).proj( dir.rotate(ch.angle) );
    
                    if ( len > maxlen ){
                        maxlen = len;
                        result.swap( v );
                    }
                }
    
                return scratch.done( result );
            },
    
            // extended
            // NOTE: unlike other geometries this can't be used in the
            // GJK algorithm because the shape isn't garanteed to be convex
            getFarthestCorePoint: function( dir, result, margin ){
    
                var ch
                    ,i
                    ,l = this.children.length
                    ,scratch = Physics.scratchpad()
                    ,v = scratch.vector()
                    ,len = 0
                    ,maxlen = 0
                    ;
    
                result = result || new Physics.vector();
    
                // find the one with the largest projection along dir
                for ( i = 0; i < l; i++ ) {
                    ch = this.children[ i ];
                    ch.g.getFarthestCorePoint(dir.rotate(-ch.angle), v, margin );
                    len = v.rotate(ch.angle).vadd( ch.pos ).proj( dir.rotate(ch.angle) );
    
                    if ( len > maxlen ){
                        maxlen = len;
                        result.swap( v );
                    }
                }
    
                return scratch.done( result );
            }
        };
    });
    
    // end module: geometries/compound.js
    return Physics;
}));// UMD
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['physicsjs','../geometries/compound'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs','../geometries/compound'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';
    Physics.body('compound', function( parent ){
    
        var defaults = {
    
        };
    
        return {
    
            // extended
            init: function( options ){
    
                // call parent init method
                parent.init.call(this, options);
    
                this.mass = 0;
                this.moi = 0;
    
                this.children = [];
                this.geometry = Physics.geometry('compound');
                this.addChildren( options.children );
            },
    
            // extended
            connect: function( world ){
                // sanity check
                if ( this.mass <= 0 ){
                    throw 'Can not add empty compound body to world.';
                }
            },
    
            /**
             * CompoundBody#addChild( body ) -> this
             * - body (Body): The child to add
             *
             * Add a body as a child.
             **/
            addChild: function( body ){
    
                this.addChildren([ body ]);
                return this;
            },
    
            /**
             * CompoundBody#addChildren( bodies ) -> this
             * - bodies (Array): The list of children to add
             *
             * Add an array of children to the compound.
             **/
            addChildren: function( bodies ){
    
                var self = this
                    ,scratch = Physics.scratchpad()
                    ,com = scratch.vector().zero()
                    ,b
                    ,pos
                    ,i
                    ,l = bodies && bodies.length
                    ,M = 0
                    ;
    
                if ( !l ){
                    return scratch.done( this );
                }
    
                for ( i = 0; i < l; i++ ){
                    b = bodies[ i ];
                    // remove body from world if applicable
                    if ( b._world ){
                        b._world.remove( b );
                    }
                    // add child
                    this.children.push( b );
                    // add child to geometry
                    this.geometry.addChild(
                        b.geometry,
                        new Physics.vector(b.offset)
                            .rotate(b.state.angular.pos)
                            .vadd(b.state.pos),
                        b.state.angular.pos
                    );
                    // calc com contribution
                    pos = b.state.pos;
                    com.add( pos._[0] * b.mass, pos._[1] * b.mass );
                    M += b.mass;
                }
    
                // add mass
                this.mass += M;
                // com adjustment (assuming com is currently at (0,0) body coords)
                com.mult( 1 / this.mass );
    
                // shift the center of mass
                this.offset.vsub( com );
    
                // refresh view on next render
                if ( this._world ){
                    this._world.one('render', function(){
                        self.view = null;
                    });
                }
                this.recalc();
    
                return scratch.done( this );
            },
    
            /**
             * CompoundBody#clear() -> this
             *
             * Remove all children.
             **/
            clear: function(){
    
                this._aabb = null;
                this.moi = 0;
                this.mass = 0;
                this.offset.zero();
                this.children = [];
                this.geometry.clear();
    
                return this;
            },
    
            /**
             * CompoundBody#refreshGeometry() -> this
             *
             * If the children's positions change, `refreshGeometry()` should be called to fix the shape.
             **/
            refreshGeometry: function(){
    
                this.geometry.clear();
    
                for ( var i = 0, b, l = this.children.length; i < l; i++ ) {
                    b = this.children[ i ];
                    this.geometry.addChild( b.geometry, new Physics.vector(b.state.pos).vadd(b.offset), b.state.angular.pos );
                }
    
                return this;
            },
    
            // extended
            recalc: function(){
    
                parent.recalc.call(this);
                // moment of inertia
                var b
                    ,moi = 0
                    ;
    
                for ( var i = 0, l = this.children.length; i < l; i++ ) {
                    b = this.children[ i ];
                    b.recalc();
                    // parallel axis theorem
                    moi += b.moi + b.mass * b.state.pos.normSq();
                }
    
                this.moi = moi;
                return this;
            }
        };
    });
    
    // end module: bodies/compound.js
    return Physics;
}));// UMD