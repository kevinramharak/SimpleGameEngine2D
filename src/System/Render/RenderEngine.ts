import { Canvas } from '@/Canvas';
import { Color } from '@/Color';
import { Render } from '@/Component/Render';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';
import { Logger } from '@/Logger';
import { Delta } from '@/Time';
import { System } from '../System';

export class RenderEngine extends System<[Transform, Render]> {
    protected layers: [canvas: Canvas, clearOnUpdate: boolean][] = [];
    protected map: Record<string, Canvas> = {};

    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Render,
        ] as [typeof Transform, typeof Render]));
        // NOTE: ugh, cant get rid of this cast. It sees it as (Transform | Sprite)[] and with const it sees it as readonly [typeof Transform, typeof Sprite]
    }

    Awake() {
        const size = { x: 400, y: 400 };
        this.AddLayer(new Canvas('background', size), false);
        this.AddLayer(new Canvas('foreground', size), true);
        const bg = this.GetLayer('background'); 
        bg.FillRect({ x: 0, y: 0 }, bg.size, Color.Map.white);
    }

    Render(delta: Delta) {
        this.layers.forEach(([canvas, clearOnUpdate]) => {
            if (clearOnUpdate) {
                canvas.ClearRect({ x: 0, y: 0 }, canvas.size);
            }
        });
        this.entities.forEach(entity => {
            const [transform, sprite] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            const layer = this.GetLayer(sprite.layer);
            sprite.Render(delta, layer, transform);
        });
    }

    Destroy() {

    }

    AddLayer(canvas: Canvas, clearOnUpdate: boolean) {
        canvas.SetStyle({ zIndex: this.layers.length.toString() });
        this.layers.push([canvas, clearOnUpdate]);
        if (!canvas.element.id) {
            Logger.Error(new Error('Canvas layer has no id'));
        }
        this.map[canvas.element.id] = canvas;
    }

    GetLayer(id: string): Canvas;
    GetLayer(z: number): Canvas;
    GetLayer(handle: string | number): Canvas {
        if (typeof handle === 'number') {
            if (handle >= this.layers.length) {
                throw new RangeError('index out of bounds');
            }
            return this.layers[handle][0];
        } else {
            const entry = this.map[handle];
            if (!entry) {
                throw new Error('id not found');
            }
            return entry;
        }
    }
}
