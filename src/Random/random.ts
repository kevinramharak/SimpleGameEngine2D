
export function random(max: number): number;
export function random(min: number, max: number): number;
export function random(min: number, max?: number) {
    if (typeof max !== 'number') {
        max = min;
        min = 0;
    }
    return Math.round(Math.random() * (max - min)) + min;
}
