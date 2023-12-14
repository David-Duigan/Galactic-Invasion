class Explosion {
    constructor(game, ship){
        this.game = game;
        this.ship = ship;
        this.width = this.ship.width * 1.5;
        this.height = this.ship.height * 1.5;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.maxFrame = 9;
        this.frame = 0;
        this.x = this.ship.x + this.ship.width/2 - this.width/2;
        this.y = this.ship.y + this.ship.height/2 - this.height/2;
        this.markedForDeletion = false;
        this.hitbox = [this.x + 50, this.y + 50, this.width - 100, this.height - 100];
    }
    draw(ctx){
        //ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    update(deltaTime){
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval){
            this.frameTimer = 0;
            this.frame += 1;
            if (this.frame > this.maxFrame) this.markedForDeletion = true;
        }
    }
}

export class BlueExplosion extends Explosion {
    constructor(game, ship){
        super(game, ship);
        this.spriteWidth = 638;
        this.spriteHeight = 638;
        this.image = document.getElementById("explosion1");
    }
}

export class OrangeExplosion extends Explosion {
    constructor(game, ship){
        super(game, ship);
        this.spriteWidth = 550;
        this.spriteHeight = 550;
        this.image = document.getElementById("explosion2");
    }
}

export class GreenExplosion extends Explosion {
    constructor(game, ship){
        super(game, ship);
        this.spriteWidth = 798;
        this.spriteHeight = 798;
        this.image = document.getElementById("explosion3");
    }
}

export class TeleportExplosion extends Explosion {
    constructor(game, ship){
        super(game, ship);
        this.spriteWidth = 700;
        this.spriteHeight = 700;
        this.frameInterval = 60;
        this.image = document.getElementById("teleport1");
    }
}


