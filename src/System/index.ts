import { RenderEngine } from './Render';

export * from './System';

export const systems = [
    RenderEngine,
] as const;