import { Writable } from '@/types';

export type IVector2DTuple = [x: number, y: number];

/**
 * represents a position on a 2D space
 */
export interface IVector2D {
    readonly x: number;
    readonly y: number;
}
/**
 * TODO: remove function call overhead from code
 * TODO: from() makes the code hard to reason about, because if the original was an object literal a new object reference will be returned. this could be fixed by replacing writable with clone?
 */
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

    public readonly() {
        return Vector2D.readonly(this);
    }

    public absolute() {
        return Vector2D.absolute(this);
    }

    public floor() {
        return Vector2D.floor(this);
    }

    public round() {
        return Vector2D.round(this);
    }

    public limit(min: number, max: number) {
        return Vector2D.limit(this, min, max);
    }

    public static clone(vector: IVector2D) {
        return new Vector2D(vector.x, vector.y);
    }

    public static writable(vector: IVector2D) {
        return Vector2D.clone(vector) as Writable<IVector2D>;
    }

    public static readonly(vector: Writable<IVector2D>) {
        return vector as IVector2D;
    }

    public static absolute(vector: IVector2D) {
        return new Vector2D(Math.abs(vector.x), Math.abs(vector.y));
    }

    public static floor(vector: IVector2D) {
        return new Vector2D(Math.floor(vector.x), Math.floor(vector.y));
    }

    public static round(vector: IVector2D) {
        return new Vector2D(Math.round(vector.x), Math.round(vector.y));
    }

    public static limit(vector: IVector2D, min: number, max: number) {
        return new Vector2D(
            vector.x < min ? min : vector.x > max ? max : vector.x,
            vector.y < min ? min : vector.y > max ? max : vector.y,
        )
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
