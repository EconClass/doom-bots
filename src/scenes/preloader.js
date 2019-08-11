import { Scene } from 'phaser'
export class Preloader extends Scene {
  constructor() {
    super({
      key: 'preloader'
    })
  }
  preload() {
    this.load.image('bg-static', 'assets/square.png')
    this.load.image('bg-overlay', 'assets/bg.png')
  }
}