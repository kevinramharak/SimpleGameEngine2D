import { Input } from './Input';
import { Motion } from './Motion';

export class Keyboard extends Input {
    constructor() {
        super();
    }

    Receive(state: Record<string, boolean>) {
        Object.entries(state).forEach(([key, value]) => {
            switch(key) {
                case 'KeyW':
                    this.state.up = value;
                    break;
                case 'KeyS':
                    this.state.down = value;
                    break;
                case 'KeyA':
                    this.state.left = value;
                    break;
                case 'KeyD':
                    this.state.right = value;
                    break
                case 'Space':
                    this.state.jump = value;
                    break;
                case 'ShiftLeft':
                    this.state.attack = value;
                    break;
            }
        });
    }
}
