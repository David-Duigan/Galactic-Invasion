import { checkSquareCollision, audio } from "./main.js";
import { PinkBulletNormal, BlueBulletNormal, YellowBulletNormal, GreenBulletNormal, PurpleBulletNormal, PinkBulletTurbo, BlueBulletTurbo, YellowBulletTurbo, GreenBulletTurbo, PurpleBulletTurbo, PinkBossBullet, PinkBossTurboBullet, BlueBossBullet, BlueBossTurboBullet, YellowBossBullet, YellowBossTurboBullet, GreenBossBullet, GreenBossTurboBullet } from "./bullets.js";
import { BlueExplosion, GreenExplosion, OrangeExplosion, TeleportExplosion } from "./explosions.js";

class Enemy {
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
        this.hitbox = [this.x + 15, this.y + 10, this.width - 30, this.height - 20]
        this.shootTimer = 0;
        this.shootInterval = 1800 * this.game.enemyShootIntervalBuff;
        this.angle = 0;
        this.bulletsShot = 0;
        this.origShootInterval = this.shootInterval;
        this.side = "enemy";
        this.type = "normal"
        this.shield = false;
        this.livesRemove = 1;
        this.explosions = [audio("sounds/explosions/explosion01.wav"), audio("sounds/explosions/explosion02.wav"), audio("sounds/explosions/explosion03.wav"), audio("sounds/explosions/explosion04.wav"), audio("sounds/explosions/explosion05.wav"), audio("sounds/explosions/explosion06.wav")]
        this.shootSounds = [audio("sounds/shoot/enemyshoot1.wav"), audio("sounds/shoot/enemyshoot2.wav")]

        this.explosions.forEach(audio => {
            audio.volume = 0.7;
        })

    }
    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = "red";
        //ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])

        this.drawHealthBar(ctx);
    }
    drawHealthBar(ctx){
        let greenLength = (this.width - 20) * (this.health / this.maxHealth);

        ctx.fillStyle = "red";
        ctx.fillRect(this.x + 10, this.y, this.width - 20, 10);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x + 10, this.y, greenLength, 10);
    }    

    update(deltaTime){
        this.updateHitbox();
        this.y += this.speed;

        this.shootTimer += deltaTime;
        if (this.shootTimer >= this.shootInterval && this.game.lives > 0){
            this.shootTimer = 0;
            this.pushBullet();

            let shootSound = this.shootSounds[Math.floor(Math.random() * this.shootSounds.length)];
            shootSound.play();
            this.bulletsShot += 1;
        }

        if (this.y >= this.game.height + this.height && !this.game.wonGame){
            this.markedForDeletion = true;
            this.game.lives -= 1;
        };

        this.game.bullets.forEach(bullet => {
            if (checkSquareCollision(this, bullet) && bullet.side !== this.side){
                if (!bullet.laserThrough){
                    bullet.markedForDeletion = true;
                }

                this.health -= bullet.damage;
                
            }
        })

        if (this.health <= 0){
            this.markedForDeletion = true;

            let explosion = this.explosions[Math.floor(Math.random() * this.explosions.length)];
            explosion.currentTime = 0;
            explosion.play();
            
            this.pushExplosion();
        };
        
    }
}

export class PinkEnemy extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("pinkEnemy");
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = 1.4 * this.game.enemySpeedBuff;
        this.side = "enemy";
        this.health = 100 * this.game.enemyHealthBuff;
        this.maxHealth = this.health;
        //console.log(this.game.enemyHealthBuff)
    }
    updateHitbox(){
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]

    }
    pushBullet(){
        this.game.bullets.push(new PinkBulletNormal(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new OrangeExplosion(this.game, this))
    }
}

export class PinkEnemyTurbo extends PinkEnemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("pinkEnemyTurbo");
    }
    pushBullet(){
        this.game.bullets.push(new PinkBulletTurbo(this.game, this, -27))
        this.game.bullets.push(new PinkBulletTurbo(this.game, this, 27))
    }
}

export class BlueEnemy extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("blueEnemy");
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = 1 * this.game.enemySpeedBuff;
        this.side = "enemy";
        this.health = 150 * this.game.enemyHealthBuff;
        this.maxHealth = this.health;

    }
    updateHitbox(){
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]

    }
    pushBullet(){
        this.game.bullets.push(new BlueBulletNormal(this.game, this, 0))
    }

    pushExplosion(){
        this.game.explosions.push(new BlueExplosion(this.game, this))
    }

    update(deltaTime){
        super.update(deltaTime);

        this.angle += 0.01;
        this.x += Math.cos(this.angle) * 2;
        if (this.x <= this.game.background.x || this.x + this.width >= this.game.background.x + this.game.background.width) {
            this.x -= Math.cos(this.angle) * 2;
        }
    }
}

