import { Control } from './Control';
import { Input } from './Input';
import { Motion } from './Motion';
import { Movement } from './Movement';
import { Render } from './Render';
import { Transform } from './Transform';
import { Gravity } from './Gravity';
import { Collision } from './Collision';

export * from './Component';
export * from './ComponentManager';

/**
 * Components that should get their own ComponentManager
 * NOTE: this array should only contain base classes
 * NOTE: any class that extends a different class from Component should not get its own manager
 * NOTE: but instead use the manager of the base class
 * 
 * TODO: add a [].filter to only get the base classes. would make this less error prone
 */
export const components = [
    Control,
    Input,
    Motion,
    Movement,
    Render,
    Transform,
    Gravity,
    Collision,
] as const;
