require('./browser.css');

declare var document: Document;

import {controller} from '../../controller';
import {View} from '../view/view';
import {ViewPictureThumb} from '../picture-thumb/picture-thumb';
import {ViewPictureOverview} from '../picture-overview/picture-overview';

export class ViewBrowser extends View {

    name = 'view-browser';

    viewOverview: View;

    buildBlock() {

        var items = this.data,
            rootElement = super.buildBlock(),
            thumbsListElement = this.buildElem('thumbs-list'),
            overviewElement = this.buildElem('overview');

        // Create thumb items list
        if (Array.isArray(items)) {
            items.forEach((itemData) => {
                var view = this.createSubView(new ViewPictureThumb(thumbsListElement, itemData));
                thumbsListElement.appendChild(view.buildBlock());
            });
        }

        // Create overview item
        this.viewOverview = this.createSubView(new ViewPictureOverview(overviewElement));
        overviewElement.appendChild(this.viewOverview.buildBlock());

        rootElement.appendChild(thumbsListElement);
        rootElement.appendChild(overviewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

