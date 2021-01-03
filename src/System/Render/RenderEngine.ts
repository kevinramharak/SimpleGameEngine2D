import { Canvas } from '@/Canvas';
import { Color } from '@/Color';
import { AnimatedSprite } from '@/Component/AnimatedSprite';
import { Motion } from '@/Component/Motion';
import { Render } from '@/Component/Render';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Font } from '@/Font';
import { Game } from '@/Game';
import { Logger } from '@/Logger';
import { Settings } from '@/Settings';
import { Delta } from '@/Time';
import { Vector2D } from '@/Vector2D';
import { System } from '../System';

export class RenderEngine extends System<[Transform, Render]> {
    protected layers: [canvas: Canvas, clearOnUpdate: boolean][] = [];
    protected map: Record<string, Canvas> = {};

    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Render,
        ]));
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
            const [transform, renderable] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            const layer = this.GetLayer(renderable.layer);

            if (Settings.debug) {
                const sprite = this.game.GetComponentManager(AnimatedSprite).Get(entity);
                const motion = this.game.GetComponentManager(Motion).Get(entity);
                if (motion.velocity.x !== 0 || motion.velocity.y !== 0) {
                    sprite.SetState('run');
                } else {
                    sprite.SetState('idle');
                }
                layer.FillText({ x: 0, y: 20 }, `velocity:     ${motion.velocity.x}, ${motion.velocity.y}`, new Font(), Color.Map.black);
                layer.FillText({ x: 0, y: 45 }, `acceleration: ${motion.acceleration.x}, ${motion.acceleration.y}`, new Font(), Color.Map.black);
                layer.FillText({ x: 0, y: 70 }, `position:     ${transform.position.x}, ${transform.position.y}`, new Font(), Color.Map.black);
                layer.FillText({ x: 0, y: 100 }, `size:     ${transform.size.x}, ${transform.size.y}`, new Font(), Color.Map.black);
                if (transform.position.x > layer.size.x) {
                    transform.position = Vector2D.from(0, transform.position.y);
                } else if (transform.position.x < 0) {
                    transform.position = Vector2D.from(layer.size.x, transform.position.y);
                }
                if (transform.position.y > layer.size.y) {
                    transform.position = Vector2D.from(transform.position.x, 0);
                } else if (transform.position.y < 0) {
                    transform.position = Vector2D.from(transform.position.x, layer.size.y);
                }
                renderable.Render(delta, layer, transform.position, transform.size);
            }

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
