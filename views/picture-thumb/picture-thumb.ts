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
            nameElement = this.buildElem('name', 'span'),
            urlElement = this.buildElem('image', 'img'),
            counterElement = this.buildElem('counter', 'span');

        nameElement.textContent = data.name;
        urlElement.src = data.url;
        counterElement.textContent = data.counter;

        rootElement.appendChild(nameElement);
        rootElement.appendChild(urlElement);
        rootElement.appendChild(counterElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}
