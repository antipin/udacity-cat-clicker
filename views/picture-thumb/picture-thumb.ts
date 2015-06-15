require('./picture-thumb.css');

declare var document: Document;

import {View} from '../view/view'

export class ViewPictureThumb extends View {

    name = 'view-picture-thumb';

    events = [
        {
            event: 'click',
            selector: '',
            callback: () => {
                this.data.counter++;
                this.render();
            }
        }
    ];

    buildBlock(data?: any) {

        var rootElement = super.buildBlock(data),
            nameElement = this.buildElem('title', 'span'),
            counterElement = this.buildElem('counter', 'span');

        rootElement.style.backgroundImage = 'url(' + data.url + ')';
        nameElement.textContent = data.name;
        counterElement.textContent = data.counter;

        rootElement.appendChild(nameElement);
        rootElement.appendChild(counterElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}
