import { Scene } from 'phaser'

class Preloader extends Scene {
  constructor() {
    super({
      key: 'preloader',
    })
  }

  preload() {
    this.load.image('bg-static', 'assets/square.png')
    this.load.image('bg-overlay', 'assets/bg.png')
    this.load.image('rocket', 'assets/rocket.png')
    this.load.image('alien', 'assets/alien.png')
    this.load.image('particle', 'assets/Particles.png')
    this.load.image('spike', 'assets/Spikes.png')
  }

  create() {
    this.staticBg = this.add.image(135, 240, 'bg-static')
    this.staticBg.displayWidth = 270
    this.staticBg.displayHeight = 480
    this.staticBg.setTint(0x444444)
    this.staticBg.setOrigin(0.5)

    this.scrollingBg = this.add.tileSprite(135, 240, 300, 480, 'bg-overlay')
    this.scrollingBg.setOrigin(0.5)

    this.topSpikes = this.add.sprite(135, 0, 'spike')
    this.topSpikes.setOrigin(0.5, 0)
    this.topSpikes.setTint(0xffffff)

    this.bottomSpikes = this.add.sprite(0, 480, 'spike')
    this.bottomSpikes.setOrigin(0, 1)
    this.bottomSpikes.flipY = true
    this.bottomSpikes.setTint(0xffffff)

    this.add.text(135, 200, 'Doom \n Bots', {
      fontFamily: 'Helvetica',
      fontSize: 36,
      color: '#ffffff66',
      align: 'center',
    });

    // Transfer control to game Scene when logo is clicked
    this.input.on('pointerdown', () => { this.scene.start('game') }, this)
  }

  update() {
    this.scrollingBg.tilePositionY -= 1
  }
}

export default Preloader