export class BlueEnemyTurbo extends BlueEnemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("blueEnemyTurbo")
    }

    pushBullet(){
        this.game.bullets.push(new BlueBulletTurbo(this.game, this, -27))
        this.game.bullets.push(new BlueBulletTurbo(this.game, this, 27))
    }
}

export class YellowEnemy extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("yellowEnemy");
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = 1.4 * this.game.enemySpeedBuff;
        this.side = "enemy";
        this.health = 150 * this.game.enemyHealthBuff;
        this.maxHealth = this.health;
        this.teleported = false;
    }
    updateHitbox(){
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]

    }
    pushBullet(){
        this.game.bullets.push(new YellowBulletNormal(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new OrangeExplosion(this.game, this))
    }

    update(deltaTime){
        super.update(deltaTime);

        if (this.health < this.maxHealth/2 && !this.teleported && this.health > 0){
            let distance = 0;
            while (true){
                distance = Math.random() * 600 - 300;

                if (distance > 100 || distance < -100) break;
            }

            this.game.explosions.push(new TeleportExplosion(this.game, this))

            this.teleported = true;
            this.x += distance;

            if (this.x < this.game.background.x || this.x + this.width > this.game.background.x + this.game.background.width) {
                this.x -= (distance * 2);
            }

            this.game.explosions.push(new TeleportExplosion(this.game, this))

        }
    }
}


export class YellowEnemyTurbo extends YellowEnemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("yellowEnemyTurbo");
    }
    pushBullet(){
        this.game.bullets.push(new YellowBulletTurbo(this.game, this, -27))
        this.game.bullets.push(new YellowBulletTurbo(this.game, this, 27))
    }
}

export class PurpleEnemy extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("purpleEnemy");
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = 1.4 * this.game.enemySpeedBuff;
        this.side = "enemy";
        this.health = 150 * this.game.enemyHealthBuff;
        this.maxHealth = this.health;
        this.teleported = false;
        this.maxShot = 15;

    }
    updateHitbox(){
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]

    }
    pushBullet(){
        this.game.bullets.push(new PurpleBulletNormal(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new BlueExplosion(this.game, this))
    }

    update(deltaTime){
        super.update(deltaTime);

        if (this.y > 0 && this.bulletsShot <= this.maxShot){
            this.shootInterval = 100;
        } else {
            this.shootInterval = this.origShootInterval;
        }
    }
}


export class PurpleEnemyTurbo extends PurpleEnemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("purpleEnemyTurbo");
    }
    pushBullet(){
        this.game.bullets.push(new PurpleBulletTurbo(this.game, this, -27))
        this.game.bullets.push(new PurpleBulletTurbo(this.game, this, 27))
    }
}

export class GreenEnemy extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("greenEnemy");
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (this.game.background.width - this.width) + this.game.background.x;
        this.y = -this.height;
        this.speed = 1.4 * this.game.enemySpeedBuff;
        this.side = "enemy";
        this.health = 150 * this.game.enemyHealthBuff;
        this.maxHealth = this.health;
        this.teleported = false;
        this.maxShot = 15;
    }
    updateHitbox(){
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]

    }
    pushBullet(){
        this.game.bullets.push(new GreenBulletNormal(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new OrangeExplosion(this.game, this))
    }

    update(deltaTime){
        super.update(deltaTime);

        if (this.markedForDeletion){
            for (let i = 0; i < 10; i++){
                this.game.bullets.push(new GreenBulletTurbo(this.game, this, 0, (360 / 10) * i));
            }
        }
    }
}


export class GreenEnemyTurbo extends GreenEnemy {
    constructor(game){
        super(game);
        this.image = document.getElementById("greenEnemyTurbo");
    }
    pushBullet(){
        this.game.bullets.push(new GreenBulletTurbo(this.game, this, -27))
        this.game.bullets.push(new GreenBulletTurbo(this.game, this, 27))
    }
}



