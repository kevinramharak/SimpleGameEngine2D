
import { Motion } from './Motion';
import { Sprite } from './Sprite';
import { Transform } from './Transform';

export * from './Component';
export * from './ComponentManager';
export * from './HasComponentManagers';

export const components = [
    Motion,
    Sprite,
    Transform,
] as const;
