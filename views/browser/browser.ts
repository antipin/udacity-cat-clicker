require('./browser.css');

declare var document: Document;

import {View} from '../view/view';
import {ViewPictureThumb} from '../picture-thumb/picture-thumb';
import {ViewPictureOverview} from '../picture-overview/picture-overview';

export class ViewBrowser extends View {

    name = 'view-browser';

    buildBlock(items: any) {

        var rootElement = super.buildBlock(items),
            thumbsListElement = this.buildElem('thumbs-list'),
            overviewElement = this.buildElem('overview'),
            viewOverview;

        // Create thumb items list
        if (Array.isArray(items)) {
            items.forEach((itemData) => {
                var view = this.createSubView(new ViewPictureThumb(thumbsListElement, itemData));
                thumbsListElement.appendChild(view.buildBlock(itemData));
            });
        }

        // Create overview item
        viewOverview = this.createSubView(new ViewPictureOverview(overviewElement));
        overviewElement.appendChild(viewOverview.buildBlock());

        rootElement.appendChild(thumbsListElement);
        rootElement.appendChild(overviewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

