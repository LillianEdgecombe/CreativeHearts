import { state } from '../src/state.js';
import { timeManager } from '../src/systems/TimeManager.js';

describe('GameState', () => {
    test('should have initial stats for Lillian and Miles', () => {
        expect(state.characters.lillian.stats.musicalMastery).toBe(50);
        expect(state.characters.miles.stats.engineeringLogic).toBe(50);
    });

    test('should update stats correctly within bounds', () => {
        state.updateStat('lillian', 'musicalMastery', 10);
        expect(state.characters.lillian.stats.musicalMastery).toBe(60);

        state.updateStat('lillian', 'musicalMastery', 50);
        expect(state.characters.lillian.stats.musicalMastery).toBe(100);

        state.updateStat('lillian', 'musicalMastery', -110);
        expect(state.characters.lillian.stats.musicalMastery).toBe(0);
    });

    test('should switch active character', () => {
        state.switchCharacter('miles');
        expect(state.activeCharacter).toBe('miles');
        state.switchCharacter('lillian');
        expect(state.activeCharacter).toBe('lillian');
    });
});

describe('TimeManager', () => {
    beforeEach(() => {
        timeManager.hour = 7;
        timeManager.day = 1;
        timeManager.season = 'Spring';
    });

    test('should advance time and days', () => {
        timeManager.advanceTime(2);
        expect(timeManager.hour).toBe(9);

        timeManager.advanceTime(20);
        expect(timeManager.hour).toBe(5);
        expect(timeManager.day).toBe(2);
    });

    test('should return correct daily phases', () => {
        expect(timeManager.getPhase()).toBe('Morning'); // 7am
        timeManager.advanceTime(3);
        expect(timeManager.getPhase()).toBe('Work'); // 10am
        timeManager.advanceTime(8);
        expect(timeManager.getPhase()).toBe('Evening'); // 6pm
        timeManager.advanceTime(5);
        expect(timeManager.getPhase()).toBe('Night'); // 11pm
    });

    test('should advance seasons correctly', () => {
        timeManager.day = 30;
        timeManager.advanceTime(24);
        expect(timeManager.day).toBe(1);
        expect(timeManager.season).toBe('Summer');
    });
});
