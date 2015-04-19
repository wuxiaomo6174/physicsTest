/**
 * Created by Administrator on 2015/4/17.
 */

var Circle = cc.PhysicsSprite.extend({
    space:null,
    ctor:function(space,png){
        this._super(png);
        this.space = space;
        //set body
        this.body = new cp.Body(10, cp.momentForCircle(10,45,0,cp.v(0,0)));
        //this.body = new cp.Body(1, cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
        //this.body.setPos (cc.p(100,100));
        //this.body.applyImpulse(cp.v(100,100),cp.v(300,300));
        this.space.addBody(this.body);
        //set shape
        var shape = new cp.CircleShape(this.body,45,cp.v(0,0));
       // var shape = new cp.BoxShape(this.body, SPRITE_WIDTH, SPRITE_HEIGHT);
        //shape.setElasticity(2);
        //shape.setFriction(0.5);
        shape.setCollisionType(1);
        this.space.addShape(shape);

        this.setBody(this.body);
        this.body.data= this;






    }
});
var Box =  cc.PhysicsSprite.extend({
    space:null,
    ctor:function(space,png){
        this._super(png);
        this.space = space;
        var body = new cp.Body(1, cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
        //body.setPos(p);
        this.space.addBody(body);

        var shape = new cp.BoxShape(body, SPRITE_WIDTH, SPRITE_HEIGHT);
        shape.e = 0.5;
        shape.u = 0.5;
        shape.setCollisionType(COLLISION_TYPE);
        this.space.addShape(shape);

        this.setBody(body);
        //this.setPosition(cc.p(p.x, p.y));
        //this.addChild(sprite);

        body.data = this;
    }
});
var Bullet = cc.PhysicsSprite.extend({
    space:null,
    ctor: function(space,png){
        this._super(png);
        this.space= space;
        //set body
        this.body = new cp.Body(10, cp.momentForCircle(10,0,10,cp.vzero));

        this.space.addBody(this.body);
        //set shape
        var shape = new cp.CircleShape(this.body,10,cp.vzero);
        shape.setElasticity(10);
        shape.setFriction(0.5);
        shape.setCollisionType(1);
        this.space.addShape(shape);

        this.setBody(this.body);
        this.body.data= this;
    }
});