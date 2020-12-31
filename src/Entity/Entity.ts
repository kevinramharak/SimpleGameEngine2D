import { Component, ComponentManager } from '@/Component';
import { Game } from '@/Game';
import { Brand } from '@/types/Brand';
import { EntityMask } from './EntityMask';

export type EntityId = Brand<number, 'EntityId'>;

export class Entity {
    private static id = 0 as EntityId;

    mask: EntityMask = new EntityMask();
    id: EntityId;

    constructor(
        public readonly game: Game,
    ) {
        this.id = Entity.id++ as EntityId;
    }

    AddComponent<C extends Component>(component: C) {
        this.game.AddComponent(this, component);
    }

    RemoveComponent<C extends Component>(component: C) {
        return this.game.RemoveComponent(this, component);
    }
}
