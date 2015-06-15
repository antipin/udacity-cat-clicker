declare var document: Document;

import {View} from '../view/view'

export class ViewPictureOverview extends View {

    name = 'view-picture-overview';

    buildBlock(data: any) {

        var rootElement = super.buildBlock(data);

        rootElement.textContent = 'preview';

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}
