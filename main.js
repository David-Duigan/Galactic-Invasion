import { ParallaxBackground } from "./background.js";
import { LeftSideMenu, RightSideMenu } from "./sideMenus.js";
import { Spaceship } from "./spaceship.js";
import { BlueBulletNormal, SpaceshipBlueBullet, SpaceshipGreenBullet, SpaceshipPurpleBullet } from "./bullets.js";
import { PinkEnemy, BlueEnemy, YellowEnemy, PinkEnemyTurbo, BlueEnemyTurbo, YellowEnemyTurbo, GreenEnemy, GreenEnemyTurbo, PurpleEnemy, PurpleEnemyTurbo, PinkBoss, BlueBoss, YellowBoss, GreenBoss } from "./enemies.js";
import { BlueExplosion, OrangeExplosion, GreenExplosion, TeleportExplosion } from "./explosions.js";
import { GreenPowerUp, PurplePowerUp, HealthPowerUp } from "./powerups.js";
import { Waves } from "./waves.js";

export function fillTextHelper(text, color, font, align, x, y, ctx){
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y)
}

export function checkSquareCollision(object, other){
    if (object.hitbox[0] <= other.hitbox[0] + other.hitbox[2] && object.hitbox[0] + object.hitbox[2] >= other.hitbox[0] && object.hitbox[1] <= other.hitbox[1] + other.hitbox[3] && object.hitbox[1] + object.hitbox[3] >= other.hitbox[1]){
        return true;
    }

    return false;
}

export function audio(src){
    let audio = new Audio();
    audio.src = src;

    return audio;
}

