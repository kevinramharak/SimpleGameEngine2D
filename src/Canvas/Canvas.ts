import { IVector2D, Vector2D } from '@/Vector2D';
import { Color } from '@/Color';
import { Font } from '@/Font';

export class Canvas {
    readonly element: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;

    constructor(
        public readonly id: string,
        public readonly size: IVector2D
    ) {
        this.element = document.createElement('canvas');
        this.element.id = this.id;
        this.context = this.element.getContext('2d')!;

        const width = `${this.size.x}px`;
        const height = `${this.size.y}px`;

        this.SetStyle({
            width,
            height,
        });

        if (!this.context || !(this.context instanceof CanvasRenderingContext2D)) {
            throw new Error('failed creating a context');
        }

        const factor = 2;
        const scale = new Vector2D(factor, factor);

        // using this trick improves the rendering of text by a lot
        // see: https://stackoverflow.com/a/63804551
        // backing store buffer dimensions
        this.element.width = this.size.x * scale.x;
        this.element.height = this.size.y * scale.y;
        this.context.scale(scale.x, scale.y);

        document.body.appendChild(this.element);
    }

    public FillRect(position: IVector2D, size: IVector2D, color: Color) {
        this.context.beginPath();
        this.context.fillStyle = color.toString();
        this.context.rect(position.x, position.y, size.x, size.y);
        this.context.fill();
    }

    public StrokeRect(position: IVector2D, size: IVector2D, color: Color) {
        this.context.beginPath();
        this.context.strokeStyle = color.toString();
        this.context.rect(position.x, position.y, size.x, size.y);
        this.context.stroke();
    }

    public FillCircle(center: IVector2D, radius: number, color: Color) {
        this.context.beginPath();
        this.context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this.context.fillStyle = color.toString();
        this.context.fill();
    }

    public ClearRect(position: IVector2D, size: IVector2D) {
        this.context.clearRect(position.x, position.y, size.x, size.y);
    }

    public FillText(position: IVector2D, text: string, font: Font, color: Color, maxWidth?: number) {
        this.context.font = font.toString();
        this.context.fillStyle = color.toString();

        this.context.fillText(
            text,
            position.x,
            position.y,
            maxWidth
        );
    }

    public TextMeasurement(text: string, font: Font) {
        this.context.font = font.toString();
        return this.context.measureText(text);
    }

    public SetStyle(style: Partial<CSSStyleDeclaration>) {
        for (const key in style) {
            const value = style[key];
            if (value != null) {
                this.element.style[key] = style[key]!;
            }
        }
    }
}
