require('./picture-viewer.css');

import {controller} from '../../controller';
import {View} from '../view/view'

export class ViewPictureViewer extends View {

    name = 'view-picture-viewer';

    events = [
        {
            event: 'click',
            elem: 'image',
            callback: this.increaseCounter.bind(this)
        }
    ];

    buildBlock() {

        var rootElement = super.buildBlock(),
            nameElement = this.buildElem('name'),
            imageElement = this.buildElem('image'),
            counterElement = this.buildElem('counter', 'sup');

        if (this.data) {
            nameElement.textContent = this.data.name;
            imageElement.style.backgroundImage = 'url(' + this.data.url + ')';
            counterElement.textContent = this.data.counter;
        }

        nameElement.appendChild(counterElement)

        rootElement.appendChild(nameElement);
        rootElement.appendChild(imageElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    increaseCounter() {
        controller.increaseCounter(this);
    }
}
