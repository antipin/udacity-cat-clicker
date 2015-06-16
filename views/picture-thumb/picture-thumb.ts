require('./picture-thumb.css');

declare var document: Document;

import {controller} from '../../controller'
import {View} from '../view/view'

export class ViewPictureThumb extends View {

    name = 'view-picture-thumb';

    events = [
        {
            event: 'click',
            selector: '',
            callback: this.setAsActive.bind(this)
        }
    ];

    buildBlock() {

        var rootElement = super.buildBlock(),
            infoElement = this.buildElem('info'),
            nameElement = this.buildElem('title', 'span'),
            counterElement = this.buildElem('counter', 'span');

        if (this.data) {
            rootElement.style.backgroundImage = 'url(' + this.data.url + ')';
            nameElement.textContent = this.data.name;
            counterElement.textContent = this.data.counter;
        }

        infoElement.appendChild(nameElement);
        infoElement.appendChild(counterElement);

        rootElement.appendChild(infoElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    setAsActive() {
        controller.setActive(this);
    }
}
