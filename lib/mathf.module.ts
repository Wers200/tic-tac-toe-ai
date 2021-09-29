export default class Mathf {
    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static randomBool(): boolean {
        return Math.random() > 0.5 ? true : false;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }

    static lerp(start: number, end: number, time: number): number {
        return start + (end - start) * time;
    }
}
