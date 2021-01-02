import { Constructor } from './Constructor';
import { Tuple } from './Tuple';

export type MapToInstanceType<C extends Tuple<Constructor>> = C extends Tuple<any> ? { [P in keyof C]: InstanceType<C[P]> } : never;
