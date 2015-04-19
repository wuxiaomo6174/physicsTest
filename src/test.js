/**
 * Created by apple on 15/4/19.
 */
var Test2Layer = cc.Layer.extend({
    space:null,
    ctor:function(){
        this._super();



        this.initPhysics();

        this.space.addCollisionHandler(1, 1,
            this.collisionBegin.bind(this),
            null,null,null
        );


        var c = new Circle(this.space,res.ball_png);
        c.setPosition(cc.p(100,100));
        this.addChild(c);
        var d= new Bullet(this.space,res.dot_png);
        d.setPosition(cc.p(200,100));
        this.addChild(d);
        this.scheduleUpdate();
    },

    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = DEBUG_NODE_SHOW;
        this.addChild(this._debugNode);
    },
    initPhysics:function(){
        var winSize = cc.director.getWinSize();

        this.space = new cp.Space();
        this.setupDebugNode();

        // 设置重力
        this.space.gravity = cp.v(0, -100);
        var staticBody = this.space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0),				// bottom
            new cp.SegmentShape(staticBody, cp.v(0, winSize.height), cp.v(winSize.width, winSize.height), 0),	// top
            new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0),				// left
            new cp.SegmentShape(staticBody, cp.v(winSize.width, 0), cp.v(winSize.width, winSize.height), 0)	// right
        ];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this.space.addStaticShape(shape);
        }
    },
    addNewSpriteAtPosition: function (p) {
        cc.log("addNewSpriteAtPosition");

        var body = new cp.Body(1, cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
        body.setPos(p);
        this.space.addBody(body);

        var shape = new cp.BoxShape(body, SPRITE_WIDTH, SPRITE_HEIGHT);
        shape.e = 0.5;
        shape.u = 0.5;
        shape.setCollisionType(COLLISION_TYPE);
        this.space.addShape(shape);

        //创建物理引擎精灵对象
        var sprite = new cc.PhysicsSprite(res.ball_png);
        sprite.setBody(body);
        sprite.setPosition(cc.p(p.x, p.y));
        this.addChild(sprite);

        body.data = sprite;

    },
    onEnter: function () {
        this._super();
        cc.log("onEnter");
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan
        }, this);
    },
    onTouchBegan: function (touch, event) {
        cc.log("onTouchBegan");
        var target = event.getCurrentTarget();
        var location = touch.getLocation();
        //target.addNewSpriteAtPosition(location);
        target.addNewSpriteAtPosition(location);
        return false;
    },
    collisionBegin:function(){
        cc.log('collisionBegin');
    },
    update:function(){
        this.space.step(0.017);
    }
});
var Test2Scene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var testLayer= new Test2Layer();
        this.addChild(testLayer);
    }
});