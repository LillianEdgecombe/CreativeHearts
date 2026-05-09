import { state } from '../state.js';
import { timeManager } from '../systems/TimeManager.js';

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    preload() {
        this.load.image('portrait_lillian', '/assets/lillian.png');
        this.load.image('portrait_miles', '/assets/miles.png');
        this.load.image('portrait_sarah', '/assets/sarah.png');
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#3e2723');

        this.add.text(width / 2, 60, '37b Leconfield Road', {
            fontSize: '48px',
            fill: '#d7ccc8',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        this.portraitFrame = this.add.rectangle(750, 350, 320, 420, 0x5d4037).setStrokeStyle(4, 0xd7ccc8);
        this.portrait = this.add.image(750, 350, 'portrait_lillian').setDisplaySize(300, 400);

        this.nameLabel = this.add.text(750, 580, 'Lillian', {
            fontSize: '32px',
            fill: '#d7ccc8',
            fontFamily: 'Georgia, serif'
        }).setOrigin(0.5);

        this.statsPanel = this.add.graphics();
        this.statsPanel.fillStyle(0x4e342e, 0.8);
        this.statsPanel.fillRoundedRect(80, 150, 400, 250, 15);
        this.statsPanel.lineStyle(2, 0xd7ccc8);
        this.statsPanel.strokeRoundedRect(80, 150, 400, 250, 15);

        this.statusText = this.add.text(110, 180, '', {
            fontSize: '22px',
            fill: '#efebe9',
            fontFamily: 'Verdana',
            lineSpacing: 10
        });

        this.timePanel = this.add.graphics();
        this.timePanel.fillStyle(0x4e342e, 0.8);
        this.timePanel.fillRoundedRect(80, 430, 400, 150, 15);
        this.timePanel.lineStyle(2, 0xd7ccc8);
        this.timePanel.strokeRoundedRect(80, 430, 400, 150, 15);

        this.timeText = this.add.text(110, 450, '', {
            fontSize: '22px',
            fill: '#efebe9',
            fontFamily: 'Verdana',
            lineSpacing: 10
        });

        this.updateUI();

        this.createButton(180, 680, 'Switch Character', () => this.handleSwitch());
        this.createButton(512, 680, 'Advance Time', () => this.handleAdvance());
        this.createButton(844, 680, 'Save Game', () => this.handleSave());

        // Puzzle Button
        this.workBtn = this.createButton(width / 2, height / 2 + 50, 'Go to Work', () => this.handleWork());
        this.checkWorkAvailability();
    }

    createButton(x, y, label, callback) {
        const btn = this.add.text(x, y, label, {
            fontSize: '22px',
            fill: '#3e2723',
            backgroundColor: '#d7ccc8',
            padding: { x: 20, y: 10 },
            fontFamily: 'Verdana'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', callback)
        .on('pointerover', () => btn.setBackgroundColor('#bcaaa4'))
        .on('pointerout', () => btn.setBackgroundColor('#d7ccc8'));

        return btn;
    }

    updateUI() {
        const activeChar = state.characters[state.activeCharacter];
        const stats = Object.entries(activeChar.stats)
            .map(([name, value]) => {
                const label = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `${label}: ${value}`;
            })
            .join('\n');

        this.statusText.setText(`Active: ${activeChar.name}\n\n${stats}`);
        this.timeText.setText(`${timeManager.season}, Day ${timeManager.day}\nTime: ${timeManager.getFormattedTime()} (${timeManager.getPhase()})`);

        this.portrait.setTexture(`portrait_${state.activeCharacter}`);
        this.nameLabel.setText(activeChar.name);
        this.checkWorkAvailability();
    }

    checkWorkAvailability() {
        if (this.workBtn) {
            const isWorkPhase = timeManager.getPhase() === 'Work';
            this.workBtn.setVisible(isWorkPhase);
        }
    }

    handleSwitch() {
        const next = state.activeCharacter === 'lillian' ? 'miles' : 'lillian';
        state.switchCharacter(next);
        this.updateUI();
    }

    handleAdvance() {
        timeManager.advanceTime(2);
        this.updateUI();
    }

    handleWork() {
        if (state.activeCharacter === 'lillian') {
            this.scene.start('MusicPuzzleScene');
        } else {
            this.showToast('Miles workshop is under construction!');
        }
    }

    async handleSave() {
        const data = {
            state: state.toJSON(),
            time: timeManager.toJSON()
        };
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showToast('Game saved successfully');
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    }

    showToast(message) {
        const toast = this.add.text(512, 620, message, {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => toast.destroy());
    }
}
