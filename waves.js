export class Waves {
    constructor(game){
        this.game = game;
        this.wave = 1;
        this.waves = [];
        this.currentWave = undefined;
        this.addWaves();
        
    }
    addWave(enemyCount, healthBonus, enemyTypes, enemyInterval, enemyShootIntervalBuff, enemyDamageBuff, enemyHealthBuff, enemySpeedBuff){
        this.waves.push(new Wave(enemyCount, healthBonus, enemyTypes, enemyInterval, enemyShootIntervalBuff, enemyDamageBuff, enemyHealthBuff, enemySpeedBuff))
    }
    addWaves(){
        // Pink Wave

        //this.addWave(1, 50, ["pinkBoss"], 1000, 1, 1, 1, 1);

        this.addWave(5, 25, ["pink"], 3000, 1, 1, 1, 1);
        this.addWave(10, 25, ["pink", "pinkTurbo"], 3000, 1, 1, 1, 1);
        this.addWave(15, 25, ["pink", "pinkTurbo"], 3000, 1, 1, 1, 1);
        this.addWave(15, 25, ["pink", "pinkTurbo", "blue"], 3000, 1, 1, 1, 1);
        this.addWave(15, 50, ["pink", "pinkTurbo", "blue"], 3000, 1, 1, 1, 1);
        this.addWave(1, 50, ["pinkBoss"], 5000, 1, 1, 1, 1);

        // Blue Wave

        this.addWave(15, 25, ["blue"], 2900, 1, 1, 1, 1);
        this.addWave(15, 25, ["blue", "blueTurbo", "pinkTurbo"], 2900, 1, 1, 1, 1);
        this.addWave(15, 25, ["blue", "blueTurbo", "yellow", "pinkTurbo"], 2900, 1, 1, 1, 1);
        this.addWave(15, 25, ["blue", "blueTurbo", "yellow", "yellowTurbo"], 2900, 1, 1, 1, 1);
        this.addWave(15, 50, ["yellowTurbo", "yellow", "blue", "blueTurbo", "pinkTurbo"], 2900, 1, 1, 1, 1);
        this.addWave(1, 50, ["blueBoss"], 5000, 1, 1, 1, 1);

        // Yellow Wave

        this.addWave(15, 25, ["yellow", "yellowTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["yellow", "yellowTurbo", "blueTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["yellow", "yellowTurbo", "purple", "blue", "blueTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["yellow", "yellowTurbo", "green", "blueTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 50, ["yellowTurbo", "green", "yellow", "purpleTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(1, 50, ["yellowBoss"], 5000, 1, 1, 1, 1);

        // Green Wave

        this.addWave(15, 25, ["green", "greenTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["green", "greenTurbo", "purpleTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["green", "greenTurbo", "purple", "yellow", "purpleTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 25, ["green", "greenTurbo", "purple", "purpleTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(15, 50, ["greenTurbo", "yellowTurbo", "blueTurbo", "purpleTurbo", "pinkTurbo"], 2800, 1, 1, 1, 1);
        this.addWave(1, 50, ["greenBoss"], 1000, 1, 1, 1, 1);
    }

    update(){
        if (this.wave > this.waves.length){
            this.game.wonGame = true;

        } else if (this.game.lives > 0) {
            this.currentWave = this.waves[this.wave-1];
            this.game.wave = this.wave;
            this.game.waveAmount = this.currentWave.enemyCount;
            this.game.spawnInterval = this.currentWave.enemyInterval;
            this.game.enemyTypes = this.currentWave.enemyTypes;
            this.game.enemyShootIntervalBuff = this.currentWave.enemyShootIntervalBuff;
            this.game.enemyDamageBuff = this.currentWave.enemyDamageBuff;
            this.game.enemyHealthBuff = this.currentWave.enemyHealthBuff;
            this.game.enemySpeedBuff = this.currentWave.enemySpeedBuff;
        }

    }
}

class Wave {
    constructor(enemyCount, healthBonus, enemyTypes, enemyInterval, enemyShootIntervalBuff, enemyDamageBuff, enemyHealthBuff, enemySpeedBuff){
        this.enemyCount = enemyCount;
        this.healthBonus = healthBonus;
        this.enemyTypes = enemyTypes;
        this.enemyInterval = enemyInterval;
        this.enemyShootIntervalBuff = enemyShootIntervalBuff;
        this.enemyDamageBuff = enemyDamageBuff;
        this.enemyHealthBuff = enemyHealthBuff;
        this.enemySpeedBuff = enemySpeedBuff;
        //console.log(this.enemyHealthBuff)
        
    }
}