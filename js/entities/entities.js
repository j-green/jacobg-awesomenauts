game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
       
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        this.addAnimation();

        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
                //Sets the player model and space it takes up to a variable
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
        }]);
    },
    
    setPlayerTimers: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
    },
    
    setAttributes: function(){
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
            this.facing = "right";
        this.dead = false;
    },
    
    addAnimation: function(){
              this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);  
    },
    
    update: function(delta) {
        this.now = new Date().getTime();
        
        //this.dead = checkIfDead();
        
        if(this.health <= 0){
            this.dead = true;
        }
        
        if (me.input.isKeyPressed("right")) {
            //Adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick
            //me.timer.tick makes the movement smooth
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
        
        if(me.input.isKeyPressed("jump") && !this.jumping && !this.body.falling){
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }else if(this.body.vel.y===0){
            this.jumping = false;
        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //sets current animation to attack
                //then it goes back to idle
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so it begins from the first animation
                //then goes back
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if(!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    
    collideHandler: function(response){
        if(response.b.type==='EnemyBaseEntity'){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            
            if(ydif<-40 && xdif< 70 && xdif>-35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }
           else if(xdif>-35 && this.facing==='right' && (xdif<0)){
               this.body.vel.x = 0;
               //this.pos.x = this.pos.x -1;
            }else if(xdif<60 && this.facing==='left' && xdif>0){
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x +1;
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                     && (Math.abs(ydif) <=40) && 
                 (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                  ){
                this.lastHit = this.now;
                if(response.b.health <= this.attack){
                    //if the creeps health is less than our attack, execute  code in if statement
                    game.data.gold +- 1;
                    console.log("Current gold: " + game.data.gold);
                }
                
                response.b.loseHealth();
           }
       }else if(response.b.type=== 'EnemyCreep'){
           var xdif = this.pos.x - response.b.pos.x;
           var ydif = this.pos.y - response.b.pos.y;
           
           if (xdif>0){
               //this.pos.x= this.pos.x + 1;
               if(this.facing==="left"){
                   this.body.vel.x = 0;
               }
           }else{
               //this.pos.x= this.pos.x - 1;
               if(this.facing==="right"){
                   this.body.vel.x = 0;
           }
       }
           if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000
                  && (Math.abs(ydif) <=40) && 
                 (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                  ){
               this.lastHit = this.now;
               response.b.loseHealth(game.data.playerAttack);
           
         }
        
      }
    }
});