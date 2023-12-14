import { SpaceshipGreenBullet, SpaceshipBlueBullet, SpaceshipPurpleBullet } from "./bullets.js";
import { checkSquareCollision, fillTextHelper, audio } from "./main.js";
import { GreenExplosion } from "./explosions.js";

export class Spaceship {
    constructor(game){
        this.game = game;
        this.image = document.getElementById("greenBody");
        this.normalWings = document.getElementById("greenWeapon");
        this.turboWings = document.getElementById("greenTurboWeapon");
        this.shieldImage = document.getElementById("shield");
        this.width = 80;
        this.height = 80;
        this.x = this.game.width/2 - this.width/2;
        this.y = this.game.height/2 - this.height/2;
        this.origX = this.x;
        this.origY = this.y;
        this.hitbox = [this.x, this.y, this.width, this.height];
        this.speed = 4;
        this.bulletTimer = 0;
        this.bulletInterval = 200;
        this.health = 200;
        this.origHealth = this.health;
        this.dead = false;
        this.deadTimer = 0;
        this.deadInterval = 2000;
        this.maxHealth = this.health;
        this.explodeRadius = 0;
        this.turboBulletsMag = 0;
        this.ballisticBulletsMag = 0;
        this.maxMagCapacity = 400;
        this.bulletsMag = 500;
        this.reloading = false;
        this.reloadTimer = 0;
        this.reloadInterval = 50;
        this.quickReload = false;
        this.shield = false;
        this.maxShieldHealth = 100;
        this.currentShieldHealth = this.maxShieldHealth;
        this.explodeAudio = audio("sounds/explosions/shipExplode.wav")

        // Audio Imports

        this.blueAudio = [audio("sounds/shoot/blue/1.wav"), audio("sounds/shoot/blue/2.wav"), audio("sounds/shoot/blue/3.wav"), audio("sounds/shoot/blue/4.wav"), audio("sounds/shoot/blue/5.wav"), audio("sounds/shoot/blue/6.wav"), audio("sounds/shoot/blue/7.wav"), audio("sounds/shoot/blue/8.wav"), audio("sounds/shoot/blue/9.wav"), audio("sounds/shoot/blue/0.wav")];

        this.greenAudio = [audio("sounds/shoot/green/1.wav"), audio("sounds/shoot/green/2.wav"), audio("sounds/shoot/green/3.wav"), audio("sounds/shoot/green/4.wav"), audio("sounds/shoot/green/5.wav"), audio("sounds/shoot/green/6.wav"), audio("sounds/shoot/green/7.wav"), audio("sounds/shoot/green/8.wav")];
        
        this.purpleAudio = [audio("sounds/shoot/purple/1.wav"), audio("sounds/shoot/purple/2.wav"), audio("sounds/shoot/purple/3.wav"), audio("sounds/shoot/purple/4.wav"), audio("sounds/shoot/purple/5.wav"), audio("sounds/shoot/purple/6.wav"), audio("sounds/shoot/purple/7.wav"), audio("sounds/shoot/purple/8.wav"), audio("sounds/shoot/purple/9.wav"), audio("sounds/shoot/purple/0.wav")];

        let allAudio = [...this.blueAudio, ...this.greenAudio, ...this.purpleAudio]

        allAudio.forEach(audio => {
            audio.volume = 0.75;
        })
    }

    chooseShip(color){
        if (color === "purple"){
            this.image = document.getElementById("purpleBody");
            this.normalWings = document.getElementById("purpleWeapon");
            this.turboWings = document.getElementById("purpleTurboWeapon");

        } else if (color === "yellow"){
            this.image = document.getElementById("yellowBody");
            this.normalWings = document.getElementById("yellowWeapon");
            this.turboWings = document.getElementById("yellowTurboWeapon");
        }
    }

    draw(ctx){
        if (!this.dead) {
            ctx.drawImage(this.turboWings, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.normalWings, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

            this.drawHealthBar(ctx);
        }

        ctx.strokeStyle = "red";
        //ctx.strokeRect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3])

        ctx.lineWidth = 10;
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.game.width/2, this.game.height, this.explodeRadius, 0, Math.PI * 2)
        ctx.stroke();

        // Draw the Shield

        ctx.save();
        ctx.globalAlpha = (this.currentShieldHealth / this.maxShieldHealth);

        if (this.shield && !this.dead){
            ctx.drawImage(this.shieldImage, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.shieldImage, this.x, this.y, this.width, this.height);
        }

        ctx.restore();
        
    }

    drawSideInformation(ctx){
        let maxLength = 300;
        let length = Math.min((this.bulletsMag / this.maxMagCapacity) * maxLength, maxLength)

        fillTextHelper(this.bulletsMag, "cyan", "20px Arial", "center", 40, 117, ctx)
        ctx.fillRect(80, 100, length, 20);

        length = Math.min((this.turboBulletsMag / this.maxMagCapacity) * maxLength, maxLength)
        fillTextHelper(this.turboBulletsMag, "lightgreen", "20px Arial", "center", 40, 157, ctx)
        ctx.fillRect(80, 140, length, 20);

        length = Math.min((this.ballisticBulletsMag / this.maxMagCapacity) * maxLength, maxLength)
        fillTextHelper(this.ballisticBulletsMag, "purple", "20px Arial", "center", 40, 197, ctx)
        ctx.fillRect(80, 180, length, 20);

        // Side health bar

        let width = 300;
        let greenLength = Math.max(0, (width) * (this.health / this.maxHealth));

        ctx.fillStyle = "red";
        ctx.fillRect(this.game.rightSideMenu.x + this.game.rightSideMenu.width/2 - width/2 - 30, 100, width, 20);
        ctx.fillStyle = "green";
        ctx.fillRect(this.game.rightSideMenu.x + this.game.rightSideMenu.width/2 - width/2 - 30, 100, greenLength, 20);

        fillTextHelper(this.health.toFixed(1), "white", "20px Arial", "center", (this.game.rightSideMenu.x + this.game.rightSideMenu.width/2 - width/2 - 30) + width + 50, 117, ctx)
    }

