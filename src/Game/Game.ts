import { Component, ComponentManager, components, HasComponentManagers } from '@/Component';
import { Entity, EntityManager } from '@/Entity';
import { EventBus } from '@/EventBus';
import { IAwake, IDestroy, IRender, IUpdate } from '@/Lifecycle';
import { Logger } from '@/Logger';
import { Settings } from '@/Settings';
import { System, systems } from '@/System';
import { benchmark, Delta, frame, now, Timestamp } from '@/Time';
import { Constructor, MapToInstanceType, Tuple } from '@/types';
import { asInt } from '@/util';

const FPS60 = asInt(1000 / 60);

/**
 * Singleton object responsible for housing the different components:
 * - [x] Render Engine
 * - [ ] Physics Engine
 * - [ ] Audio Engine
 * - [x] Event Bus
 * - [x] ECS
 */
export class Game implements HasComponentManagers ,IAwake, IDestroy {
    /**
     * represents the last time the Loop was executed
     */
    private timestamp: Timestamp = 0 as Timestamp;
    /**
     * represents the last time systems with a Render function were executed
     */
    private render: Delta = 0 as Delta;

    managers: Tuple<ComponentManager<Component>[]> = [];
    systems: System[] = [];
    eventbus: EventBus;
    entities: EntityManager;

    constructor() {
        this.eventbus =  new EventBus();
        this.entities = new EntityManager();
    }

    AddComponentManager<C extends Component>(type: Constructor<C>) {
        this.managers.push(new ComponentManager(type));
    }

    GetComponentManager<C extends Component | Constructor<Component>>(component: C) {
        const isConstructor = typeof component === 'function';
        const check = isConstructor ?
            (type: Constructor<Component>) => component === type || type.isPrototypeOf(component) :
            (type: Constructor<Component>) => component instanceof type || type.isPrototypeOf(component.constructor);
        const manager = this.managers.find((manager) => check(manager.type));
        if (!manager) {
            const name = isConstructor ? (component as Constructor).name : component.constructor.name;
            throw new Error(`no manager found for component: ${name}`);
        }
        return manager as C extends Constructor ? ComponentManager<InstanceType<C>> : C extends Component ? ComponentManager<C> : never;
    }

    AddComponent<E extends Entity, C extends Component>(entity: E, component: C) {
        const manager = this.GetComponentManager(component)
        manager.Add(entity, component);

        const old = entity.mask.Copy();
        // NOTE: can't do this without a cast: https://github.com/microsoft/TypeScript/issues/3841
        entity.mask.Add((component as any).constructor);

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
        // NOTE: can't do this without a cast: https://github.com/microsoft/TypeScript/issues/3841
        entity.mask.Remove((component as any).constructor);

        this.systems.forEach(system => {
            if (system.signature.Matches(old) && !system.signature.Matches(entity.mask)) {
                system.DeregisterEntity(entity);
            }
        });
    }

    AddSystem(system: Constructor<System>) {
        this.systems.push(new system(this, this.eventbus));
    }

    CreateEntity() {
        return this.entities.CreateEntity(this);
    }

    DestroyEntity<E extends Entity>(entity: E) {
        return this.entities.DestroyEntity(entity);
    }

    GetEntityComponents<E extends Entity, C extends Tuple<Constructor<Component>[]>>(entity: E, ...components: C) {
        return components.map(component => this.GetComponentManager(component).Get(entity)) as C extends Tuple ? MapToInstanceType<C> : Component[];
    }

    Awake() {
        // TODO: unbind this on destroy
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.timestamp = now();
            }
        });

        components.forEach((component: Constructor<Component>) => {
            this.AddComponentManager(component);
        });

        systems.forEach(system => {
            this.AddSystem(system);
        });

        this.systems.forEach(system => system.Awake());
        
        this.timestamp = now();
        frame(timestamp => this.Loop(timestamp));
    }

    /**
     * Still adjusting this based on:
     * - https://gafferongames.com/post/fix_your_timestep/
     * - http://gameprogrammingpatterns.com/game-loop.html
     */
    Loop(timestamp: Timestamp) {
        // time between last RAF call and current time
        let delta = (timestamp - this.timestamp) as Delta;
        // how much ms this Loop iteration has left
        let remaining = FPS60;

        // if delta is bigger than some threshold, the Loop is taking to much time to execute
        if (delta > FPS60 * 2) {
            Logger.Warn(`Encountered Loop delta of ${delta}, limiting it to ${FPS60}`);
            delta = FPS60 as Delta; // constrain the update delta to 60 fps
        }

        // benchmark how much time the update call takes
        const update = benchmark(() => {
            this.systems.forEach(system => system.Update(delta));
        });

        if (update > remaining) {
            // update took more time than we had available
        }
        remaining -= update;

        if (remaining < this.render) {
            // last render benchmark is bigger than the time we have remaining
            // could try and throttle pre-emtivly
        }

        // benchmark how much time the render call takes
        const render = this.render = benchmark(() => {
            this.systems.forEach(system => system.Render(delta));
        });

        if (render > remaining) {
            // render took more time than we had available
        }
        remaining -= render;

        // update the timestamp and request a new frame for the next Loop iteration
        this.timestamp = now();
        frame(timestamp => this.Loop(timestamp));
    }

    Destroy() {
        // systems.Destroy
    }
}
