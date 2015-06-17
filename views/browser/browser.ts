require('./browser.css');

import {controller} from '../../controller';
import {View} from '../view/view';
import {ViewPictureThumb} from '../picture-thumb/picture-thumb';
import {ViewPicture} from '../picture/picture';

export class ViewBrowser extends View {

    name = 'view-browser';

    viewPicture: ViewPicture;

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

        // Create picture item
        this.viewPicture = <ViewPicture>this.createSubView(new ViewPicture(overviewElement));

        rootElement.appendChild(thumbsListElement);
        rootElement.appendChild(overviewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

