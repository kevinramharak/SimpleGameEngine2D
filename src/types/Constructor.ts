
export interface Constructor<T = any, A extends any[] = any[]> {
    new (...args: A): T;
}
