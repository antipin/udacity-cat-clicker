declare var document: Document;

import {View} from '../view/view';
import {ViewPictureThumb} from '../picture-thumb/picture-thumb';
import {ViewPictureOverview} from '../picture-overview/picture-overview';

export class ViewBrowser extends View {

    name = 'view-browser';

    buildElem(items: any) {

        var rootElement = super.buildElem(items),
            listElement = document.createElement('div'),
            overviewElement = document.createElement('div'),
            viewOverview;

        // Create thumb items list
        if (Array.isArray(items)) {
            items.forEach((itemData) => {
                var view = this.createSubView(new ViewPictureThumb(listElement, itemData));
                listElement.appendChild(view.buildElem(itemData));
            });
        }

        // Create overview item
        viewOverview = this.createSubView(new ViewPictureOverview(overviewElement));
        overviewElement.appendChild(viewOverview.buildElem());

        rootElement.appendChild(listElement);
        rootElement.appendChild(overviewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

