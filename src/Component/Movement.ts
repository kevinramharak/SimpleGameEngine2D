import { Vector2D } from '@/Vector2D';
import { Component } from './Component';
import { Input } from './Input';
import { Motion } from './Motion';

export class Movement extends Component {
    /**
     * TODO: figure out how much to move, probably change state to be numbers? 
     */
    Move(input: Input, motion: Motion) {
        const acceleration = Vector2D.writable(motion.acceleration);

        if (input.state.left) {
            acceleration.x -= 2;
        }
        if (input.state.right) {
            acceleration.x += 2;
        }
        if (input.state.up) {
            acceleration.y -= 2;
        }
        if (input.state.down) {
            acceleration.y += 2;
        }

        if (input.state.jump) {
            acceleration.y -= 4;
        }

        motion.acceleration = Vector2D.limit(acceleration, -4, 4);
    }
}
