import { Delta } from '@/Time';
import { Tuple } from '@/types';

export interface IAwake {
    Awake(): void;
}

export interface IDestroy {
    Destroy(): void;
}

export interface IUpdate {
    Update(delta: Delta): void;
}

export interface IRender<A extends Tuple = Tuple> {
    Render(delta: Delta, ...rest: A): void;
}
