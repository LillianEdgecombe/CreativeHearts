import HomeScene from './scenes/HomeScene.js';
import MusicPuzzleScene from './scenes/MusicPuzzleScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    scene: [HomeScene, MusicPuzzleScene],
    backgroundColor: '#3e2723',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
