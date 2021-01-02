import { ISpriteSheetData } from './ISpriteSheetData';

export class SpriteSheet {
    constructor(
        public bitmap: ImageBitmap,
        public data: ISpriteSheetData
    ) {
    }
}
