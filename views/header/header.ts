require('./header.css');
require('./header__logo.svg');

import {controller} from '../../controller';
import {View} from '../view/view';

export class ViewHeader extends View {

    name = 'view-header';

    buildBlock() {

        var rootElement = super.buildBlock(),
            logoElement = this.buildElem('logo');

        rootElement.appendChild(logoElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}