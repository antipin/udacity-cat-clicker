require('./views/page/page');

import {ViewHeader} from './views/header/header';
import {ViewBrowser} from './views/browser/browser';
import {ViewPictureThumb} from './views/picture-thumb/picture-thumb';
import {CollectionPicturesCountable} from './collections/pictures-countable/pictures-countable';

class Controller {

    viewBrowser: ViewBrowser;
    viewHeader: ViewHeader;
    viewActiveThumb: ViewPictureThumb;

    catsCollection: any;

    init(appContainer, items) {

        this.catsCollection = new CollectionPicturesCountable(items);

        this.viewHeader = new ViewHeader(appContainer)
        this.viewHeader.render();

        this.viewBrowser = new ViewBrowser(appContainer, this.catsCollection.list());
        this.viewBrowser.render();
    }

    setActive(viewThumb) {
        var data = viewThumb.data;
        this.viewActiveThumb = viewThumb;
        this.viewBrowser.viewPicture
            .setData(data)
            .setState('mode', 'view')
            .render();
    }

    increaseCounter(viewPictureViewer) {
        var data = viewPictureViewer.data;

        data.counter++;

        viewPictureViewer.render();
        this.viewActiveThumb.render();

        this.viewHeader.viewCounterTotal
            .setData(this.catsCollection.total())
            .render();
    }

    savePicture(viewPicture, newData) {

        var data = viewPicture.data;

        data.name = newData.name;
        data.counter = newData.counter;

        viewPicture.switchMode('view');
        this.viewActiveThumb.render();
        this.viewHeader.viewCounterTotal
            .setData(this.catsCollection.total())
            .render();
    }
}

controller = new Controller();

export var controller;