class Boss {
    constructor(game, ship) {
        this.game = game;
        this.ship = ship;
        this.width = 130;
        this.height = 130;
        this.x = this.game.width/2 - this.width/2;
        this.y = -this.height;
        this.moveLimitY = 250;
        this.choosePoint = true;
        this.pointX = 0;
        this.pointY = 0;
        this.velX = 0;
        this.velY = 0;
        this.shootTimer = 0;
        this.shootInterval = 800;
        this.useAbilityTimer = 0;
        this.hitbox = [this.x + 15, this.y + 15, this.width - 30, this.height - 30]
        this.side = "enemy";
        this.type = "boss"
        this.shield = false;
        this.move = true;
        this.shieldImage = document.getElementById("shield");
        this.shield = false;
        this.maxShieldHealth = 0;
        this.currentShieldHealth = this.maxShieldHealth;
        this.shieldGiveHealth = 0;
        this.shootSounds = [audio("sounds/shoot/enemyshoot1.wav"), audio("sounds/shoot/enemyshoot2.wav")]
        this.shoot = true;
        this.explodeLayer1 = audio("sounds/boss/explodeLayer1.wav");
        this.explodeLayer2 = audio("sounds/boss/explodeLayer2.mp3");
        this.explodeLayer3 = audio("sounds/boss/explodeLayer3.wav");
        this.explodeLayer4 = audio("sounds/boss/explodeLayer4.wav");

    }
    updateHitbox(){
        this.hitbox = [this.x + 10, this.y + 25, this.width - 20, this.height - 50]

    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        // ctx.lineWidth = 2;
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])

        this.drawHealthBar(ctx);

        if (this.shield) {
            ctx.save();
            ctx.globalAlpha = (this.currentShieldHealth / this.maxShieldHealth);

            ctx.drawImage(this.shieldImage, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.shieldImage, this.x, this.y, this.width, this.height);
    
            ctx.restore();
        }
    }
    drawHealthBar(ctx){
        this.updateHitbox();
        let greenLength = (this.game.background.width) * (this.health / this.maxHealth);

        ctx.fillStyle = "red";
        ctx.fillRect(this.game.background.x, 0, this.game.background.width, 20);
        ctx.fillStyle = "green";
        ctx.fillRect(this.game.background.x, 0, greenLength, 20);
    }  
    
    update(deltaTime){
        if (this.y < 20) this.y += 5;

        else {
            if (this.choosePoint) {
                this.pointX = Math.random() * (this.game.background.width - this.width) + (this.game.background.x + this.width/2);
                this.pointY = Math.random() * (this.moveLimitY - this.height) + (20 + this.height/2);

                this.choosePoint = false;
            }

            this.game.bullets.forEach(bullet => {
                if (checkSquareCollision(this, bullet) && bullet.side !== this.side){
                    if (!bullet.laserThrough){
                        bullet.markedForDeletion = true;
                    }
                    if (this.shield){
                        this.currentShieldHealth -= bullet.damage;
    
                        if (this.currentShieldHealth <= 0){
                            this.shield = false;
                            this.currentShieldHealth = this.maxShieldHealth;
                        }
    
                    } else {
                        this.health -= bullet.damage;
                    } 
                }
            })

            let dx = this.pointX - (this.x + this.width/2);
            let dy = this.pointY - (this.y + this.height/2);
    
            let radians = Math.atan2(dy, dx);
    
            this.velX = Math.cos(radians) * this.speed;
            this.velY = Math.sin(radians) * this.speed;
    
            if (this.move) {
                this.x += this.velX;
                this.y += this.velY;
            }

            if (((this.x + this.width/2) >= this.pointX - this.speed && (this.x + this.width/2) <= this.pointX + this.speed) && ((this.y + this.height/2) >= this.pointY - this.speed && (this.y + this.height/2) <= this.pointY + this.speed)){
                this.choosePoint = true;
            }

            this.shootTimer += deltaTime;
            if (this.shootTimer >= this.shootInterval && this.game.lives > 0 && this.shoot){
                this.shootTimer = 0;
                this.pushBullet();

                let shootSound = this.shootSounds[Math.floor(Math.random() * this.shootSounds.length)];
                shootSound.currentTime = 0;
                shootSound.play();
            }
        }

        if (this.health <= 0){
            this.markedForDeletion = true;
            this.pushExplosion();
            this.explodeLayer1.play();
            this.explodeLayer2.play();
            this.explodeLayer3.play();
            this.explodeLayer4.play();
        };

    }

}

