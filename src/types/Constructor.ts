import { Tuple } from './Tuple';

export interface Constructor<T = any, A extends Tuple = any[]> {
    new (...args: A): T;
}
