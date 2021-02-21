import { Canvas } from '@/Canvas';
import { Color } from '@/Color';
import { Render } from '@/Component/Render';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Font } from '@/Font';
import { Game } from '@/Game';
import { Logger } from '@/Logger';
import { Delta } from '@/Time';
import { System } from '../System';

export class RenderEngine extends System<[Transform, Render]> {
    protected layers: Canvas[] = [];
    protected map: Record<string, Canvas> = {};

    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Render,
        ]));
    }

    Awake() {
        this.AddLayer(new Canvas('background'));
        this.AddLayer(new Canvas('foreground'));
    }

    Render(delta: Delta) {
        this.layers.forEach((canvas) => {
            canvas.ClearRect({ x: 0, y: 0 }, canvas.size);
        });
        // TODO: remove this
        const bg = this.GetLayer('background');
        bg.FillRect({ x: 0, y: 0 }, bg.size, Color.Map.white);
        this.entities.forEach(entity => {
            const [transform, renderable] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            const layer = this.GetLayer(renderable.layer);
            renderable.Render(delta, layer, transform.position, transform.size);
        });
    }

    Destroy() {

    }

    AddLayer(canvas: Canvas) {
        canvas.SetStyle({ zIndex: this.layers.length.toString() });
        this.layers.push(canvas);
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
            return this.layers[handle];
        } else {
            const entry = this.map[handle];
            if (!entry) {
                throw new Error('id not found');
            }
            return entry;
        }
    }
}
