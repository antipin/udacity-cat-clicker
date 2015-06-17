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
            imageElement = this.buildElem('image'),
            nameElement = this.buildElem('name'),
            counterElement = this.buildElem('counter');

        if (this.data) {
            nameElement.textContent = this.data.name;
            imageElement.style.backgroundImage = 'url(' + this.data.url + ')';
            counterElement.textContent = this.data.counter;
        }

        imageElement.appendChild(nameElement);
        imageElement.appendChild(counterElement);

        rootElement.appendChild(imageElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    increaseCounter() {
        controller.increaseCounter(this);
    }
}
