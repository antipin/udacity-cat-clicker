declare var document: Document;

import {View} from '../view/view';
import {ViewPicturePreview} from '../picture-preview/picture-preview'

export class ViewBrowser extends View {

    name = 'view-browser';

    buildElem(items: any) {

        var rootElement = super.buildElem(items),
            listElement = document.createElement('div'),
            previewElement = document.createElement('div');

        if (Array.isArray(items)) {
            items.forEach((itemData) => {

                var view = this.createSubView(new ViewPicturePreview(listElement, itemData)),
                    viewElem = view.buildElem(itemData);

                listElement.appendChild(viewElem);
            });
        }

        rootElement.appendChild(listElement);
        rootElement.appendChild(previewElement);

        this.attachEventsTo(rootElement);

        return rootElement;
    }
}

