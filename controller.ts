import {ViewBrowser} from './views/browser/browser';
import {CollectionPicturesCountable} from './collections/pictures-countable/pictures-countable';

class Controller {

    viewBrowser: ViewBrowser;

    viewActiveThumb;

    catsCollection: any;

    init(appContainer, items) {

        this.catsCollection = new CollectionPicturesCountable(items);

        this.viewBrowser = new ViewBrowser(appContainer, this.catsCollection.list());
        this.viewBrowser.render();
    }

    setActive(viewThumb) {
        var data = viewThumb.data;
        this.viewActiveThumb = viewThumb;
        this.viewBrowser.viewOverview.setData(data);
        this.viewBrowser.viewOverview.render();
    }

    increaseCounter(viewOverview) {
        var data = viewOverview.data;
        data.counter++;
        viewOverview.render();
        this.viewActiveThumb.render();
    }
}

controller = new Controller();

export var controller;