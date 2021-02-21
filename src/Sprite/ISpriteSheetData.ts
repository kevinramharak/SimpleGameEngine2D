import { ISpriteSheetState } from './ISpriteSheetState';

export interface ISpriteSheetData {
    readonly width: number;
    readonly height: number;
    readonly states: Record<string, ISpriteSheetState>;
}
