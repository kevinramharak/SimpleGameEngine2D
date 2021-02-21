import { Collision } from '@/Component/Collision';
import { Motion } from '@/Component/Motion';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';
import { Delta } from '@/Time';
import { Vector2D } from '@/Vector2D';
import { System } from '../System';

export enum CollisionType {
    Circle,
    //Square,
    //Line,
}

const map = {
    [CollisionType.Circle]: {
        [CollisionType.Circle](motion: Motion, lhs_transform: Transform, rhs_transform: Transform) {
            const sum = lhs_transform.size.x + rhs_transform.size.x;
            const difference = lhs_transform.size.x - rhs_transform.size.x;
            const x = lhs_transform.position.x - rhs_transform.position.x;
            const y = lhs_transform.position.y - rhs_transform.position.y;
            if (difference < x && x < sum) {
                motion.velocity = Vector2D.multiply(motion.velocity, { x: -1, y: 1 });
            }
            if (difference < y && y < sum) {
                motion.velocity = Vector2D.multiply(motion.velocity, { x: 1, y: -1 });
            }
        }
    }
} as const;

/**
 * TODO: Entities without motion
 */
export class CollisionPhysics extends System<[Transform, Collision]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Collision,
        ]));
    }

    Update(delta: Delta) {
        this.entities.forEach(lhs => {
            const [lhs_transform, lhs_collison, motion] = this.game.GetEntityComponents(lhs, Transform, Collision, Motion);
            const lhs_map = map[lhs_collison.type];
            this.entities.forEach(rhs => {
                if (lhs === rhs) {
                    return;
                }
                const [rhs_transform, rhs_collison] = this.game.GetEntityComponents(rhs, Transform, Collision);
                const impl = lhs_map[rhs_collison.type];
                impl(motion, lhs_transform, rhs_transform);
            });
        });
    }

    Awake() {

    }

    Destroy() {

    }
}

