import {ModelPicture} from '../picture/picture';

export class ModelPictureCountable extends ModelPicture {

    private _counter: number;

    get counter(): number {
        return this._counter
    }

    set counter(value: number) {
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