window.addEventListener("load", e => {
    const loading = document.getElementById("loading");
    loading.style.display = "none";

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 

    class InputHandler {
        constructor(game){
            this.game = game;

            window.addEventListener("keydown", e => {
                if (this.game.keys.indexOf(e.key) === -1 && !this.pressed){
                    this.game.keys.push(e.key)
                };
            });
            window.addEventListener("keyup", e => {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1) 
            });
        }
    }

    class Button {
        constructor(game, x, y, width, height, text, color, stroke, font=undefined, image=undefined, name="none", hoverColor=color){
            this.game = game;
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.origX = this.x;
            this.text = text;
            this.color = color;
            this.hoverColor = hoverColor
            this.stroke = stroke;
            this.image = image;
            this.hover = false;
            this.font = font;
            this.name = name;
    
        }
        draw(ctx){
            this.priceX = this.x + this.width * 1.5 + 10;
            this.update();
    
            if (this.hover){
                ctx.fillStyle = this.hoverColor;
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = 5;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
    
            if (this.font) {
                ctx.font = this.font;
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height/2 + 8)
            }

            if (this.image){
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
    
        }
        update(){
            if (this.checkMouseCollision() && !this.game.mouse.clicked){
                this.hover = true;
            } else {
                this.hover = false;
            }
        }
        checkMouseCollision(){
            if (this.game.mouse.x >= this.x && this.game.mouse.x <= this.x + this.width
                && this.game.mouse.y >= this.y && this.game.mouse.y <= this.y + this.height){
                    return true;
            }
    
            return false;
        }
    }

    class Game {
        constructor(canvas, ctx){
            this.ctx = ctx;
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.keys = [];
            this.inputHandler = new InputHandler(this);
            this.background = new ParallaxBackground(this)
            this.leftSideMenu = new LeftSideMenu(this);
            this.rightSideMenu = new RightSideMenu(this);
            this.spaceShip = new Spaceship(this)
            this.bullets = [new SpaceshipGreenBullet(this, this.spaceShip)];
            this.enemies = []
            this.waves = new Waves(this)
            this.powerups = []
            this.explosions = []
            this.spawnTimer = 0;
            this.spawnInterval = 40000;
            this.origSpawnInterval = this.spawnInterval;
            this.enemyTypes = ["blue", "pink", "yellow", "pinkTurbo", "blueTurbo", "yellowTurbo", "green", "greenTurbo", "purple", "purpleTurbo"]
            this.powerupTimer = 0;
            this.powerupInterval = 50000;
            this.lives = 5;
            this.heartImage = document.getElementById("heart");
            this.gameOver = false;
            this.gameOverTimer = 0;
            this.gameOverInterval = 10000;
            this.wave = 1;
            this.waveAmount = 5;
            this.currentAmount = 0;
            this.waveBetween = false;
            this.betweenTimer = 0;
            this.betweenInterval = 3000;
            this.origWaveAmount = this.waveAmount;
            this.wonGame = false;
            this.winShootTimer = 0;
            this.winShootInterval = 100;
            this.healthTimer = 0;
            this.healthInterval = Math.random() * 50000 + 150000;
            this.calledBosses = false;
            this.enemySpeedBuff = 1;
            this.enemyShootIntervalBuff = 1;
            this.enemyDamageBuff = 1;
            this.enemyHealthBuff = 1;
            this.startGame = false;
            this.music = audio("sounds/music1.mp3")
            this.music.volume = 0;
            this.teleportSound = audio("sounds/misc/endTeleport.ogg");

            let buttonCount = 3;
            let buttonWidth = 100;
            let buttonSpacing = 40;
            let buttonSquareWidth = buttonWidth * buttonCount + buttonSpacing * 2;
            let buttonStartX = this.width*0.5 - buttonSquareWidth*0.5;
            let buttonAddAmount = buttonWidth + buttonSpacing;

            this.menuButtons = [new Button(this, buttonStartX, 400, buttonWidth, buttonWidth, "", "transparent", "white", undefined, document.getElementById("greenBody"), "green", "rgba(0, 128, 0, 0.3)"), new Button(this, buttonStartX + buttonAddAmount, 400, buttonWidth, buttonWidth, "", "transparent", "white", undefined, document.getElementById("purpleBody"), "purple", "rgba(138, 43, 226, 0.3)"), new Button(this, buttonStartX + buttonAddAmount * 2, 400, buttonWidth, buttonWidth, "", "transparent", "white", undefined, document.getElementById("yellowBody"), "yellow", "rgba(255, 255, 0, 0.3)")];

            this.mouse = {
                x: undefined,
                y: undefined,
                clicked: false,
                start: undefined,
                moving: false,
            };

            window.addEventListener("mousedown", e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
                this.mouse.clicked = true;
                this.mouse.start = e.x;
            });

            window.addEventListener("mousemove", e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y; 
                if ((this.mouse.start >= this.mouse.x + 40 || this.mouse.start <= this.mouse.x - 40) && this.mouse.clicked) {
                    this.mouse.moving = true;
                } else {
                    this.mouse.moving = false;
                }
            });

            window.addEventListener("mouseup", e => {
                this.mouse.clicked = false;
                this.origOffsetX = this.offsetX;
                this.mouse.moving = false;
            });

        }

        render(deltaTime){
            this.music.play();

            if (this.startGame) {
                this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
                this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
                this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
                this.powerups = this.powerups.filter(powerup => !powerup.markedForDeletion);

    
                if (!this.lives <= 0) {
                    this.waves.update();
                }
    
                // this.enemySpeedBuff = 0.8;
                // this.enemyDamageBuff = 0.9;
                // this.enemyShootIntervalBuff = 1.2;
    
                this.spawnTimer += deltaTime;
                if (this.spawnTimer >= this.spawnInterval && !this.waveBetween){
                    this.spawnTimer = 0;
                    if (this.lives > 0) {
                        this.currentAmount += 1;
                    }
                    let enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
    
                    if (enemyType === "pink") this.enemies.push(new PinkEnemy(this));
                    else if (enemyType === "blue") this.enemies.push(new BlueEnemy(this));
                    else if (enemyType === "yellow") this.enemies.push(new YellowEnemy(this));
                    else if (enemyType === "pinkTurbo") this.enemies.push(new PinkEnemyTurbo(this));
                    else if (enemyType === "blueTurbo") this.enemies.push(new BlueEnemyTurbo(this));
                    else if (enemyType === "yellowTurbo") this.enemies.push(new YellowEnemyTurbo(this));
                    else if (enemyType === "green") this.enemies.push(new GreenEnemy(this));
                    else if (enemyType === "greenTurbo") this.enemies.push(new GreenEnemyTurbo(this));
                    else if (enemyType === "purple") this.enemies.push(new PurpleEnemy(this));
                    else if (enemyType === "purpleTurbo") this.enemies.push(new PurpleEnemyTurbo(this));
                    else if (enemyType === "pinkBoss") this.enemies.push(new PinkBoss(this, this.spaceShip));
                    else if (enemyType === "blueBoss") this.enemies.push(new BlueBoss(this, this.spaceShip));
                    else if (enemyType === "yellowBoss") this.enemies.push(new YellowBoss(this, this.spaceShip));
                    else if (enemyType === "greenBoss") this.enemies.push(new GreenBoss(this, this.spaceShip));
                    
                }
    
                this.powerupTimer += deltaTime;
                if (this.powerupTimer >= this.powerupInterval && !this.wonGame){
                    this.powerupTimer = 0;
                    let powerups = ["purple", "green"];
                    let powerup = powerups[Math.floor(Math.random() * powerups.length)];
    
                    if (powerup === "green") this.powerups.push(new GreenPowerUp(this))
                    else if (powerup === "purple") this.powerups.push(new PurplePowerUp(this))
    
                    this.powerupTimer = 0;
                }
    
                this.healthTimer += deltaTime;
                if (this.healthTimer >= this.healthInterval){
                    this.healthTimer = 0;
                    this.healthInterval = Math.random() * 50000 + 100000;
                    this.powerups.push(new HealthPowerUp(this))
                }
    
                this.background.render(this.ctx);
    
                this.explosions.forEach(explosion => {
                    explosion.draw(this.ctx);
                    explosion.update(deltaTime);
                })

                this.spaceShip.draw(this.ctx);
                this.spaceShip.update(deltaTime);

                this.enemies.forEach(enemy => {
                    enemy.draw(ctx);
                    enemy.update(deltaTime);
                })
    
                this.bullets.forEach(bullet => {
                    bullet.draw(this.ctx);
                    bullet.update(deltaTime);
                })
    
                this.powerups.forEach(powerup => {
                    powerup.draw(this.ctx);
                    powerup.update();
                })
    
                this.leftSideMenu.draw(this.ctx);
                this.rightSideMenu.draw(this.ctx);
    
                this.spaceShip.drawSideInformation(this.ctx);
                
    
                let x = 0;
    
                for (let i = 0; i < this.lives; i++){
                    this.ctx.drawImage(this.heartImage, 100 + x, 20, 40, 40)
                    x += 50
                }
    
                if (this.lives <= 0 && !this.wonGame){ 
                    this.spaceShip.health = 0;
                    let bossColors = ["pink", "blue", "yellow", "green"]
    
                    this.enemyTypes = ["blue", "pink", "yellow", "pinkTurbo", "blueTurbo", "yellowTurbo", "green", "greenTurbo", "purple", "purpleTurbo"]
    
                    this.enemies.forEach(enemy => {
                        if (enemy.type !== "boss") {
                            enemy.speed *= 1.02;
                        } else {
                            bossColors.splice(bossColors.indexOf(enemy.color), 1);
                            enemy.shield = false;
    
                        }
                    })
    
                    bossColors.forEach(boss => {
                        if (boss === "pink"){
                            this.enemies.push(new PinkBoss(this, this.spaceShip));
                        } else if (boss === "blue"){
                            this.enemies.push(new BlueBoss(this, this.spaceShip));
                        } else if (boss === "yellow"){
                            this.enemies.push(new YellowBoss(this, this.spaceShip));
                        } else if (boss === "green"){
                            this.enemies.push(new GreenBoss(this, this.spaceShip));
                        }
                    })
                    
                    this.waveBetween = false;
                    this.gameOverTimer += deltaTime;
                    if (this.gameOverTimer >= this.gameOverInterval){
                        this.gameOver = false;
                    }
    
                    this.ctx.font = "45px Arial";
                    this.ctx.textAlign = "center";
                    this.ctx.fillStyle = "red";
                    this.ctx.fillText(`You have been Defeated!`, this.width/2, this.height/2 - 30)
                    this.ctx.fillStyle = "yellow";
                    this.ctx.fillText(`Click to try and save another Planet.`, this.width/2, this.height/2 + 30)
    
                    this.spawnInterval = 200;
    
                    this.enemies.forEach(enemy => {
                        if (enemy.y >= this.height - enemy.height){
                            this.explosions.push(new TeleportExplosion(this, enemy));
                            enemy.markedForDeletion = true;
                            this.teleportSound.currentTime = 0;
                            //enemy.teleportSound.play();
                        }
                    })
    
                    if (this.mouse.clicked){
                        this.spawnInterval = this.origSpawnInterval;
                        this.lives = 5;
                        this.spaceShip.health = this.spaceShip.origHealth;
                        this.spaceShip.maxHealth = this.spaceShip.origHealth;
                        this.waves.wave = 1;
                        this.currentAmount = 0;
                        this.powerups = [];
                        this.powerupTimer = 0;
                        this.spawnTimer = 0;
                        this.spaceShip.dead = false;
                        this.spaceShip.shield = false;
                        this.spaceShip.currentShieldHealth = this.spaceShip.maxShieldHealth;
                        this.spaceShip.x = this.spaceShip.origX;
                        this.spaceShip.y = this.spaceShip.origY;
    
                        this.enemies.forEach(enemy => {
                            enemy.health = 0;
                        })
                    }
                
                };
    
                if (this.currentAmount >= this.waveAmount && !this.wonGame){
                    this.waveBetween = true;
                    this.currentAmount = 0;
                }
    
                if (this.waveBetween && this.enemies.length <= 0 && this.lives > 0 && !this.wonGame){
                    this.betweenTimer += deltaTime;
                    if (this.betweenTimer >= this.betweenInterval){
                        this.betweenTimer = 0;
                        this.waveBetween = false;
                        this.spaceShip.health += this.waves.currentWave.healthBonus;
                        this.spaceShip.maxHealth += this.waves.currentWave.healthBonus;
                        this.waves.wave += 1;
                    }
                    fillTextHelper(`Prepare for Wave ${this.waves.wave + 1}`, "white", "55px Arial", "center", this.width/2, this.height/2, this.ctx);
    
                }
    
                fillTextHelper(`Wave ${this.waves.wave}`, "white", "45px Arial", "center", this.rightSideMenu.x + this.rightSideMenu.width/2, 50, this.ctx)
    
                if (this.wonGame){
                    this.enemyTypes = ["blue", "pink", "yellow", "pinkTurbo", "blueTurbo", "yellowTurbo", "green", "greenTurbo", "purple", "purpleTurbo"]
    
                    this.spawnInterval = 500;
                    this.spaceShip.shield = true;
                    this.spaceShip.turboBulletsMag = 1000;
                    this.spaceShip.ballisticBulletsMag = 1000;
                    this.spaceShip.bulletsMag = 1000;
                    this.spaceShip.health = this.spaceShip.maxHealth;
                    this.spaceShip.maxShieldHealth = 10000000;
    
                    fillTextHelper("You Held back the enemy for long enough!", "white", "45px Arial", "center", this.width/2, this.height/2 - 30, this.ctx)
                    fillTextHelper("The Planets defense System has been activated.", "white", "45px Arial", "center", this.width/2, this.height/2 + 30, this.ctx)
                    fillTextHelper("Well done!", "white", "50px Arial", "center", this.width/2, this.height/2 + 95, this.ctx)
    
                    this.winShootTimer += deltaTime;
                    if (this.winShootTimer >= this.winShootInterval){
                        this.winShootTimer = 0;
                        if (this.enemies.length > 0){
                            this.bullets.push(new SpaceshipGreenBullet(this, {x: this.enemies[0].x + this.enemies[0].width/2, y: this.height, width: 1}, 0));
                        }
                    
                        if (this.enemies.length > 1){
                            
                            this.bullets.push(new SpaceshipGreenBullet(this, {x: this.enemies[1].x + this.enemies[1].width/2, y: this.height, width: 1}, 0));
                        } 
                        if (this.enemies.length > 2){
                            this.bullets.push(new SpaceshipGreenBullet(this, {x: this.enemies[2].x + this.enemies[2].width/2, y: this.height, width: 1}, 0));
                        }
    
                                        
                    }
                    
                }
            } else {
                fillTextHelper(`Space Invaders`, "white", "85px Arial", "center", this.width/2, 150, this.ctx);
                fillTextHelper(`Click to start playing!`, "white", "35px Arial", "center", this.width/2, 200, this.ctx);

                this.menuButtons.forEach(button => {
                    button.draw(this.ctx);
                    button.update();

                    if (this.mouse.clicked){
                        if (button.checkMouseCollision()){
                            if (button.name === "green"){
                                this.spaceShip.chooseShip("green");

                            } else if (button.name === "purple"){
                                this.spaceShip.chooseShip("purple");

                            } else if (button.name === "yellow"){
                                this.spaceShip.chooseShip("yellow");
                            }
                            this.startGame = true;

                        }
                    }
                })       
                
                fillTextHelper(`Made by David Duigan`, "white", "15px Arial", "left", 20, this.height - 20, this.ctx);

    
            }
        
        }
    }

    const game = new Game(canvas, ctx);

    let lastTime = 0;

    function animate(timeStamp){

        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        game.render(deltaTime);

        if (!game.gameOver) requestAnimationFrame(animate);
    }

    animate(0);

})
