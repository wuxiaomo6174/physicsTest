
var CONST={
    "DOT_NUM":30,
    "COLLISION_TYPE":1

};

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        //init space
        this.space = new cp.Space();
        this.setupDebugNode();
        this.space.gravity = cp.v(0,-100);
        var winSize = cc.winSize;
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

        var circle = new Box(this.space,res.ball_png);

        circle.setPosition(cc.p(300,100));
        this.addChild(circle);
        circle.xtag=true;
       // circle.body.applyImpulse(cp.v(circle.x,circle.y),cp.v(300,400));
       //circle.runAction(cc.moveBy(2,cc.p(100,100)));
       // circle.body.setVel(cp.v(0,200));
       // circle.body.applyForce(cp.v(0,100),cp.v(0,0));


        this.scheduleUpdate();

        this.endPoint = new cc.Sprite(res.dot_png);
        //this.endPoint.setVisible(false);
        this.dots={};
        for(var i=0;i!=CONST.DOT_NUM;i++){
            this.dots[i]= new cc.Sprite(res.circle_png);
            this.addChild(this.dots[i]);
            this.dots[i].setPosition(cc.p(i*20,i*20));
            this.dots[i].opacity=0;
            this.dots[i].runAction(cc.scaleTo(1,0.5));
        }
        this.addChild(this.endPoint);

    },
    onEnter:function(){
        this._super();
        cc.log("onEnter layer");
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:this.onTouchBegan,
            onTouchMoved:this.onTouchMoved,
            onTouchEnded:this.onTouchEnded
        },this);

        this.space.addCollisionHandler(
            1,1,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)

        )
    },
    collisionBegin:function(arbiter, space){
        cc.log('collisionBegin');
        var shapes = arbiter.getShapes();

        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();

        var SpriteA = bodyA.data;
        var SpriteB = bodyB.data;

        if(SpriteA instanceof Circle && SpriteB instanceof Bullet ){

            return false;
        }

        if(SpriteA instanceof Bullet && SpriteB instanceof Circle ){

            return false;
        }
        return false;
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
    onTouchBegan:function(touch,event){
        var target= event.getCurrentTarget();
        this.dragOffsetStartX = touch.getLocationX();
        this.dragOffsetStartY = touch.getLocationY();

        //target.endPoint.setPosition(this.dragOffsetStartX,this.dragOffsetStartY);

        //target.simulateTrajectory(target.getDirect(this.dragOffsetStartY/this.dragOffsetStartX));

        return true;
    },
    onTouchMoved:function(touch,event){
        var target= event.getCurrentTarget();

        this.dragOffsetEndX = touch.getLocationX();
        this.dragOffsetEndY = touch.getLocationY();
        target.endPoint.setPosition(this.dragOffsetEndX,this.dragOffsetEndY);
        this.dragDistanceX = this.dragOffsetStartX - this.dragOffsetEndX;
        this.dragDistanceY = this.dragOffsetStartY - this.dragOffsetEndY;
        target.simulateTrajectory(target.getDirect(this.dragOffsetEndY/this.dragOffsetEndX));
        return true;
    },
    onTouchEnded:function(touch,event){
        //project a bullet
        var target= event.getCurrentTarget();
        this.endX = touch.getLocationX();
        this.endY = touch.getLocationY();
        //hide trajectory
        for(var i=0;i!=CONST.DOT_NUM;i++){
            target.dots[i].opacity =0;
        }

        var bullet = new Box(target.space,res.ball_png);
        bullet.setPosition(cc.p(0,0));
        bullet.xtag=true;
        bullet.body.setVel(cp.v(this.endX,this.endY));
        target.addChild(bullet);
    },
    simulateTrajectory:function(v){
       //init one body
        var body = new cp.Body(1, cp.momentForCircle(1,0,10,cp.v(0,0)));
        this.space.addBody(body);
        //set shape
        var shape = new cp.CircleShape(body,10,0);
        this.space.addShape(shape);
        body.setVel(v);

        //temp save position and vx
        var childList = this.getChildren();
        var xList=[];
        for(var i = 0 ;i!=childList.length;i++){
            if(childList[i].visible && childList[i].xtag){
                xList.push([childList[i],childList[i].x,childList[i].y,childList[i].body.vx,childList[i].body.vy]);

            }
        }
        //var c= this.getChildByTag(1);
        //var cx = c.x, cy = c.y;
        //var cvx = c.body.vx, cvy= c.body.vy;

        for(var i=0;i!=CONST.DOT_NUM;i++){
            this.dots[i].opacity =255;
            this.space.step(this.deltaTime*2);
            this.dots[i].setPosition(body.p.x,body.p.y);


        }
        this.space.removeBody(body);

        //restore
        for(var k=0;k!=xList.length;k++){
            var sprite = xList[k][0];
            sprite.body.setPos(cc.p(xList[k][1],xList[k][2]));
            sprite.body.setVel(cp.v(xList[k][3],xList[k][4]));
        }
        //c.setPosition(cc.p(cx,cy));
        //c.body.setVel(cp.v(cvx,cvy));
    },
    drawDots:function(p){

    },
    // will set a speed to
    getDirect:function(k){
        var width= cc.winSize.width;
        return cp.v(width,k * width);
    },
    update:function(dt){

        var c= this.getChildByTag(1);

        if(c&&c.y>0){

        //cc.log(c);
         //   cc.log(c.body.f);
        //cc.log("vx:"+ c.body.vx + "vy:"+ c.body.vy);
        //cc.log("px:"+c.body.p.x +"py"+ c.body.p.y);
         //   cc.log("spx:"+c.x +"spy"+ c.y);
        }
        //cc.log(this.space.getCurrentTimeStep());
        this.deltaTime = dt;
        this.space.step(0.017);
        //kill the sprite our of window

    },
    setupDebugNode:function(){
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

