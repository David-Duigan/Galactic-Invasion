export class ParallaxBackground {
    constructor(game){
        this.game = game;
        this.width = this.game.height + 10;
        this.x = this.game.width/2 - this.width/2;
        this.layerImages = [document.getElementById("bgLayer1"), document.getElementById("bgLayer2"), document.getElementById("bgLayer3"), document.getElementById("bgLayer4"), document.getElementById("bgLayer5"), document.getElementById("bgLayer6")];
        
        this.layers = [new Layer(this.game, 0, this.layerImages[0]), new Layer(this.game, 0.4, this.layerImages[1]), new Layer(this.game, 0.6, this.layerImages[2]), new Layer(this.game, 0.8, this.layerImages[3]), new Layer(this.game, 1, this.layerImages[4]), new Layer(this.game, 0, this.layerImages[5])];
    }

    render(ctx){
        this.layers.forEach(layer => {
            layer.draw(ctx);
            layer.update();
        })
    }
}


class Layer {
    constructor(game, speedMultiplier, image){
        this.game = game;
        this.speedMultiplier = speedMultiplier;
        this.image = image;
        this.offset = 0;
        this.speed = 0.2 * this.speedMultiplier;
        this.width = this.game.height + 10;
        this.x = this.game.width/2 - this.width/2;
    }
    draw(ctx){
        ctx.drawImage(this.image, this.x + this.offset, 0, this.width, this.game.height);
        ctx.drawImage(this.image, this.x - this.width + this.offset, 0, this.width, this.game.height);
    }

    update(){
        this.offset += this.speed;
        if (this.offset >= this.width) this.offset = 0;
    }
}