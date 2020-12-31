import { Component, ComponentManager } from '@/Component';
import { Constructor } from '@/types';

export interface HasComponentManagers {
    AddComponentManager<C extends Component>(type: Constructor<C>): void;
    GetComponentManager<C extends Component | Constructor<Component>>(component: C): C extends Constructor ? ComponentManager<InstanceType<C>> : ComponentManager<C>;
}
