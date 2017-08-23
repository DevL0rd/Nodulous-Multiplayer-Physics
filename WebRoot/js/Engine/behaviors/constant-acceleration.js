
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

    Physics.behavior('constant-acceleration', function( parent ){
    
        var defaults = {
    
            acc: { x : 0, y: 0.0004 }
        };
    
        return {
            init: function( options ){
                parent.init.call( this );
                this.options.defaults( defaults );
                this.options( options );
                this._acc = new Physics.vector();
                this.set( this.options.acc );
                delete this.options.acc;
            },
            set: function( acc ){
                this._acc.clone( acc );
                return this;
            },
            behave: function( data ){
                var bodies = this.getTargets();
                for ( var i = 0, l = bodies.length; i < l; ++i ){
                    bodies[ i ].accelerate( this._acc );
                }
            }
        };
    });
    return Physics;
}));// UMD