class SideMenu {
    constructor(game){
        this.game = game;
    }

    draw(ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, 0, this.width, this.game.height);
        
    }
}

export class LeftSideMenu extends SideMenu {
    constructor(game){
        super(game);
        this.x = 0;
        this.width = (this.game.width - this.game.height)/2;
    }
}

export class RightSideMenu extends SideMenu {
    constructor(game){
        super(game);
        this.width = (this.game.width - this.game.height)/2;
        this.x = this.game.width - this.width;
    }
}