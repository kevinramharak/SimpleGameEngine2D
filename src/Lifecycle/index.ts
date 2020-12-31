import { Delta } from '@/Time';

export interface IAwake {
    Awake(): void;
}

export interface IDestroy {
    Destroy(): void;
}

export interface IUpdate {
    Update(delta: Delta): void;
}

export interface IRender {
    Render(): void;
}
