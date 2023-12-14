import { audio } from "./main.js";

class Bullet {
    constructor(game, ship, angle=0){
        this.game = game;
        this.ship = ship;
        this.markedForDeletion = false;
        this.hitbox = [];
        this.laserThrough = false;
        this.angle = angle;
        this.invulnerable = false;
        this.imageAngle = 0;
        this.name = "no-name";
    }
    draw(ctx){
        ctx.save();

        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.imageAngle);

        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();

        ctx.strokeStyle = "red";
        //ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])
    }
    update(){
        this.updateHitbox();

        let radians = (this.angle + 90) * (Math.PI / 180);
        let velX = Math.cos(radians) * this.speed;
        let velY = Math.sin(radians) * this.speed;

        //console.log(velX, velY);

        this.x += velX;
        this.y -= velY;

        if ((this.y < 0 || this.y > this.game.height + this.height) && !this.invulnerable){ 
            this.markedForDeletion = true;
            if (this.beepSound) this.beepSound.pause();
        };
    }
}

export class SpaceshipGreenBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("greenBullet");
        this.width = 30;
        this.height = 40;
        this.speed = 6.5;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + offsetY;
        this.side = "friend";
        this.damage = 3;
        this.laserThrough = true;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }

}

export class SpaceshipBlueBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("blueBullet");
        this.width = 30;
        this.height = 30;
        this.speed = 7;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + offsetY;
        this.side = "friend";
        this.damage = 20;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class SpaceshipPurpleBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("purpleBullet");
        this.width = 45;
        this.height = 45;
        this.speed = 7.5;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + offsetY;
        this.side = "friend";
        this.damage = 25;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PinkBulletNormal extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("pinkEnemyBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PinkBulletTurbo extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("pinkEnemyTurboBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class BlueBulletNormal extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("blueEnemyBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -5;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class BlueBulletTurbo extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("blueEnemyTurboBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -5;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class YellowBulletNormal extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("yellowEnemyBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class YellowBulletTurbo extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("yellowEnemyTurboBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PurpleBulletNormal extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("purpleEnemyBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PurpleBulletTurbo extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("purpleEnemyTurboBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class GreenBulletNormal extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("greenEnemyBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class GreenBulletTurbo extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("greenEnemyTurboBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20 * this.game.enemyDamageBuff;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PinkBossBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("pinkBossBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class PinkBossTurboBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("pinkBossTurboBullet");
        this.width = 50;
        this.height = 50;
        this.speed = -3;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
        this.ownAngle = 0;
        this.invulnerable = true;
        this.angleMultiplier = 2;

    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
    update(){
        super.update();

        this.angle += this.angleMultiplier;

        if (this.speed > -14) {
            this.speed -= 0.03;
        } else {
            this.width -= 0.3;
            this.height -= 0.3;
        }

        if (this.width < 1) this.markedForDeletion = true;
        


    }
}

export class BlueBossBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("blueBossBullet");
        this.width = 30;
        this.height = 30;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class BlueBossTurboBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("blueBossTurboBullet");
        this.width = 50;
        this.height = 50;
        this.speed = -3;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
        this.dx = (this.game.spaceShip.x + this.width/2) - (this.x + this.width/2);
        this.dy = (this.game.spaceShip.y + this.height/2) - (this.y + this.height/2);
        this.imageAngle = 0;
        this.lockTimer = 0;
        this.lockInterval = 7000;
        this.missileSound = audio("sounds/boss/blue/missile.wav");
        this.name = "bluebossturbo";
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }

    draw(ctx){
        super.draw(ctx)

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        if (this.lockTimer < this.lockInterval) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
            ctx.lineTo(this.game.spaceShip.x + this.game.spaceShip.width/2, this.game.spaceShip.y + this.game.spaceShip.height/2);
            ctx.stroke();
        }
    }

    update(deltaTime){

        let distance = Math.hypot(this.dy, this.dx);

        this.lockTimer += deltaTime;

        if (this.lockTimer < this.lockInterval) {
            this.dx = (this.game.spaceShip.x + this.width/2) - (this.x + this.width/2);
            this.dy = (this.game.spaceShip.y + this.height/2) - (this.y + this.height/2);
    
        } 

        let radians = (Math.atan2(this.dy, this.dx)) + Math.PI;

        this.velX = Math.cos(radians) * this.speed;
        this.velY = Math.sin(radians) * this.speed;

        this.imageAngle = radians - Math.PI/2;

        this.x += this.velX;
        this.y += this.velY;

        this.updateHitbox();

        if ((this.y < 0 || this.y > this.game.height + this.height) && !this.invulnerable) this.markedForDeletion = true;

    }
}


export class YellowBossBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0, speed=-4){
        super(game, ship, angle);
        this.image = document.getElementById("yellowBossBullet");
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class YellowBossTurboBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("yellowBossTurboBullet");
        this.width = 40;
        this.height = 40;
        this.speed = -4;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;

    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class GreenBossBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0, speed=-4){
        super(game, ship, angle);
        this.image = document.getElementById("greenBossBullet");
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;
    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }
}

export class GreenBossTurboBullet extends Bullet {
    constructor(game, ship, offset, angle=0, offsetY=0){
        super(game, ship, angle);
        this.image = document.getElementById("greenBossTurboBullet");
        this.width = 40;
        this.height = 40;
        this.speed = -20;
        this.x = this.ship.x + this.ship.width/2- this.width/2 + offset;
        this.y = this.ship.y + this.ship.height - this.height - 20 + offsetY;
        this.side = "enemy";
        this.damage = 20;

    }
    updateHitbox(){
        this.hitbox = [this.x + 12, this.y + 8, this.width - 24, this.height - 16]
    }

    update(){
        super.update();
        let radians = (this.angle) * (Math.PI / 180);
        this.imageAngle = radians;
    }
}



