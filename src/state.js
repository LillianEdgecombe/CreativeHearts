export class GameState {
    constructor() {
        this.characters = {
            lillian: {
                name: 'Lillian',
                stats: {
                    musicalMastery: 50,
                    bodyConfidence: 50,
                    socialEnergy: 100,
                    creativeFlow: 0
                }
            },
            miles: {
                name: 'Miles',
                stats: {
                    engineeringLogic: 50,
                    businessAcumen: 50,
                    rhythmicPrecision: 50,
                    supportivePresence: 100
                }
            }
        };
        this.relationships = {
            miles: 80,
            lillian: 80,
            sarah: 70
        };
        this.activeCharacter = 'lillian';
    }

    updateStat(character, stat, value) {
        if (this.characters[character] && this.characters[character].stats[stat] !== undefined) {
            this.characters[character].stats[stat] = Math.max(0, Math.min(100, this.characters[character].stats[stat] + value));
        }
    }

    switchCharacter(name) {
        if (this.characters[name]) {
            this.activeCharacter = name;
        }
    }

    toJSON() {
        return {
            characters: this.characters,
            relationships: this.relationships,
            activeCharacter: this.activeCharacter
        };
    }

    fromJSON(data) {
        if (data.characters) this.characters = data.characters;
        if (data.relationships) this.relationships = data.relationships;
        if (data.activeCharacter) this.activeCharacter = data.activeCharacter;
    }
}

export const state = new GameState();
