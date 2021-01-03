import { RenderEngine } from './Render';
import { KeyboardSystem } from './Keyboard';
import { PhysicsEngine } from './Physics';
import { MovementSystem } from './Action';

export * from './System';

// TODO: fix this so the order does not matter
// NOTE: right now we kind of want the input systems to be updated first, maybe use some kind of order filtering in Game?
export const systems = [
    // input
    KeyboardSystem,

    // action
    MovementSystem,

    // physics
    PhysicsEngine,

    // rendering
    RenderEngine,

] as const;