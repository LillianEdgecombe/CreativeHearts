import { state } from '../state.js';
import { timeManager } from '../systems/TimeManager.js';

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    preload() {}

    create() {
        this.add.text(400, 50, '37b Leconfield Road', { fontSize: '32px', fill: '#fff' });

        this.statusText = this.add.text(50, 150, '', { fontSize: '20px', fill: '#fff' });
        this.timeText = this.add.text(50, 350, '', { fontSize: '20px', fill: '#fff' });

        this.updateUI();

        const switchBtn = this.add.text(50, 500, 'Switch Character', { fontSize: '24px', fill: '#0f0', backgroundColor: '#222', padding: 10 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleSwitch());

        const advanceBtn = this.add.text(50, 560, 'Advance Time (2h)', { fontSize: '24px', fill: '#0f0', backgroundColor: '#222', padding: 10 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleAdvance());

        const saveBtn = this.add.text(50, 620, 'Save Game', { fontSize: '24px', fill: '#0f0', backgroundColor: '#222', padding: 10 })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleSave());
    }

    updateUI() {
        const activeChar = state.characters[state.activeCharacter];
        const stats = Object.entries(activeChar.stats)
            .map(([name, value]) => `${name}: ${value}`)
            .join('\n');

        this.statusText.setText(`Active: ${activeChar.name}\n${stats}`);
        this.timeText.setText(`Time: ${timeManager.getFormattedTime()}\nPhase: ${timeManager.getPhase()}\nSeason: ${timeManager.season}\nDay: ${timeManager.day}`);
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
                console.log('Game saved successfully');
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    }
}
