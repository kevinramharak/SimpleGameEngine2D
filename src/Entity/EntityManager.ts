import { Event, EventBus, EventMap } from '@/EventBus';
import { Game } from '@/Game';
import { Logger } from '@/Logger';
import { Entity, EntityId } from './Entity';

export class EntityManager {
    protected entities: Entity[] = [];

    constructor() {}

    CreateEntity(game: Game){
        const entity = new Entity(game);
        this.AddEntity(entity);
        return entity;
    }

    DestroyEntity(entity: Entity) {
        // ?
    }

    AddEntity(entity: Entity) {
        this.entities.push(entity);
    }

    GetEntity(id: EntityId): Entity {
        const entity = this.entities.find(entity => entity.id === id);
        if (!entity) {
            throw new Error('no entity found for that id')
        }
        return entity;
    }

    RemoveEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index != -1) {
            this.entities.splice(index, 1);
        } else {
            Logger.Error(new Error('tried to remove an entity that was not registered'));
        }
    }
}
