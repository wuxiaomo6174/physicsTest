
var SPRITE_WIDTH = 64;
var SPRITE_HEIGHT = 64;
var COLLISION_TYPE = 0;
var DEBUG_NODE_SHOW = true;

var HelloWorldLayer = cc.Layer.extend({
    space: null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.initPhysics();

        this.scheduleUpdate();

        this.space.addCollisionHandler(COLLISION_TYPE, COLLISION_TYPE,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );

        var c = new Circle(this.space,res.ball_png);
        c.setPosition(cc.p(100,100));
        this.addChild(c);

        var b = new Box(this.space,res.ball_png);
        b.setPosition(cc.p(200,200));
        this.addChild(b);
    },
    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = DEBUG_NODE_SHOW;
        this.addChild(this._debugNode);
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
        target.addNewSpriteAtPosition(location);
        return false;
    },
    onExit: function () {
        this._super();
        cc.log("onExit");
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    },
    initPhysics: function () {

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
            shape.setCollisionType(10);
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

        var c = new Circle(this.space,res.ball_png);
        c.setPosition(300,300);
        this.addChild(c);

    },
    collisionBegin : function ( arbiter, space ) {
        cc.log('collision Begin');

        var shapes = arbiter.getShapes();
        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();

        var spriteA = bodyA.data;
        var spriteB = bodyB.data;

        if (spriteA != null && spriteB != null)
        {
            spriteA.setColor(new cc.Color(255, 255, 0, 255));
            spriteB.setColor(new cc.Color(255, 255, 0, 255));
        }

        return true;
    },

    collisionPre : function ( arbiter, space ) {
        cc.log('collision Pre');
        return true;
    },

    collisionPost : function ( arbiter, space ) {
        cc.log('collision Post');
    },

    collisionSeparate : function ( arbiter, space ) {

        var shapes = arbiter.getShapes();
        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();

        var spriteA = bodyA.data;
        var spriteB = bodyB.data;

        if (spriteA != null && spriteB != null)
        {
            spriteA.setColor(new cc.Color(255, 255, 255, 255));
            spriteB.setColor(new cc.Color(255, 255, 255, 255));
        }

        cc.log('collision Separate');
    },
    update: function (dt) {
        var timeStep = 0.03;
        this.space.step(timeStep);
    },
    onExit: function () {
        this.space.removeCollisionHandler(COLLISION_TYPE, COLLISION_TYPE);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

