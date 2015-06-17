require('./browser.css');

import {controller} from '../../controller';
import {View} from '../view/view';
import {ViewPictureThumb} from '../picture-thumb/picture-thumb';
import {ViewPictureOverview} from '../picture-overview/picture-overview';
import {ViewPictureEdit} from '../picture-edit/picture-edit';

export class ViewBrowser extends View {

    name = 'view-browser';

    viewPictureOverview: View;

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
        this.viewPictureOverview = this.createSubView(new ViewPictureOverview(overviewElement));

        rootElement.appendChild(thumbsListElement);
        rootElement.appendChild(overviewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

