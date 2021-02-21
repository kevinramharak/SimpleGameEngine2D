import { IVector2D, Vector2D } from '@/Vector2D';
import { Color } from '@/Color';
import { Font } from '@/Font';
import { Settings } from '@/Settings';

export class Canvas {
    readonly element: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    // TODO: make these constructor parameters
    readonly size = Settings.Canvas.size;
    readonly scale = Settings.Canvas.scale;

    constructor(
        public readonly id: string,
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

        // using this trick improves the rendering of text by a lot
        // see: https://stackoverflow.com/a/63804551
        // backing store buffer dimensions
        this.element.width = this.size.x * this.scale.x;
        this.element.height = this.size.y * this.scale.y;
        this.context.scale(Settings.Canvas.scale.x, Settings.Canvas.scale.y);

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

    public DrawImage(bitmap: ImageBitmap, source_position: IVector2D, source_size: IVector2D, destination_position: IVector2D, destination_size: IVector2D) {
        this.context.drawImage(
            bitmap,
            source_position.x, source_position.y,
            source_size.x, source_size.y,
            destination_position.x, destination_position.y,
            destination_size.x, destination_size.y,
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
