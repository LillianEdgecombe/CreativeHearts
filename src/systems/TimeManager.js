export class TimeManager {
    constructor() {
        this.hour = 7;
        this.day = 1;
        this.season = 'Spring';
        this.seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
        this.daysPerSeason = 30;
    }

    advanceTime(hours) {
        this.hour += hours;
        while (this.hour >= 24) {
            this.hour -= 24;
            this.advanceDay();
        }
    }

    advanceDay() {
        this.day++;
        if (this.day > this.daysPerSeason) {
            this.day = 1;
            this.advanceSeason();
        }
    }

    advanceSeason() {
        const currentIndex = this.seasons.indexOf(this.season);
        this.season = this.seasons[(currentIndex + 1) % this.seasons.length];
    }

    getPhase() {
        if (this.hour >= 7 && this.hour < 9) return 'Morning';
        if (this.hour >= 9 && this.hour < 17) return 'Work';
        if (this.hour >= 17 && this.hour < 22) return 'Evening';
        return 'Night';
    }

    getFormattedTime() {
        return `${this.hour.toString().padStart(2, '0')}:00`;
    }

    toJSON() {
        return {
            hour: this.hour,
            day: this.day,
            season: this.season
        };
    }

    fromJSON(data) {
        if (data.hour !== undefined) this.hour = data.hour;
        if (data.day !== undefined) this.day = data.day;
        if (data.season !== undefined) this.season = data.season;
    }
}

export const timeManager = new TimeManager();
