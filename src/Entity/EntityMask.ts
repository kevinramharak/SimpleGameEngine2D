import { Component } from '@/Component';
import { Logger } from '@/Logger';
import { Constructor, Tuple } from '@/types';

export class EntityMask<C extends Tuple<Constructor<Component>> = Tuple<Constructor<Component>>> {
    constructor(
        // NOTE: [] is typed as never[], which is fine. but no idea why i cant cast it to C.
        // see: https://github.com/Microsoft/TypeScript/issues/9976
        public mask: C = ([] as unknown as C),
    ) {}

    Add(component: Constructor<Component>) {
        this.mask.push(component);
    }

    Remove(component: Constructor<Component>) {
        const index = this.mask.indexOf(component);
        if (index !== -1) {
            this.mask.splice(index, 1);
        } else {
            Logger.Error(new Error('tried to remove a component from a mask that did not include that component'));
        }
    }

    Matches(other: EntityMask) {
        return this.mask.every(type => other.mask.some((other) => {
            return type === other || type.isPrototypeOf(other) || other.isPrototypeOf(type)
        })) || false;
    }

    Copy() {
        return new EntityMask([...this.mask]);
    }
}
