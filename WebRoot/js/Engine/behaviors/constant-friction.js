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
    Physics.behavior('constant-friction', function (parent) {
        var defaults = {
            f: 0.00002
        };
        return {

            init: function (options) {

                parent.init.call(this);
                this.options.defaults(defaults);
                this.options(options);
                this._v = new Physics.vector();
                
                this.setFriction(this.options.f);
            },

            setFriction: function (f) {
                this._f = f
                return this;
            },
            behave: function (data) {

                var bodies = this.getTargets();
                var f = this._f
                for (var i = 0, l = bodies.length; i < l; ++i) {
                    var body = bodies[i]
                    var ax = 0
                    var ay = 0
                    var cof = body.cof

                    if (body.state.vel.x > 0) {
                        ax -= f * cof
                    } else if (body.state.vel.x < 0) {
                        ax += f * cof
                    }
                    if (body.state.vel.y > 0) {
                        ay -= f * cof
                    } else if (body.state.vel.y < 0) {
                        ay += f * cof
                        
                    }
                    this._v.clone({ x: ax, y: ay })
                    body.accelerate(this._v);
                }
            }
        };
    });
    return Physics;
}));// UMD