
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

//        /////////////////////////////
//        // 2. add a menu item with "X" image, which is clicked to quit the program
//        //    you may modify it.
//        // ask the window size
//        var size = cc.winSize;
//
//        // add a "close" icon to exit the progress. it's an autorelease object
//        var closeItem = new cc.MenuItemImage(
//            res.CloseNormal_png,
//            res.CloseSelected_png,
//            function () {
//                cc.log("Menu is clicked!");
//            }, this);
//        closeItem.attr({
//            x: size.width - 20,
//            y: 20,
//            anchorX: 0.5,
//            anchorY: 0.5
//        });
//
//        var menu = new cc.Menu(closeItem);
//        menu.x = 0;
//        menu.y = 0;
//        this.addChild(menu, 1);
//
//        /////////////////////////////
//        // 3. add your codes below...
//        // add a label shows "Hello World"
//        // create and initialize a label
//        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
//        // position the label on the center of the screen
//        helloLabel.x = size.width / 2;
//        helloLabel.y = 0;
//        // add the label as a child to this layer
//        this.addChild(helloLabel, 5);
//
//        // add "HelloWorld" splash screen"
//        this.sprite = new cc.Sprite(res.HelloWorld_png);
//        this.sprite.attr({
//            x: size.width / 2,
//            y: size.height / 2,
//            scale: 0.5,
//            rotation: 180
//        });
//        this.addChild(this.sprite, 0);
//
//        this.sprite.runAction(
//            cc.sequence(
//                cc.rotateTo(2, 0),
//                cc.scaleTo(2, 1, 1)
//            )
//        );
//        helloLabel.runAction(
//            cc.spawn(
//                cc.moveBy(2.5, cc.p(0, size.height - 40)),
//                cc.tintTo(2.5,255,125,0)
//            )
//        );

        //init space
        this.space = new cp.Space();
        this.setupDebugNode();
        this.space.gravity = cp.v(0,-100);
        var circle = new Circle(this.space,res.ball_png);

        circle.setPosition(cc.p(300,100));
        this.addChild(circle,1,1);
        //circle.body.applyImpulse(cp.v(circle.x,circle.y),cp.v(300,400));
       // circle.runAction(cc.moveBy(2,cc.p(100,100)));
        circle.body.setVel(cp.v(200,200));



       // circle.body.setVel(cp.v(300,0));
        this.scheduleUpdate();

        this.endPoint = new cc.Sprite(res.dot_png);
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
    },
    onTouchBegan:function(touch,event){
        var target= event.getCurrentTarget();
        this.dragOffsetStartX = touch.getLocationX();
        this.dragOffsetStartY = touch.getLocationY();

        target.endPoint.setPosition(this.dragOffsetStartX,this.dragOffsetStartY);
        target.unscheduleUpdate();
        target.scheduleUpdate();
        target.simulateTrajectory(cp.v(this.dragOffsetStartX,this.dragOffsetStartY));
        return false;
    },
    onTouchMoved:function(touch,event){
        var target= event.getCurrentTarget();
        this.dragOffsetEndX = touch.getLocationX();
        this.dragOffsetEndY = touch.getLocationY();
        this.dragDistanceX = this.dragOffsetStartX - this.dragOffsetEndX;
        this.dragDistanceY = this.dragOffsetStartY - this.dragOffsetEndY;
        target.simulateTrajectory(cp.v(this.dragOffsetEndX,this.dragOffsetEndY));
    },
    onTouchEnded:function(touch,event){},
    simulateTrajectory:function(v){
       //init one body
        var body = new cp.Body(1, cp.momentForCircle(1,0,10,cp.v(0,0)));
        this.space.addBody(body);
        //set shape
        var shape = new cp.CircleShape(body,10,0);
        this.space.addShape(shape);
        body.setVel(v);
        var dots=[];

        var c= this.getChildByTag(1);
        var cx = c.x, cy = c.y;
        var cvx = c.body.vx, cvy= c.body.vy;
        //this.unscheduleUpdate();

        for(var i=0;i!=79;i++){
            dots[i] = new cc.Sprite(res.circle_png);
            this.addChild(dots[i]);
            this.space.step(this.deltaTime);
            dots[i].setPosition(body.p.x,body.p.y);

        }
        this.space.removeBody(body);

        c.setPosition(cc.p(cx,cy));
        c.body.setVel(cp.v(cvx,cvy));
        //c.body.setVel(cp.v(200,200));
        //this.scheduleUpdate();
    },
    update:function(dt){

        var c= this.getChildByTag(1);

//        if(c.y>0){
//
//        cc.log(dt);
//        cc.log(c);
//        cc.log("vx:"+ c.body.vx + "vy:"+ c.body.vy);
//        cc.log("px:"+c.body.p.x +"py"+ c.body.p.y);
//            cc.log("spx:"+c.x +"spy"+ c.y);
//        }
        //cc.log(this.space.getCurrentTimeStep());
        this.deltaTime = dt;
        this.space.step(0.017);


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

