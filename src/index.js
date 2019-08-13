import phaser from 'phaser'
import Preloader from './scenes/preloader'
import Game from './scenes/game'

const config = {
  width: 270,
  height: 480,
  parent: 'content',
  backgroundColor: '#fff',
  scene: [
    Preloader,
    Game,
  ],
}
const game = new phaser.Game(config)

window.onresize = function () {
  game.renderer.resize(window.innerWidth, window.innerHeight)
  game.events.emit('resize')
}