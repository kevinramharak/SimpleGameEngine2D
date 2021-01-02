import { Constructor } from './Constructor';
import { Tuple } from './Tuple';

export type MapToConstructor<C extends Tuple<any>> = { [P in keyof C]: Constructor<C[P]> };