export class PinkBoss extends Boss {
    constructor(game, ship){
        super(game, ship);
        this.image = document.getElementById("pinkBoss");
        this.health = 15000;
        this.maxHealth = this.health;
        this.speed = 3;
        this.useAbilityInterval = 20000;
        this.abilityTimer = 0;
        this.abilityInterval = 100;
        this.abilityMax = 20;
        this.currentAbilityAmount = this.abilityMax;
        this.useShieldTimer = 0;
        this.useShieldInterval = Math.random() * 10000 + 10000;
        this.shieldImage = document.getElementById("shield");
        this.shield = false;
        this.maxShieldHealth = 500;
        this.currentShieldHealth = this.maxShieldHealth;
        this.shieldGiveHealth = 500;
        this.color = "pink";
        this.shieldSound = audio("sounds/boss/pink/shieldSound.wav");
        this.circleBulletSound = audio("sounds/boss/pink/circleBulletSound.ogg");
        

    }
    pushBullet(){
        this.game.bullets.push(new PinkBossBullet(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new OrangeExplosion(this.game, this));
    }

    update(deltaTime){
        super.update(deltaTime);

        this.useAbilityTimer += deltaTime;
        if (this.useAbilityTimer >= this.useAbilityInterval){
            this.useAbilityTimer = 0;
            this.currentAbilityAmount = 0;
            
        }

        this.abilityTimer += deltaTime;
        if (this.abilityTimer >= this.abilityInterval && this.currentAbilityAmount < this.abilityMax){
            this.abilityTimer = 0;
            this.game.bullets.push(new PinkBossTurboBullet(this.game, this, 0))
            this.currentAbilityAmount += 1;
            this.circleBulletSound.currentTime = 0;
            this.circleBulletSound.play()

        }

        if (!this.shield) {
            this.useShieldTimer += deltaTime;
            if (this.useShieldTimer >= this.useShieldInterval){
                this.shieldSound.play();
                this.shield = true;
                this.useShieldTimer = 0;
                this.health += Math.min(this.shieldGiveHealth, (this.maxHealth - this.health))
                this.useShieldInterval = Math.random() * 10000 + 10000;
            }
        }

        if (this.shield && this.game.lives <= 0){
            this.currentShieldHealth -= 5;
        }

    }
}

export class BlueBoss extends Boss {
    constructor(game, ship){
        super(game, ship);
        this.image = document.getElementById("blueBoss");
        this.health = 19000;
        this.maxHealth = this.health;
        this.speed = 3.5;
        this.useAbilityInterval = Math.random() * 10000 + 15000;
        this.useAbilityTimer = 0;
        this.abilityTimer = 0;
        this.abilityInterval = 200;
        this.abilityMax = 10;
        this.currentAbilityAmount = 0;
        this.color = "blue";
        this.useSpawnAbilityTimer = 0;
        this.useSpawnAbilityInterval = Math.random() * 12000 + 18000;
        this.spawnAbilityTimer = 0;
        this.spawnAbilityInterval = 1000;
        this.spawnedAmount = 0;
        this.maxSpawn = 2;
        this.teleportSound = audio("sounds/boss/blue/teleport.ogg");
        this.beepSound = audio("sounds/boss/blue/alert.wav");
        this.beepSound.volume = 0.7;

    }

