import { checkSquareCollision, audio } from "./main.js";

class PowerUp {
    constructor(game){
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = Math.random() * 2 + 0.5;
        this.hitbox = [this.x, this.y, this.width, this.height];
        this.markedForDeletion = false;
        this.sounds = [audio("sounds/powerup/Powerup__001.wav"), audio("sounds/powerup/Powerup__002.wav"), audio("sounds/powerup/Powerup__003.wav"), audio("sounds/powerup/Powerup__004.wav"), audio("sounds/powerup/Powerup__005.wav"), audio("sounds/powerup/Powerup__006.wav"), audio("sounds/powerup/Powerup__007.wav"), audio("sounds/powerup/Powerup__008.wav"), audio("sounds/powerup/Powerup__009.wav"), audio("sounds/powerup/Powerup__010.wav")]
    }
    update(){
        this.hitbox = [this.x + 12, this.y + 15, this.width - 24, this.height - 26];

        this.y += this.speed;
        if (checkSquareCollision(this, this.game.spaceShip) && !this.game.spaceShip.dead){
            this.refillBullets();
            this.markedForDeletion = true;

            let sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
            sound.currentTime = 0;
            sound.play();
        };
    }
    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        //ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])
    }
}

export class GreenPowerUp extends PowerUp {
    constructor(game){
        super(game);
        this.image = document.getElementById("greenPowerup");
        this.magRefillAmount = 150;
    }

    refillBullets(){
        this.game.spaceShip.turboBulletsMag += this.magRefillAmount;
    }
}

export class PurplePowerUp extends PowerUp {
    constructor(game){
        super(game);
        this.image = document.getElementById("pinkPowerup");
        this.magRefillAmount = 150;
    }

    refillBullets(){
        this.game.spaceShip.ballisticBulletsMag += this.magRefillAmount;
    }
}

export class HealthPowerUp extends PowerUp {
    constructor(game){
        super(game);
        this.image = document.getElementById("bluePowerup");
    }

    refillBullets(){
        this.game.spaceShip.health += Math.min(100, (this.game.spaceShip.maxHealth - this.game.spaceShip.health));
        this.game.spaceShip.shield = true;
        this.game.spaceShip.currentShieldHealth = this.game.spaceShip.maxShieldHealth
    }
}