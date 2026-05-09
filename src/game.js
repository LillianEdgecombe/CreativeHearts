import HomeScene from './scenes/HomeScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    scene: [HomeScene],
    backgroundColor: '#333'
};

const game = new Phaser.Game(config);
