import { Scene } from 'phaser'

export class Game extends Scene {
  constructor() {
    super({
      key: 'game'
    })
    this.staticBg = null
    this.scrollingBg = null
  }

  create() {
    // Add the static square bg first at 0,0 position
    this.staticBg = this.add.image(0, 0, 'bg-static')
    // Apply a grey tint to it
    this.staticBg.setTint(0x444444)
    this.staticBg.setOrigin(0.5)
    // Add a tilesprite so the striped image(396x529) can be scrolled indefinitely
    this.scrollingBg = this.add.tileSprite(0, 0, 396, 529, 'bg-overlay')
    this.scrollingBg.setOrigin(0.5)

    // We can add multiple cameras in a Phaser 3 scene
    // This is how we get the main camera
    let cam = this.cameras.main
    // Set its viewport as same as our game dimension
    cam.setViewport(0, 0, 270, 480)
    // Center align the camera to occupy all our game objects
    cam.centerToBounds()
  }

  update() {
    this.scrollingBg.tilePositionY -= 1
  }
}