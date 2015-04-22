game.LoadProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("load-screen")), -10);
                
                document.getElementById("input").style.visibility = "visible";
                document.getElementById("load").style.visibility = "visible";
                
                me.input.unbindKey(me.input.KEY.B);
                me.input.unbindKey(me.input.KEY.Q);
                me.input.unbindKey(me.input.KEY.W);
                me.input.unbindKey(me.input.KEY.E);
                me.input.unbindKey(me.input.KEY.A);
                
                
                var exp1cost = ((game.data.exp1 + 1) * 10);
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function() {
                        this._super(me.Renderable, "init", [10, 10, 300, 50]);
                        this.font = new me.Font("Arial", 26, "green");
                    },
                    
                    draw: function(renderer) {
                        this.font.draw(renderer.getContext(), "ENTER YOUR USERNAME AND PASSWORD", this.pos.x + 250, this.pos.y);
                    },
                    
                    update: function() {
                        return true;
                    }
                    
                })));
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
            document.getElementById("input").style.visibility = "hidden";
            document.getElementById("load").style.visibility = "hidden";
	}
});