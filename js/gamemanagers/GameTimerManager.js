game.GameTimerManager = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        this.goldTimerCheck();
        this.creepTimerCheck();
        
        return true;
    },
    
    goldTimerCheck: function() {
        if(Math.round(this.now / 1000)%20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += (game.data.exp1 + 1);
            console.log("Current Gold: " + game.data.gold);
        }
    },
    
    creepTimerCheck: function() {
        if(Math.round(this.now / 10)%10 === 0 && (this.now - this.lastCreep >= 10)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 5670, 910, {});
            me.game.world.addChild(creepe, 5);
        }
    }
});
