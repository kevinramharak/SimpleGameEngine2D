import { Component } from '@/Component';
import { Entity } from '@/Entity';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus, EventMap } from '@/EventBus';
import { Game } from '@/Game';
import { IAwake, IDestroy, IRender, IUpdate } from '@/Lifecycle';
import { Delta } from '@/Time';
import { Constructor } from '@/types';

export abstract class System<C extends Constructor<Component>[] = Constructor<Component>[]> implements IAwake, IUpdate, IDestroy, IRender {
    protected entities: Entity[] = [];
    
    constructor(
        public readonly game: Game,
        public readonly eventbus: EventBus,
        public readonly signature: EntityMask<C>,
    ) {}

    abstract Awake(): void;
    abstract Destroy(): void;
    Update(delta: Delta): void {}
    Render(): void {}

    RegisterEntity<E extends Entity>(entity: E) {
        this.entities.push(entity);
    }

    DeregisterEntity<E extends Entity>(entity: E) {
        const index = this.entities.indexOf(entity);
        if (index != -1) {
            this.entities.splice(index, 1);
        }
    }
}
