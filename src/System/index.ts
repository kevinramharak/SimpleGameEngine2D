import { RenderEngine } from './Render';
import { ControlSystem } from './Control';
import { PhysicsEngine } from './Physics';
import { KeyboardSystem } from './Keyboard';

export * from './System';

export const systems = [
    ControlSystem,
    KeyboardSystem,
    RenderEngine,
    PhysicsEngine,
] as const;