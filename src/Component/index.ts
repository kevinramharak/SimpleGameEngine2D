import { Control } from './Control';
import { Input } from './Input';
import { Motion } from './Motion';
import { Movement } from './Movement';
import { Render } from './Render';
import { Transform } from './Transform';


export * from './Component';
export * from './ComponentManager';
export * from './HasComponentManagers';

/**
 * Components that should get their own ComponentManager
 * NOTE: this array should only contain base classes
 * NOTE: any class that extends a different class from Component should not get its own manager
 * NOTE: but instead use the manager of the base class
 */
export const components = [
    Control,
    Input,
    Motion,
    Movement,
    Render,
    Transform,
] as const;
