import { Component, ComponentManager, components, HasComponentManagers } from '@/Component';
import { Entity, EntityManager } from '@/Entity';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { IAwake, IDestroy } from '@/Lifecycle';
import { System, systems } from '@/System';
import { Delta, frame, now, Timestamp } from '@/Time';
import { Constructor } from '@/types';

/**
 * Singleton object responsible for housing the different components:
 * - [-] Render Engine
 * - [ ] Physics Engine
 * - [ ] Audio Engine
 * - [x] Event Bus
 * - [x] ECS
 */
export class Game implements HasComponentManagers ,IAwake, IDestroy {
    private timestamp: Timestamp = 0 as Timestamp;
    public managers: ComponentManager<Component>[] = [];
    public systems: System[] = [];
    public eventbus: EventBus;
    public entities: EntityManager;

    constructor() {
        this.eventbus =  new EventBus();
        this.entities = new EntityManager();
    }

    AddComponentManager<C extends Component>(type: Constructor<C>) {
        this.managers.push(new ComponentManager(type));
    }

    GetComponentManager<C extends Component | Constructor<Component>>(component: C) {
        const check = typeof component === 'function' ? (type: Constructor<Component>) => component === type : (type: Constructor<Component>) => component instanceof type;
        const manager = this.managers.find((manager) => check(manager.type));
        if (!manager) {
            throw new Error('no manager found for that component');
        }
        return manager as C extends Constructor ? ComponentManager<InstanceType<C>> : ComponentManager<C>;
    }

    AddComponent<E extends Entity, C extends Component>(entity: E, component: C) {
        const manager = this.GetComponentManager(component)
        manager.Add(entity, component);

        const old = entity.mask.Copy();
        entity.mask.Add(manager.type);
        this.systems.forEach(system => {
            if (system.signature.Matches(entity.mask) && !system.signature.Matches(old)) {
                system.RegisterEntity(entity);
            }
        });
    }

    RemoveComponent<E extends Entity, C extends Component>(entity: E, component: C) {
        const manager = this.GetComponentManager(component)
        manager.Remove(entity);
        
        const old = entity.mask.Copy();
        entity.mask.Remove(manager.type);
        this.systems.forEach(system => {
            if (system.signature.Matches(old) && !system.signature.Matches(entity.mask)) {
                system.DeregisterEntity(entity);
            }
        });
    }

    AddSystem<S extends System>(system: Constructor<S>) {
        // TODO: this part doesnt typecheck correctly so we add a length check to have at least the correct amount of arguments
        const args = [this, this.eventbus];
        if (args.length !== system.length) {
            throw new Error('system is not being supplied with the correct amount of arguments');
        }
        this.systems.push(new system(...args));
    }

    CreateEntity() {
        return this.entities.CreateEntity(this);
    }

    DestroyEntity<E extends Entity>(entity: E) {
        return this.entities.DestroyEntity(entity);
    }

    GetEntityComponents<E extends Entity, C extends Constructor<Component>[]>(entity: E, ...components: C) {
        return components.map(component => this.GetComponentManager(component).Get(entity));
    }

    Awake() {
        components.forEach(component => {
            // NOTE: have to typecast because of the different amount/types of arguments
            this.AddComponentManager(component as Constructor<Component>);
        });

        systems.forEach(system => {
            this.AddSystem(system);
        });

        this.systems.forEach(system => system.Awake());
        
        this.timestamp = now();
        frame(timestamp => this.Loop(timestamp));
    }

    Loop(timestamp: Timestamp) {
        // TODO: update on a steady interval
        const delta = (timestamp - this.timestamp) as Delta;
        this.systems.forEach(system => system.Update(delta));

        // TODO: render on a steady (slower) interval
        // if update is taking to much time throttle the render call
        this.systems.forEach(system => system.Render());

        this.timestamp = timestamp;
        frame(timestamp => this.Loop(timestamp));
    }

    Destroy() {
        // systems.Destroy
    }
}
