import { Canvas } from '@/Canvas';
import { Component } from '@/Component';
import { Sprite } from '@/Component/Sprite';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus, EventMap } from '@/EventBus';
import { Game } from '@/Game';
import { Constructor, Writable } from '@/types';
import { System } from '../System';

type RenderComponents = [Constructor<Transform>, Constructor<Sprite>];

/**
 * Singleton object responsible for rendering the following components:
 * - RenderComponent
 */
export class RenderEngine extends System<RenderComponents> {
    protected layers: [canvas: Canvas, clearOnUpdate: boolean][] = [];

    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Sprite,
        ]));
    }

    Awake() {
        const size = { x: 800, y: 600 };
        this.AddLayer(new Canvas('foreground', size), true);
        this.AddLayer(new Canvas('background', size), false);
    }


    Render() {
        this.layers.forEach(([canvas, clearOnUpdate]) => {
            if (clearOnUpdate) {
                canvas.ClearRect({ x: 0, y: 0 }, canvas.size);
            }
        });
        this.entities.forEach(entity => {
            const [transform, sprite] = this.game.GetEntityComponents(entity, ...this.signature.mask);
        });
    }

    Destroy() {

    }

    AddLayer(canvas: Canvas, clearOnUpdate: boolean) {
        canvas.SetStyle({ zIndex: this.layers.length.toString() });
        this.layers.push([canvas, clearOnUpdate]);
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
            const entry = this.layers.find(([canvas, _]) => canvas.id === handle);
            if (!entry) {
                throw new Error('id not found');
            }
            return entry[0];
        }
    }
}
