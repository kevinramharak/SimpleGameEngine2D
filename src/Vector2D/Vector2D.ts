import { Writable } from '@/types';

export type IVector2DTuple = [x: number, y: number];

export interface IVector2D {
    readonly x: number;
    readonly y: number;
}

export class Vector2D implements IVector2D {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    public add(rhs: IVector2D): IVector2D;
    public add(factor: number): IVector2D;
    public add(rhs: IVector2D | number) {
        return Vector2D.add(this, rhs);
    }

    public subtract(rhs: IVector2D): IVector2D;
    public subtract(factor: number): IVector2D;
    public subtract(rhs: IVector2D | number) {
        return Vector2D.subtract(this, rhs);
    }

    public multiply(rhs: IVector2D): IVector2D;
    public multiply(factor: number): IVector2D;
    public multiply(rhs: IVector2D | number) {
        return Vector2D.multiply(this, rhs);
    }

    public divide(rhs: IVector2D): IVector2D;
    public divide(factor: number): IVector2D;
    public divide(rhs: IVector2D | number) {
        return Vector2D.divide(this, rhs);
    }

    public clone() {
        return Vector2D.clone(this);
    }

    public writable() {
        return Vector2D.writable(this);
    }

    public absolute() {
        return Vector2D.absolute(this);
    }

    public static clone(vector: IVector2D) {
        return new Vector2D(vector.x, vector.y);
    }

    public static writable(vector: IVector2D) {
        return vector as Writable<IVector2D>;
    }

    public static from(vector: IVector2D): Vector2D;
    public static from(vector: IVector2DTuple): Vector2D;
    public static from(...vector: IVector2DTuple): Vector2D;
    public static from(...vector: IVector2DTuple | [IVector2DTuple] | [IVector2D]) {
        const [x, y] = vector;
        if (typeof y === 'number') {
            return new Vector2D(x as number, y);
        } else if (Array.isArray(x)) {
            return new Vector2D(...x);
        } else if (x instanceof Vector2D) {
            return x;
        } else {
            const vector = x as IVector2D;
            return new Vector2D(vector.x, vector.y);
        }
    }

    public static absolute(vector: IVector2D) {
        return new Vector2D(Math.abs(vector.x), Math.abs(vector.y));
    }

    public static add(lhs: IVector2D, rhs: IVector2D): IVector2D;
    public static add(lhs: IVector2D, factor: number): IVector2D;
    public static add(lhs: IVector2D, rhs: IVector2D | number): IVector2D;
    public static add(lhs: IVector2D, rhs: IVector2D | number) {
        if (typeof rhs === 'number') {
            rhs = { x: rhs, y: rhs };
        }
        return new Vector2D(
            lhs.x + rhs.x,
            lhs.y + rhs.y,
        );
    }

    public static subtract(lhs: IVector2D, rhs: IVector2D): IVector2D;
    public static subtract(lhs: IVector2D, factor: number): IVector2D;
    public static subtract(lhs: IVector2D, rhs: IVector2D | number): IVector2D;
    public static subtract(lhs: IVector2D, rhs: IVector2D | number) {
        if (typeof rhs === 'number') {
            rhs = { x: rhs, y: rhs };
        }
        return new Vector2D(
            lhs.x - rhs.x,
            lhs.y - rhs.y,
        );
    }

    public static multiply(lhs: IVector2D, rhs: IVector2D): IVector2D;
    public static multiply(lhs: IVector2D, factor: number): IVector2D;
    public static multiply(lhs: IVector2D, rhs: IVector2D | number): IVector2D;
    public static multiply(lhs: IVector2D, rhs: IVector2D | number) {
        if (typeof rhs === 'number') {
            rhs = { x: rhs, y: rhs };
        }
        return new Vector2D(
            lhs.x * rhs.x,
            lhs.y * rhs.y,
        );
    }

    public static divide(lhs: IVector2D, rhs: IVector2D): IVector2D;
    public static divide(lhs: IVector2D, factor: number): IVector2D;
    public static divide(lhs: IVector2D, rhs: IVector2D | number): IVector2D;
    public static divide(lhs: IVector2D, rhs: IVector2D | number) {
        if (typeof rhs === 'number') {
            rhs = { x: rhs, y: rhs };
        }
        return new Vector2D(
            lhs.x / rhs.x,
            lhs.y / rhs.y,
        );
    }
}
