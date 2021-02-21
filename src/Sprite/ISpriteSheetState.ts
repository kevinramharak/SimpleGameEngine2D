import { IVector2D } from '@/Vector2D';

export interface ISpriteSheetState {
    readonly duration: number;
    readonly frames: readonly IVector2D[];
    readonly orientation: 'left' | 'right';
}
