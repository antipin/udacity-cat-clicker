import {ModelPicture} from '../picture/picture';

export class ModelPictureCountable extends ModelPicture {

    private _counter: number;

    get counter(): number {
        return this._counter
    }

    set counter(value: any) {
        value = parseInt(value, 10);
        value = value < 0 ? 0 : value;
        value = isNaN(value) ? 0 : value;
        this._counter = value;
    }

    constructor(name: string, url: string, counter?: number) {
        super(name, url);
        this.counter = counter || 0;
    }
}

export interface PictureCountableData {
    name: string;
    url: string;
    counter?: number;
}