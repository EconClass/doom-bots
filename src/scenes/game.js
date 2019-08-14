import Phaser, { Scene } from 'phaser'

class Game extends Scene {
  constructor() {
    super({
      key: 'game',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    });

    // Starting constiables
    this.staticBg = null;
    this.scrollingBg = null;
    this.alienTargetY = 100;
    this.canUpdateAlien = true;
    this.particles = null;
    this.emitter = null;
    this.isRocketResetting = false;
    this.topSpikes = null;
    this.bottomSpikes = null;
    this.cameraRect = null;
    this.isGameOver = false;
    this.alienSpeedX = 0.005;
  };

  create() {
    this.createBG();
    this.createRocket();
    this.createAlien();

    this.physics.world.enable([this.rocket, this.alien, this.topSpikes]);
    this.input.on('pointerdown', this.launchRocket, this);

    this.createCamera();

    // Add a listener to our resize event
    this.sys.game.events.on('resize', this.resize, this);

    // Call the resize so the game resizes correctly on scene start
    this.createParticles();
  }

  createBG() {
    this.staticBg = this.add.image(135, 240, 'bg-static');
    this.staticBg.displayWidth = 270;
    this.staticBg.displayHeight = 480;
    this.staticBg.setTint(0x444444);
    this.staticBg.setOrigin(0.5);

    this.scrollingBg = this.add.tileSprite(135, 240, 300, 480, 'bg-overlay');
    this.scrollingBg.setOrigin(0.5);

    this.topSpikes = this.add.sprite(135, 0, 'spike');
    this.topSpikes.setOrigin(0.5, 0);
    this.topSpikes.setTint(0xffffff);

    this.bottomSpikes = this.add.sprite(0, 480, 'spike');
    this.bottomSpikes.setOrigin(0, 1);
    this.bottomSpikes.flipY = true;
    this.bottomSpikes.setTint(0xffffff);
  };



  createRocket() {
    this.rocket = this.add.sprite(135, 320, 'rocket');
  };

  createAlien() {
    this.alien = this.add.sprite(135, 100, 'alien');
    this.resetAlien();
  };

  createCamera() {
    // We can add multiple cameras in a Phaser 3 scene
    // This is how we get the main camera
    this.cameraRect = this.add.zone(0, 0, 0, 0);
    const cam = this.cameras.main;
    // Set its viewport as same as our game dimension
    cam.setViewport(0, 0, 270, 480);
    // Center align the camera to occupy all our game objects
    cam.centerToBounds();
  };

  createParticles() {
    this.particles = this.add.particles('particle')
    this.emitter = this.particles.createEmitter({
      x: 135,
      y: 240,
      angle: {
        min: 0,
        max: 360,
      },
      speed: {
        min: 50,
        max: 200,
      },
      quantity: {
        min: 40,
        max: 50,
      },
      lifespan: {
        min: 200,
        max: 500,
      },
      alpha: {
        start: 1,
        end: 0,
      },
      scale: {
        min: 0.5,
        max: 0.5,
      },
      rotate: {
        start: 0,
        end: 360,
      },
      gravity: 800,
      on: false,
    });
  };

  update(time, delta) {
    this.scrollingBg.tilePositionY -= 1;

    if (this.canUpdateAlien) {
      this.moveAlien(time, delta);
      this.physics.add.overlap(this.rocket, this.alien, this.rocketCollideWithAlien, null, this);
    };

    if (!this.isGameOver) {
      this.physics.add.overlap(this.rocket, this.topSpikes, this.rocketCollideWithSpike, null, this);
    };

    if (this.isRocketResetting) {
      this.scrollingBg.tilePositionY -= delta;
      this.rocket.y += delta;
      if (this.rocket.y >= 320) {
        this.rocket.y = 320;
        this.isRocketResetting = false;
        this.resetAlien();
      };
    };
  };

  resetAlien() {
    this.canUpdateAlien = true;
    this.alien.x = 0;
    this.alien.y = -100;
    this.alienTargetY = Phaser.Math.Between(40, 240);
    this.alienSpeedX = Phaser.Math.Between(1, 10) / 1000;
  }

  moveAlien(time) {
    this.alien.y += (this.alienTargetY - this.alien.y) * 0.3;
    this.alien.x = (Math.sin(time * this.alienSpeedX) * 80) + 135;
  }

  launchRocket() {
    if (this.isGameOver) {
      this.resetRocket();
      this.isGameOver = false;
      return
    }
    this.rocket.body.setVelocity(0, -3000);
  }

  rocketCollideWithAlien() {
    if (!this.canUpdateAlien) {
      return
    };

    this.canUpdateAlien = false;
    this.rocket.body.setVelocity(0);

    this.particles.emitParticleAt(this.alien.x, this.alien.y, 100);
    this.cameras.main.shake(300, 0.01, 0.05);

    this.alien.y = -300;
    this.time.delayedCall(200, this.resetRocket, [], this);
  }


  rocketCollideWithSpike() {
    if (this.isGameOver) {
      return
    }

    this.canUpdateAlien = false;
    this.isGameOver = true;
    this.rocket.body.setVelocity(0);
    this.particles.emitParticleAt(this.rocket.x, this.rocket.y);
    this.rocket.y = 600;
    this.cameras.main.shake(300, 0.01, 0.05);
  };

  resetRocket() {
    this.isRocketResetting = true;
  };

  resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = game.config.width / game.config.height;

    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";
    }
  }

  shutdown() {
    // When this scene exits, remove the resize handler
    this.sys.game.events.off('resize', this.resize, this);
  };
};

export default Game;