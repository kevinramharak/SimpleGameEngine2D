import { Component, ComponentManager } from '@/Component';
import { Game } from '@/Game';
import { Constructor, MapToConstructor, Tuple } from '@/types';
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
    
    AddComponents<C extends Tuple<Component>>(...components: C) {
        components.forEach(component => this.AddComponent(component));
    }

    GetComponent<C extends Component>(component: Constructor<C>) {
        return this.game.GetEntityComponents(this, component)[0];
    }

    GetComponents<C extends Tuple<Component>>(...components: MapToConstructor<C>) {
        return this.game.GetEntityComponents(this, ...components);
    }

    RemoveComponent<C extends Component>(component: C) {
        return this.game.RemoveComponent(this, component);
    }
    
    RemoveComponents<C extends Tuple<Component>>(...components: C) {
        components.forEach(component => this.RemoveComponent(component));
    }
}
