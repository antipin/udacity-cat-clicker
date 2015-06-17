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
        this.viewBrowser.viewPictureOverview
            .setData(data)
            .render();
    }

    increaseCounter(viewOverview) {
        var data = viewOverview.data;

        data.counter++;

        viewOverview.render();
        this.viewActiveThumb.render();

        this.viewHeader.viewCounterTotal.setData(this.catsCollection.total());
        this.viewHeader.viewCounterTotal.render()
    }
}

controller = new Controller();

export var controller;