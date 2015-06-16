require('./picture-thumb.css');

declare var document: Document;

import {View} from '../view/view'

export class ViewPictureThumb extends View {

    name = 'view-picture-thumb';

    buildBlock(data?: any) {

        var rootElement = super.buildBlock(),
            infoElement = this.buildElem('info'),
            nameElement = this.buildElem('title', 'span'),
            counterElement = this.buildElem('counter', 'span');

        rootElement.style.backgroundImage = 'url(' + data.url + ')';
        nameElement.textContent = data.name;
        counterElement.textContent = data.counter;

        infoElement.appendChild(nameElement);
        infoElement.appendChild(counterElement);

        rootElement.appendChild(infoElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}