    pushBullet(){
        this.game.bullets.push(new BlueBossBullet(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new BlueExplosion(this.game, this));
    }

    update(deltaTime){
        super.update(deltaTime);

        this.useAbilityTimer += deltaTime;
        if (this.useAbilityTimer >= this.useAbilityInterval){
            this.abilityTimer += deltaTime;
            if (this.abilityTimer >= this.abilityInterval){
                this.game.bullets.push(new BlueBossTurboBullet(this.game, this, 0));
                this.abilityTimer = 0;
                this.currentAbilityAmount += 1;


                if (this.currentAbilityAmount >= this.abilityMax){ 
                    this.useAbilityTimer = 0;
                    this.currentAbilityAmount = 0;
                };
            }
        }

        let exists = false;

        this.game.bullets.forEach(bullet => {
            if (bullet.name === "bluebossturbo" && bullet.lockTimer < bullet.lockInterval){
                exists = true;
            }
        })

        if (exists){
            this.beepSound.play();
        }

        this.useSpawnAbilityTimer += deltaTime;

        if (this.useSpawnAbilityTimer >= this.useSpawnAbilityInterval && this.useAbilityTimer < this.useAbilityInterval){
            this.spawnAbilityTimer += deltaTime;
            if (this.spawnAbilityTimer >= this.spawnAbilityInterval){
                this.teleportSound.currentTime = 0;
                this.teleportSound.play();
                let random = Math.floor(Math.random() * 2)
    
                if (random === 0) this.game.enemies.push(new BlueEnemy(this.game));
                else if (random === 1) this.game.enemies.push(new BlueEnemyTurbo(this.game));
                this.spawnAbilityTimer = 0;

                this.game.enemies[this.game.enemies.length-1].y = 20;
                this.game.explosions.push(new TeleportExplosion(this.game, this.game.enemies[this.game.enemies.length-1]));

                this.spawnedAmount += 1;

                if (this.spawnedAmount >= this.maxSpawn){
                    this.useSpawnAbilityTimer = 0;
                    this.spawnedAmount = 0;
                }
            }
        }
    }
}

export class YellowBoss extends Boss {
    constructor(game, ship){
        super(game, ship);
        this.image = document.getElementById("yellowBoss");
        this.health = 19000;
        this.maxHealth = this.health;
        this.speed = 4;
        this.useAbilityInterval = Math.random() * 5000 + 7000;
        this.useAbilityTimer = 0;
        this.color = "yellow";
        this.abilityBullet = undefined;
        this.bulletDistance = 0;
        this.useTeleportBurstTimer = 0;
        this.useTeleportBurstInterval = 8000;
        this.teleportBurstTimer = 0;
        this.teleportBurstInterval = 50;
        this.teleportBurst = false;
        this.burstMax = 20;
        this.currentBurst = 0;
        this.shoot = true;
        this.maxShieldHealth = 1000;
        this.currentShieldHealth = this.maxShieldHealth;
        this.shieldGiveHealth = 0;
        this.teleportSound = audio("sounds/boss/yellow/teleport.ogg");
        this.burstSound = audio("sounds/boss/yellow/shot.ogg");
        this.fireworkSound = audio("sounds/boss/yellow/firework.ogg");
    }

    pushBullet(){
        if (this.shoot) {
            this.game.bullets.push(new YellowBossBullet(this.game, this, 0))
        }
    }
    pushExplosion(){
        this.game.explosions.push(new OrangeExplosion(this.game, this));
    }

    update(deltaTime){
        super.update(deltaTime);

        this.useAbilityTimer += deltaTime;
        if (this.useAbilityTimer >= this.useAbilityInterval){
            this.game.bullets.push(new YellowBossTurboBullet(this.game, this, 0));
            this.useAbilityTimer = 0;
            this.abilityBullet = this.game.bullets[this.game.bullets.length - 1];
            this.burstSound.play();
        }

        if (this.abilityBullet){
            this.bulletDistance -= this.abilityBullet.speed;
            if (this.bulletDistance >= (Math.random() * 300 + 200)){
                this.bulletDistance = 0;

                for (let i = 0; i < 10; i++){
                    this.game.bullets.push(new YellowBossTurboBullet(this.game, {x: this.abilityBullet.x, y: this.abilityBullet.y, width: 1, height: 1}, 0, (360 / 10) * i))
                   
                }

                this.abilityBullet.markedForDeletion = true;
                this.abilityBullet = undefined;
                this.fireworkSound.play();

            }
        }

        this.useTeleportBurstTimer += deltaTime;
        if (this.useTeleportBurstTimer >= this.useTeleportBurstInterval){
            let teleport = false;
            this.game.bullets.forEach(bullet => {
                let dx = bullet.x - (this.x + this.width/2);
                let dy = bullet.y - (this.y + this.height);
                let distance = Math.hypot(dy, dx);

                if (distance <= 50 && bullet.side !== "enemy" && bullet.y > this.y){
                    teleport = true;
                }
            })

            if ((teleport || this.game.lives <= 0) && !this.teleportBurst){
                this.game.explosions.push(new TeleportExplosion(this.game, this));
                this.x = this.ship.x + this.ship.width/2 - this.width/2;
                this.game.explosions.push(new TeleportExplosion(this.game, this));
                this.teleportBurst = true;
                this.move = false;
                this.shoot = false;
                this.shield = true;
                this.teleportSound.play();

            }
            if (this.teleportBurst){
                this.teleportBurstTimer += deltaTime;
                if (this.teleportBurstTimer >= this.teleportBurstInterval){
                    this.game.bullets.push(new YellowBossBullet(this.game, this, 0, 0, 0, -8));
                    this.teleportBurstTimer = 0;
                    this.currentBurst += 1;
                    this.burstSound.currentTime = 0;
                    this.burstSound.play();
                }               

                if (this.currentBurst >= this.burstMax){
                    this.currentBurst = 0;
                    this.teleportBurstTimer = 0
                    this.useTeleportBurstTimer = 0;
                    this.teleportBurst = false;
                    this.move = true;
                    this.shoot = true;
                    this.shield = false;
                    this.currentShieldHealth = this.maxShieldHealth;
                }
            }
        }

    }
}


export class GreenBoss extends Boss {
    constructor(game, ship){
        super(game, ship);
        this.image = document.getElementById("greenBoss");
        this.health = 25000;
        this.maxHealth = this.health;
        this.speed = 4;
        this.useAbilityInterval = Math.random() * 10000 + 12000;
        this.abilityTimer = 0;
        this.abilityInterval = 2;
        this.abilityMax = 30 * 7;
        this.currentAbilityAmount = 0;
        this.color = "green";
        this.leftAngle = 0;
        this.rightAngle = 0;
        this.explodeTimer = 0;
        this.explodeInterval = Math.random() * 8000 + 10000;
        this.explosion = undefined;
        this.explosionOpacity = 0.01;
        this.explodeRadiation = false;
        this.radiationInterval = 0;
        this.radiationTimer = 0;
        this.laserSound = audio("sounds/boss/green/laser.wav");
        this.laserSound.volume = 0.7;
        this.explosionSound = audio("sounds/boss/green/explosion.wav");
        this.radiationSound = audio("sounds/boss/green/radiation.ogg");
        
    }
    pushBullet(){
        this.game.bullets.push(new GreenBossBullet(this.game, this, 0))
    }
    pushExplosion(){
        this.game.explosions.push(new GreenExplosion(this.game, this));
    }

