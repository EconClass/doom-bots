import Phaser from 'phaser'
import Preloader from './scenes/preloader'
import Game from './scenes/game'

const config = {
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 270,
    height: 480,
  },
  parent: 'content',
  backgroundColor: '#fff',
  scene: [
    Preloader,
    Game,
  ],
}

const game = new Phaser.Game(config)

window.onload = function () {
  window.addEventListener("resize", game.renderer.resize, false);
};

window.onresize = function () {
  game.renderer.resize(window.innerWidth, window.innerHeight)
  game.events.emit('resize')
}
