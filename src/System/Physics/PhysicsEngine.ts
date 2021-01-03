import { Motion } from '@/Component/Motion';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';
import { Delta } from '@/Time';
import { asInt } from '@/util';
import { Vector2D } from '@/Vector2D';
import { System } from '../System';

export class PhysicsEngine extends System<[Transform, Motion]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Motion,
        ]));
    }

    Update(delta: Delta) {
        const time = delta / 10;
        this.entities.forEach(entity => {
            const [transform, motion] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            const position = Vector2D.writable(transform.position);
            const acceleration = Vector2D.writable(motion.acceleration);
            const velocity = motion.velocity = Vector2D.from(motion.velocity).limit(-20, 20).writable();

            position.x += asInt(velocity.x * time / 15);
            position.y += asInt(velocity.y * time / 15);
            
            velocity.x += asInt(acceleration.x * time);
            velocity.y += asInt(acceleration.y * time);
            
            if (velocity.x > 0) {
                velocity.x -= 1;
            } else if (velocity.x) {
                velocity.x += 1;
            }

            if (velocity.y > 0) {
                velocity.y -= 1;
            } else if (velocity.y) {
                velocity.y += 1;
            }

            
            if (acceleration.x > 0) {
                acceleration.x -= 1;
            } else if (acceleration.x) {
                acceleration.x += 1;
            }

            if (acceleration.y > 0) {
                acceleration.y -= 1;
            } else if (acceleration.y) {
                acceleration.y += 1;
            }

            motion.acceleration = acceleration;
            motion.velocity = velocity;

            // make sure position is never half a pixel as the Canvas really does not like that
            transform.position = Vector2D.from(position).round();
        });
    }

    Awake() {
    }

    Destroy() {
    }
}
