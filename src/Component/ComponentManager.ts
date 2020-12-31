import { Component } from './Component';
import { Entity } from '@/Entity';
import { Constructor, Maybe } from '@/types';

export class ComponentManager<C extends Component> {
    protected map: Map<Entity, C> = new Map();

    constructor(
        readonly type: Constructor<Component>
    ) {}

    Remove<E extends Entity>(entity: E): Maybe<C> {
        const component = this.map.get(entity);
        if (component) {
            this.map.delete(entity);
        } else {
            console.warn('tried to remove an component from an entity that had no component of that type')
        }
        return component;
    }
    
    Add<E extends Entity>(entity: E, component: C) {
        this.map.set(entity, component);
    }
    
    Get<E extends Entity>(entity: E): C {
        const component =  this.map.get(entity);
        if (!component) {
            throw new Error('Entity is not bound to a component of this type');
        }
        return component;
    }

    ForEach(callback: (component: C) => void) {
        for (const component of this.map.values()) {
            callback(component);
        }
    }
}
