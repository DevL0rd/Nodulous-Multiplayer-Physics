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
    Physics.geometry('rectangle', function( parent ){
    
        var defaults = {
    
        };
    
        return {
    
            // extended
            init: function( options ){
    
                var self = this;
    
                // call parent init method
                parent.init.call(this, options);
    
                this.options.defaults( defaults );
                this.options.onChange(function( opts ){
                    /**
                     * RectangleGeometry#width = Number
                     *
                     * The width
                     **/
                    self.width = self.options.width || 1;
                    /**
                     * RectangleGeometry#height = Number
                     *
                     * The height
                     **/
                    self.height = self.options.height || 1;
                });
                this.options( options );
            },
    
            // extended
            aabb: function( angle ){
    
                if (!angle){
                    return Physics.aabb( this.width, this.height );
                }
    
                var scratch = Physics.scratchpad()
                    ,p = scratch.vector()
                    ,trans = scratch.transform().setRotation( angle || 0 )
                    ,xaxis = scratch.vector().set( 1, 0 ).rotateInv( trans )
                    ,yaxis = scratch.vector().set( 0, 1 ).rotateInv( trans )
                    ,xmax = this.getFarthestHullPoint( xaxis, p ).proj( xaxis )
                    ,xmin = - this.getFarthestHullPoint( xaxis.negate(), p ).proj( xaxis )
                    ,ymax = this.getFarthestHullPoint( yaxis, p ).proj( yaxis )
                    ,ymin = - this.getFarthestHullPoint( yaxis.negate(), p ).proj( yaxis )
                    ;
    
                scratch.done();
                return Physics.aabb( xmin, ymin, xmax, ymax );
            },
    
            // extended
            getFarthestHullPoint: function( dir, result ){
    
                result = result || new Physics.vector();
    
                var x = dir.x
                    ,y = dir.y
                    ;
    
                x = x === 0 ? 0 : x < 0 ? -this.width * 0.5 : this.width * 0.5;
                y = y === 0 ? 0 : y < 0 ? -this.height * 0.5 : this.height * 0.5;
    
                return result.set( x, y );
            },
    
            // extended
            getFarthestCorePoint: function( dir, result, margin ){
    
                var x, y;
                result = this.getFarthestHullPoint( dir, result );
                x = result.x;
                y = result.y;
                result.x = x === 0 ? 0 : x < 0 ? x + margin : x - margin;
                result.y = y === 0 ? 0 : y < 0 ? y + margin : y - margin;
    
                return result;
            }
        };
    });
    
    // end module: geometries/rectangle.js
    return Physics;
}));// UMD

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['physicsjs','../geometries/rectangle'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs','../geometries/rectangle'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';
    Physics.body('rectangle', function( parent ){
    
        var defaults = {
    
        };
    
        return {
    
            // extended
            init: function( options ){
    
                // call parent init method
                parent.init.call(this, options);
    
                options = Physics.util.extend({}, defaults, options);
    
                this.geometry = Physics.geometry('rectangle', {
                    width: options.width,
                    height: options.height
                });
    
                this.recalc();
            },
    
            // extended
            recalc: function(){
                var w = this.geometry.width;
                var h = this.geometry.height;
                parent.recalc.call(this);
                // moment of inertia
                this.moi = ( w*w + h*h ) * this.mass / 12;
            }
        };
    });
    
    // end module: bodies/rectangle.js
    return Physics;
}));// UMD