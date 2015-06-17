require('./picture-editor.css');

import {controller} from '../../controller';
import {View} from '../view/view'

export class ViewPictureEditor extends View {

    name = 'view-picture-editor';

    buildBlock() {

        var rootElement = super.buildBlock(),
            backgroundElement = this.buildElem('background'),
            formElement = this.buildElem('form'),

            nameField = this.buildElem('name-field'),
            nameLabel = this.buildElem('name-label'),
            nameInput = this.buildInputElem('name', 'input'),

            counterField = this.buildElem('counter-field'),
            counterLabel = this.buildElem('counter-label'),
            counterInput = this.buildInputElem('counter', 'input');

        nameLabel.textContent = 'Name:';
        nameField.appendChild(nameLabel);
        nameField.appendChild(nameInput);

        counterLabel.textContent = 'Counter:';
        counterField.appendChild(counterLabel);
        counterField.appendChild(counterInput);

        if (this.data) {
            backgroundElement.style.backgroundImage = 'url(' + this.data.url + ')';
            nameInput.value = this.data.name;
            counterInput.value = this.data.counter;
        }

        formElement.appendChild(nameField);
        formElement.appendChild(counterField);

        rootElement.appendChild(backgroundElement);
        rootElement.appendChild(formElement);

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
