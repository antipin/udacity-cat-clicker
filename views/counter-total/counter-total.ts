require('./counter-total.css');

import {controller} from '../../controller'
import {View} from '../view/view'

export class ViewCounterTotal extends View {

    name = 'view-counter-total';

    buildBlock() {
        var rootElement = super.buildBlock();
        rootElement.textContent = this.data;
        this.attachEventsTo(rootElement);
        return rootElement;
    }
}
