import { Component, ComponentManager, components } from '@/Component';
import { Entity, EntityManager } from '@/Entity';
import { EventBus } from '@/EventBus';
import { IAwake, IDestroy, IRender, IUpdate } from '@/Lifecycle';
import { Logger } from '@/Logger';
import { Settings } from '@/Settings';
import { System, systems } from '@/System';
import { benchmark, Delta, frame, now, Timestamp } from '@/Time';
import { Constructor, MapToInstanceType, Tuple } from '@/types';
import { asInt } from '@/util';

const MAX_LOOP_DURATION = asInt(1000 / Settings.engines.loop.ups);

/**
 * Singleton object responsible for housing the different components:
 * - [x] Render Engine
 * - [ ] Physics Engine
 * - [ ] Audio Engine
 * - [x] Event Bus
 * - [x] ECS
 */
export class Game implements IAwake, IDestroy {
    /**
     * represents the last time the Loop was executed
     */
    private timestamp: Timestamp = 0 as Timestamp;

    /**
     * represents the last time systems with a Render function were executed
     */
    private render: Delta = 0 as Delta;

    /**
     *
     */
    private managers: ComponentManager<Component>[] = [];
    
    /**
     * TODO: filter these into renderables and updatables to be slightly more effecient
     */
    private systems: System[] = [];

    /**
     * this bus should be passed on to each object that wants to pub/sub events
     */
    private eventbus: EventBus;

    /**
     *
     */
    private entities: EntityManager;

    /**
     *
     */
    private handlers: [target: EventTarget, event: string, handler: (event: Event) => void][] = [];

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

    CreateEntity<C extends Tuple<Component>>(...components: C) {
        const entity = this.entities.CreateEntity(this);
        entity.AddComponents(...components);
        return entity;
    }

    DestroyEntity<E extends Entity>(entity: E) {
        return this.entities.DestroyEntity(entity);
    }

    GetEntityComponents<E extends Entity, C extends Tuple<Constructor<Component>[]>>(entity: E, ...components: C) {
        return components.map(component => this.GetComponentManager(component).Get(entity)) as C extends Tuple ? MapToInstanceType<C> : Component[];
    }

    Awake() {
        this.CreateListener(document, 'visibilitychange', () => {
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
        let remaining = MAX_LOOP_DURATION;

        // if delta is bigger than some threshold, the Loop is taking to much time to execute
        if (delta > MAX_LOOP_DURATION) {
            Logger.Warn(`Encountered Loop delta of ${delta}, limiting it to ${MAX_LOOP_DURATION}`);
            delta = MAX_LOOP_DURATION as Delta;
        }

        // benchmark how much time the update call takes
        const update = benchmark(() => {
            this.systems.forEach(system => system.Update(delta));
        });

        if (update > remaining) {
            Logger.Warn(`System::Update took ${update} of the remaining ${remaining}`)
        }
        remaining -= update;

        if (remaining < this.render) {
            Logger.Warn(`last render took ${this.render}, while the remaining is ${remaining}`)
        }

        // benchmark how much time the render call takes
        const render = this.render = benchmark(() => {
            this.systems.forEach(system => system.Render(delta));
        });

        if (render > remaining) {
            // render took more time than we had available
            Logger.Warn(`System::Render took ${render} of the remaining ${remaining}`)
        }
        remaining -= render;

        if (remaining < 0) {
            Logger.Warn(`System::Loop took more ${-remaining} than available`);
        }

        // update the timestamp and request a new frame for the next Loop iteration
        this.timestamp = now();
        frame(timestamp => this.Loop(timestamp));
    }

    CreateListener(target: EventTarget, event: string, handler: (event: Event) => void) {
        this.handlers.push([target, event, handler]);
        target.addEventListener(event, handler);
    }

    Destroy() {
        this.systems.forEach(system => system.Destroy());
        this.handlers.forEach(([target, event, handler]) => {
            target.removeEventListener(event, handler);
        });
    }
}
