import { state } from '../state.js';

export default class MusicPuzzleScene extends Phaser.Scene {
    constructor() {
        super('MusicPuzzleScene');
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#263238');

        this.add.text(width / 2, 50, 'Music Academy: Teaching Session', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'serif'
        }).setOrigin(0.5);

        this.add.text(width / 2, 100, 'Press SPACE when the notes reach the line!', {
            fontSize: '18px',
            fill: '#ccc'
        }).setOrigin(0.5);

        // Hit line
        this.add.rectangle(width / 2, height - 100, 600, 10, 0xffffff);

        this.notes = this.add.group();
        this.score = 0;
        this.totalNotes = 10;
        this.notesSpawned = 0;

        this.scoreText = this.add.text(50, 50, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.isFinished = false;

        this.spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnNote,
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown-SPACE', () => this.checkHit());
    }

    spawnNote() {
        if (this.notesSpawned >= this.totalNotes) {
            this.spawnTimer.remove();
            return;
        }

        const note = this.add.circle(this.scale.width / 2, 0, 20, 0x00ff00);
        this.physics.add.existing(note);
        note.body.setVelocityY(200);
        this.notes.add(note);
        this.notesSpawned++;
    }

    update() {
        if (this.isFinished) return;

        this.notes.getChildren().forEach(note => {
            if (note.y > this.scale.height) {
                note.destroy();
            }
        });

        if (this.notesSpawned >= this.totalNotes && this.notes.countActive() === 0) {
            this.finishPuzzle();
        }
    }

    checkHit() {
        if (this.isFinished) return;

        const hitLineY = this.scale.height - 100;
        const tolerance = 40;

        let closestNote = null;
        let minDistance = tolerance;

        this.notes.getChildren().forEach(note => {
            const dist = Math.abs(note.y - hitLineY);
            if (dist < minDistance) {
                minDistance = dist;
                closestNote = note;
            }
        });

        if (closestNote) {
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);
            closestNote.destroy();
        } else {
            // Miss logic or visual feedback
        }
    }

    finishPuzzle() {
        if (this.isFinished) return;
        this.isFinished = true;

        const masteryGain = Math.floor(this.score * 1.5);
        state.updateStat('lillian', 'musicalMastery', masteryGain);

        const finishText = this.add.text(this.scale.width / 2, this.scale.height / 2,
            `Session Complete!\nScore: ${this.score}\nMusical Mastery +${masteryGain}`,
            { fontSize: '32px', fill: '#0f0', align: 'center', backgroundColor: '#000', padding: 20 }
        ).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.scene.start('HomeScene');
        });
    }
}
