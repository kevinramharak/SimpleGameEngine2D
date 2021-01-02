import { ISpriteSheetState } from './ISpriteSheetState';

export interface ISpriteSheetData {
    width: number;
    height: number;
    states: Record<string, ISpriteSheetState>;
}
