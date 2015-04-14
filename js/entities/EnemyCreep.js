game.EnemyCreep = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "creep1",
            width: 32,
            height: 64,
            spritewidth: "32",
            spriteheight: "64",
            getShape: function() {
                return (new me.Rect(0, 0, 32, 64)).toPolygon();
            }
        }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        this.now = new Date().getTime();
        //this.attacking lets us know if the creep is attacking.
        this.attacking = false;
        //Keeps track of when the creep last attacked.
        this.lastAttacking = new Date().getTime();
        //Keeps track of the last time the creep it anything.
        this.lastHit = new Date().getTime();
        
        this.body.setVelocity(3, 20);
        
        this.type = "EnemyCreep";
        
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    update: function(delta){
        if(this.health <= 0) {            
            me.game.world.removeChild(this);
        }
        
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
        me.collision.check(this, true, this.collideHandler.bind(this), true); 
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);        
        return true;
    },
    
    collideHandler: function(response) {
        if(response.b.type === "PlayerBaseEntity") {
            this.attacking = true;
            //this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //Checks to see if it has been at least 1 second until the creep's last base hit.
            if(this.now - this.lastHit >= game.data.enemyCreepAttackTimer) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player base call the lose health function and take 1 damage.
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }    
        else if(response.b.type === "PlayerEntity") {
            var xdif = this.pos.x - response.b.pos.x;
            
            this.attacking = true;
            //this.lastAttacking = this.now;            
            if(xdif > 0) {
                this.body.vel.x = 0;
            }            
            //Checks to see if it has been at leat 1 second until the creep's last player hit.
            if((this.now - this.lastHit) >= game.data.enemyCreepAttackTimer && xdif > 0) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player entity call the lose health function and take 1 damage.
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }
});