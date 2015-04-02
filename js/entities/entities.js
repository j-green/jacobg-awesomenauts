game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        
        this.type = "PlayerEntity";
        this.health = 20;
        this.body.setVelocity(5, 20);
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
        // keeps track of the direction the chracter is going
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        // the animation to walk
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        //the animation to attack
        this.renderable.setCurrentAnimation("idle");

    },
    update: function(delta) {
        this.now = new Date().getTime();

        if (me.input.isKeyPressed("right")) {

            // setting the position of X 
            //setVelocity is being mutiplied by me.timer.tick;
            //me.timer.tick is making the character move smoothly
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);

        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;

        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //this code is for the character to attack
                this.renderable.setCurrentAnimation("attack", "idle");
                // cuurent animation to attack
                //goes back to idle animation
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }



        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            console.log("xdif " + xdif + "ydif " + ydif);

            if (xdif > -35 && this.facing === 'right' && (xdif > 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === 'left' && xdif > 0) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }

            if (this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000) {
                console.log("towerHit");
                this.lastHit = this.now;
                response.b.loseHealth();
            }
        }else if(response.b.type==='EnemyCreep'){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            if (xdif>0){
                this.pos.x = this.pos.x + 1;
                if(this.facing==="left"){}
                this.vel.x = 0;
            }else{
                this.pos.x = this.pos.x - 1;
                if(this.facing==="right"){}
                this.vel.x = 0;
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
                this.lastHit = this.now;
                response.b.loseHealth(1);
            }
        }
    }

});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBaseEntity";
        console.log("init");
        this.type = "PlayerBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }

});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "EnemyBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {


    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
        console.log(this.Health)
    }

});
    
game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32, 
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function(){
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
        }]);  
    this.health = 10;
    this.alwaysUpdate = true;
    //  this.attacking lets us know if the enemy is currently attacking
    this.attacking = false;
    // code here 
    this.now = new Dtae().getTime;
    this.body.setVelocity(3, 20);
    
    this.type = "EnemyCreep";
    
    this.renderable.addAnimation("walk", [3, 4, 5], 80);
    this.renderable.setCurrentAnimation("walk");
    
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    
    update: function(delta){
        
        if(this.health <= 0){
            me.game.world.removeChild(this);
        }
       
         this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
         me.collision.check(this, true, this.coliisionHandler.bind(this), true);
       
         this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
     
        return true;
    },
    
    collisionHandler: function(response){
        if(response.b.type==='PlayerBase'){
            this.attacking=true;
            this.lastAttacking=this.now;
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
            if((this.now-this.lastHit >= 1000)){
                this.latsHit = this.now;
                response.b.loseHealth(1);
            }
        }else if (response.b.type==='PlayerEntiy') {
            var xdif = this.pos.x - response.b.pos.x;
        }
            this.attacking=true;
            this.lastAttacking=this.now;
            this.body.vel.x = 0;
            if(xdif>0){
                console.log(xdif);
            this.pos.x = this.pos.x + 1;
            this.body.vel.x = 0;
        }
            if((this.now-this.lastHit >= 1000) && xdif>0){
                this.latsHit = this.now;
                response.b.loseHealth(1);
        }
    }
    
});

game.GameManager = Object.extend({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        
        this.alwaysUpdate = true;
    }, 
    
    update: function(){
        this.now = new Date().getTime();
        console.log(this.now + " " + this.lastCreep);
        if(Math.round(this.now/1000)%10 ===0 && ((this.now - this.lastCreep) >= 1000)){
            console.log("adrian");
           this.lastCreep = this.now;
           var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
           me.game.world.addChild(creepe, 5);
        }
        
        return true;
    }
});