    drawHealthBar(ctx){
        let greenLength = (this.width - 20) * (this.health / this.maxHealth);

        ctx.fillStyle = "red";
        ctx.fillRect(this.x + 10, this.y - 10, this.width - 20, 10);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x + 10, this.y - 10, greenLength, 10);

    }  

    update(deltaTime){
        this.hitbox = [this.x + 5, this.y + 10, this.width - 10, this.height - 20]

        if (!this.dead) {
            this.bulletTimer += deltaTime;

            if (this.game.keys.indexOf("w") !== -1 && this.hitbox[1] > this.speed) this.y -= this.speed;
            else if (this.game.keys.indexOf("s") !== -1 && this.hitbox[1] < this.game.height - this.speed - this.hitbox[3]) this.y += this.speed;
            if (this.game.keys.indexOf("d") !== -1 && this.hitbox[0] < (this.game.background.x + this.game.background.width - this.hitbox[2]) - this.speed - 3) this.x += this.speed;
            else if (this.game.keys.indexOf("a") !== -1 && this.hitbox[0] > this.game.background.x + this.speed + 3) this.x -= this.speed;
    
            if (this.game.keys.indexOf(" ") !== -1 && this.bulletTimer >= this.bulletInterval && !this.reloading){
                this.bulletTimer = 0;

                if (this.bulletsMag > 0) {
                    this.game.bullets.push(new SpaceshipBlueBullet(this.game, this, 20))
                    this.game.bullets.push(new SpaceshipBlueBullet(this.game, this, -20))

                    let pickedAudio = this.blueAudio[Math.floor(Math.random() * this.blueAudio.length)]

                    pickedAudio.currentTime = 0;
                    pickedAudio.play();
    
                    if (!this.game.wonGame) {
                        this.bulletsMag -= 2;
                    }
                }

                if (this.turboBulletsMag > 0){
                    this.game.bullets.push(new SpaceshipGreenBullet(this.game, this, 0))
                    
                    let pickedAudio = this.greenAudio[Math.floor(Math.random() * this.greenAudio.length)]

                    pickedAudio.currentTime = 0;
                    pickedAudio.play();

                    if (!this.game.wonGame) {
                        this.turboBulletsMag -= 1;
                    }
                }

                if (this.ballisticBulletsMag > 0){
                    
                    let pickedAudio = this.purpleAudio[Math.floor(Math.random() * this.purpleAudio.length)]

                    pickedAudio.currentTime = 0;
                    pickedAudio.play();

                    this.game.bullets.push(new SpaceshipPurpleBullet(this.game, this, 27, 0, 10))
                    this.game.bullets.push(new SpaceshipPurpleBullet(this.game, this, -27, 0, 10))

                    if (!this.game.wonGame) {
                        this.ballisticBulletsMag -= 2;
                    }
                }
            }

            if (this.bulletsMag <= 0) this.quickReload = true;

            if (this.quickReload){
                this.reloadInterval = 35;
            } else {
                this.reloadInterval = 70;
            }

            if (this.game.mouse.clicked){
                this.reloadTimer += deltaTime;
                if (this.reloadTimer >= this.reloadInterval){
                    this.bulletsMag += 2;
                    this.reloadTimer = 0;
                }
                this.reloading = true;

            } else {
                this.reloading = false;
                this.quickReload = false;
            }
    
            this.game.bullets.forEach(bullet => {
                if (checkSquareCollision(this, bullet) && bullet.side !== "friend"){
                    if (!this.shield){
                        this.health -= bullet.damage;
                    } else {
                        this.currentShieldHealth -= bullet.damage;
                        
                        if (this.currentShieldHealth <= 0){
                            this.shield = false;
                            this.currentShieldHealth = this.maxShieldHealth;
                        }
                    }

                    bullet.markedForDeletion = true;

                }
            })
    
            if (this.health <= 0 && !this.game.wonGame){
                this.dead = true;
                this.game.explosions.push(new GreenExplosion(this.game, this))
                this.bulletsMag = 500;
                this.turboBulletsMag = 0;
                this.ballisticBulletsMag = 0;
                this.game.lives -= 1;
                this.explodeAudio.currentTime = 0;
                this.explodeAudio.play();
            };

        } else {
            this.x = this.game.width/2 - this.width/2;
            this.y = this.game.height + 50;

            if (this.game.lives > 0) {
                this.explodeRadius += 10;

                this.game.enemyTimer = 0;
                this.game.enemies.forEach(enemy => {
                    let dx = (enemy.x + enemy.width/2) - this.game.width/2;
                    let dy = (enemy.y + enemy.height) - this.game.height;
                    let distance = Math.hypot(dy, dx);

                    if (distance <= this.explodeRadius && enemy.type !== "boss"){
                        enemy.health = 0;
                    }
                })   

                this.deadTimer += deltaTime;
                if (this.deadTimer >= this.deadInterval){
                    this.deadTimer = 0;
                    this.x = this.origX;
                    this.y = this.origY;
                    this.dead = false;
                    this.health = this.maxHealth;
                    this.explodeRadius = 0;
                }
            }
        }
    }
}