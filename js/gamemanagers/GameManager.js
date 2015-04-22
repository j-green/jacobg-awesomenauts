game.ExperienceManager = Object.extend ({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameOver = false;
    },
    
    update: function() {
        if(game.data.win === true && !this.gameOver) {
            this.gameOverWin();
        }
        else if(game.data.win === false && !this.gameOver) {
            this.gameOverLose();
        }
        return true;
    },
    
    gameOverWin: function() {
        game.data.exp += 10;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
    },
    
    gameOverLose: function() {
        game.data.exp += 1;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
    }
});