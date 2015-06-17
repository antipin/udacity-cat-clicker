require('./picture-editor.css');

import {controller} from '../../controller';
import {View} from '../view/view'

export class ViewPictureEditor extends View {

    name = 'view-picture-editor';

    buildBlock() {

        var rootElement = super.buildBlock(),
            nameElement = this.buildInputElem('name', 'input'),
            counterElement = this.buildElem('counter', 'input');

        if (this.data) {
            nameElement.value = this.data.name;
            counterElement.value = this.data.counter;
        }

        rootElement.appendChild(nameElement);
        rootElement.appendChild(counterElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    getData() {
        return {
            name: this.elem('name').value,
            counter: this.elem('counter').value
        };
    }
}
