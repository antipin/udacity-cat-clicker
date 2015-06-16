import {ModelPictureCountable, PictureCountableData} from '../../models/picture-countable/picture-countable';

export class CollectionPicturesCountable {

    private _itemsStorage: Array<ModelPictureCountable>;

    constructor(items?: Array<PictureCountableData>) {

        this._itemsStorage = [];

        if (Array.isArray(items)) {

            items.forEach((item) => {
                var { name, url, counter = 0 } = item;
                this._itemsStorage.push(new ModelPictureCountable(name, url, counter))
            });
        }
    }

    list() {
        return this._itemsStorage;
    }

    total(): number {
        return this._itemsStorage.reduce((total, item) => {
            return total + item.counter;
        }, 0);
    }
}
