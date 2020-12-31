import { random } from '@/Random';
import { Nullable } from '@/types';
import { map, ColorMap, ColorName } from './map';

export class Color {
    public readonly R: number
    public readonly G: number
    public readonly B: number
    public readonly A: number

    public static IsValidChannel(v: number, isAlpha = false) {
        const max = isAlpha ? 1 : 255;
        if (v < 0 || v > max) {
            return false;
        }

        if (!isAlpha && v % 1 !== 0) {
            return false;
        }

        return true;
    }

    constructor(r: number, g: number, b: number, a: number = 1) {
        if (!Color.IsValidChannel(r)) {
            throw new Error('Provided incorrect value for Red channel');
        }

        if (!Color.IsValidChannel(g)) {
            throw new Error('Provided incorrect value for Green channel');
        }

        if (!Color.IsValidChannel(b)) {
            throw new Error('Provided incorrect value for Blue channel');
        }

        if (!Color.IsValidChannel(a, true)) {
            throw new Error('Provided incorrect value for Alpha channel');
        }

        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }

    public toString() {
        return `rgba(${this.R}, ${this.G}, ${this.B}, ${this.A})`;
    }
    
    private static rgba = /rgba\((25[0-5]|2[0-4][0-9]|[01]\d{0,2}) *, *(25[0-5]|2[0-4][0-9]|[01]\d{0,2}) *, *(25[0-5]|2[0-4][0-9]|[01]\d{0,2}) *, *(0|1|0?.\d+)\)/;
    private static rgb = /rgb\((25[0-5]|2[0-4][0-9]|[01]\d{0,2}) *, *(25[0-5]|2[0-4][0-9]|[01]\d{0,2}) *, *(25[0-5]|2[0-4][0-9]|[01]\d{0,2})\)/;
    private static hex3 = /^#(?:([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9]))$/;
    private static hex6 = /^#(?:([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2}))$/;

    public static From(input: string) {
        if (Color.Map && input in Color.Map) {
            return Color.Map[input as ColorName];
        }

        let matches: Nullable<RegExpExecArray>;
        let r: number, g: number, b: number, a: number;
        if (matches = Color.rgba.exec(input)) {
            [,r, g, b, a] = matches.map(Number);
        } else if (matches = Color.rgb.exec(input)) {
            [,r, g, b, a = 1] = matches.map(Number);
        } else if (matches = Color.hex3.exec(input)) {
            [,r, g, b, a = 1] = matches.map(match => Number.parseInt(`${match}${match}`, 16));
        } else if (matches = Color.hex6.exec(input)) {
            [,r, g, b, a = 1] = matches.map(match => Number.parseInt(match, 16));
        } else {
            throw new Error('Could not parse input as a valid color');
        }

        return new Color(r, g, b, a);
    }

    static Map: ColorMap = Object.entries(map).reduce((map, [name, value]) => {
        map[name as ColorName] = Color.From(value);
        return map;
    }, {} as ColorMap);

    static Random() {
        return new Color(
            random(255),
            random(255),
            random(255),
            1,
        );
    }
}
