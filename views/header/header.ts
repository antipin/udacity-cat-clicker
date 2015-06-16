require('./header.css');
require('./header__logo.svg');

import {controller} from '../../controller';
import {View} from '../view/view';
import {ViewCounterTotal} from '../counter-total/counter-total';

export class ViewHeader extends View {

    name = 'view-header';

    viewCounterTotal: ViewCounterTotal;

    buildBlock() {

        var rootElement = super.buildBlock(),
            logoElement = this.buildElem('logo'),
            counterElement = this.buildElem('counter');

        this.viewCounterTotal = new ViewCounterTotal(counterElement);
        this.viewCounterTotal.render();

        rootElement.appendChild(logoElement);
        rootElement.appendChild(counterElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}