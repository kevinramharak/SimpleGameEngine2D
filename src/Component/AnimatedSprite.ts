import { Logger } from '@/Logger';
import { Delta } from '@/Time';
import { Render } from './Render';
import { SpriteSheet, ISpriteSheetState } from "@/Sprite";
import { Canvas } from '@/Canvas';
import { IVector2D, Vector2D } from '@/Vector2D';


export class AnimatedSprite extends Render {
    current?: ISpriteSheetState;
    delta: Delta = 0 as Delta;

    constructor(
        public layer: 'background' | 'foreground',
        public sheet: SpriteSheet,
    ) {
        super(layer);
    }

    SetState(name: string) {
        if (name in this.sheet.data.states) {
            this.current = this.sheet.data.states[name];
        } else {
            Logger.Error(new Error(`no state with name ${name} found`));
        }
    }

    Render(delta: Delta, layer: Canvas, position: IVector2D) {
        if (this.current) {
            this.delta = ((this.delta + delta) % this.current.duration) as Delta;
            const index = Math.floor(this.current.frames.length * (this.delta / this.current.duration));
            const frame = this.current.frames[index];
            const size = Vector2D.from(this.sheet.data.width, this.sheet.data.height);
            const sprite_position = Vector2D.from(size.x * frame.x, size.y * frame.y);
            layer.DrawImage(
                this.sheet.bitmap,
                sprite_position, size,
                position, size,
            );
        }
    }
}
