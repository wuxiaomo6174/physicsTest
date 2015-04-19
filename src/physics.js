/**
 * Created by Administrator on 2015/4/17.
 */

var Circle = cc.PhysicsSprite.extend({
    space:null,
    ctor:function(space,png){
        this._super(png);
        this.space = space;
        //set body
        this.body = new cp.Body(10, cp.momentForCircle(10,0,10,cp.v(0,0)));
        //this.body.setPos (cc.p(100,100));
        //this.body.applyImpulse(cp.v(100,100),cp.v(300,300));
        this.space.addBody(this.body);
        //set shape
        var shape = new cp.CircleShape(this.body,10,0);
        shape.setElasticity(10);
        this.space.addShape(shape);

        this.setBody(this.body);
        this.body.data= this;
    }
});