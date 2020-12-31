
export type FontStyle = 'italic' | 'normal';
export type FontFamily = string;
export type FontWeight = 400 | 'normal';

type FontProperties = {
    family: FontFamily;
    size: number;
    lineHeight: number;
    style: FontStyle;
    weight: FontWeight;
}

/**
 * Abstraction of the [`font` property](https://developer.mozilla.org/en-US/docs/Web/CSS/font)
 */
export class Font implements FontProperties {
    public family: FontFamily;
    public size: number;
    public lineHeight: number;
    public style: FontStyle;
    public weight: FontWeight;


    constructor({
        family = 'consolas',
        size = 16,
        lineHeight = 1, // doesnt seem to do anything?
        weight = 400 as const,
        style = 'normal' as const,
    }: Partial<FontProperties> = {}) {
        this.family = family;
        this.size = size;
        this.lineHeight = lineHeight;
        this.weight = weight;
        this.style = style;
    }

    toString() {
        return `${this.style} ${this.weight} ${this.size}pt / ${this.lineHeight} ${this.family}`;
    }

    /**
     * @todo implement this
     */
    static FromString(value: string) {
        return new Font();
    }

    // TODO: font map?
}
