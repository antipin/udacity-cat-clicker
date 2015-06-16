require('./counter-total.css');

declare var document: Document;

import {controller} from '../../controller'
import {View} from '../view/view'

export class ViewCounterTotal extends View {

    name = 'view-counter-total';

    buildBlock() {

        var rootElement = super.buildBlock(),
            labelElement = this.buildElem('label', 'span'),
            valueElement = this.buildElem('value', 'span');

        labelElement.textContent = this.data ? 'Всего: ': '';
        valueElement.textContent = this.data;

        rootElement.appendChild(labelElement);
        rootElement.appendChild(valueElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}
