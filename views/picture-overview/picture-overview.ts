require('./picture-overview.css');

declare var document: Document;

import {controller} from '../../controller';
import {View} from '../view/view'

export class ViewPictureOverview extends View {

    name = 'view-picture-overview';

    events = [
        {
            event: 'click',
            selector: '',
            callback: this.increaseCounter.bind(this)
        }
    ];

    buildBlock() {

        var rootElement = super.buildBlock(),
            nameElement = this.buildElem('title'),
            imageElement = this.buildElem('image'),
            counterElement = this.buildElem('counter');

        if (this.data) {
            nameElement.textContent = this.data.name;
            imageElement.style.backgroundImage = 'url(' + this.data.url + ')';
            counterElement.textContent = this.data.counter;
        }

        rootElement.appendChild(nameElement);
        rootElement.appendChild(imageElement);
        rootElement.appendChild(counterElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    increaseCounter() {
        controller.increaseCounter(this);
    }
}