    draw(ctx){
        super.draw(ctx);
        if (this.explosion){
            ctx.fillStyle = `rgba(255, 0, 0, ${this.explosionOpacity})`;
            ctx.strokeStyle = `rgba(255, 0, 0, ${this.explosionOpacity * 1.5})`;
            ctx.beginPath();
            ctx.arc(this.explosion.x + this.explosion.width/2, this.explosion.y + this.explosion.height/2, this.explosion.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    update(deltaTime){
        super.update(deltaTime);

        this.useAbilityTimer += deltaTime;
        if (this.useAbilityTimer >= this.useAbilityInterval){
            this.move = false;
            this.shootTimer = 0;
            
            this.abilityTimer += deltaTime;
            if (this.abilityTimer >= this.abilityInterval && this.currentAbilityAmount < this.abilityMax){
                this.abilityTimer = 0;
                this.game.bullets.push(new GreenBossTurboBullet(this.game, this, 0, this.leftAngle))
                this.game.bullets.push(new GreenBossTurboBullet(this.game, this, 0, this.rightAngle))
                this.currentAbilityAmount += 1;
                this.leftAngle -= 3 / 7;
                this.rightAngle += 3 / 7;
                this.laserSound.play();

                if (this.laserSound.currentTime >= 0.35) this.laserSound.currentTime = 0;
    
            }

            if (this.currentAbilityAmount >= this.abilityMax){
                this.useAbilityTimer = 0;
                this.move = true;
                this.currentAbilityAmount = 0;
                this.rightAngle = 0;
                this.leftAngle = 0;
            }
        }

        this.explodeTimer += deltaTime;

        if (this.explodeTimer >= this.explodeInterval){
            this.game.explosions.push(new OrangeExplosion(this.game, {x: this.x - (125 - this.width/2), y: this.y - (125 - this.height/2), width: 250, height: 250}));
            this.explodeTimer = 0;
            this.explosionOpacity = 0.01;
            this.explosion = this.game.explosions[this.game.explosions.length - 1];
            this.explodeRadiation = true;
            this.explosionSound.play();
            
        }

        if (this.explosion){
            this.radiationTimer += deltaTime;
            if (checkSquareCollision(this.ship, this.explosion)){
                if (this.explosionOpacity > 0.05) this.ship.health -= 5 * (this.explosionOpacity * 4);
                this.radiationSound.play();

            } else {
                this.radiationSound.pause();
            }

            if (this.explosionOpacity < 0.3 && this.explodeRadiation){
                this.explosionOpacity += 0.01;


            } else if (this.radiationTimer >= this.radiationInterval) {
                this.explodeRadiation = false;
                this.explosionOpacity -= 0.01;
                this.radiationInterval = (this.explodeInterval - this.explodeTimer) / (0.13 / 0.01);
                this.radiationTimer = 0;
            }

        } 
        
    }
}