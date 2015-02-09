(function(window) {

    var doc = window.document;

    /**
     * @class App 
     */
    var App = function(containerId) {

        var cat,
            catClicker,
            catImagePath;

        this.domElem = doc.getElementById(containerId);
        this.domElem.className = 'app';

        catPath = this.domElem.getAttribute('data-image') || '';
        catTitle = this.domElem.getAttribute('data-title')  || '';
        
        cat = new Picture(this.domElem, catPath, catTitle);
        catClicker = new ClickCounter(this.domElem, cat);
    };

    /**
     * @class Observable
     */
    var Observable = function() {
        this.bindings = {};
    };

    Observable.prototype.on = function(event, callback, context) {
        
        this.bindings[event] = this.bindings[event] || [];

        this.bindings[event].push({
            callback: callback,
            context:  context
        });
    };

    Observable.prototype.off = function(event, callback, context) {
        if (Array.isArray(this.bindings[event])) {
            this.bindings[event].forEach(function(callbackParams, index) {
                if (callbackParams.callback === callback && callbackParams.context === context) {
                    this.bindings[event].splice(index, 1);
                }
            }, this);
        }
    };

    Observable.prototype.trigger = function(event, data) {
        if (Array.isArray(this.bindings[event])) {
            this.bindings[event].forEach(function(callbackParams) {
                callbackParams.callback.call(callbackParams.context, data);
            });
        }  
    };

    /**
     * @class Picture
     */
    var Picture = function(container, picturePath, pictureTitle) {

        // Invoke Observable constructor
        Observable.call(this);

        this.domElem = container;

        this.title = pictureTitle;

        this.picture = new Image();
        this.picture.src = picturePath;
        this.picture.addEventListener('click', this.clickHandler.bind(this));
        this.domElem.appendChild(this.picture);

        var titleDomElem = document.createElement('div');
        titleDomElem.className = "picture-title";
        titleDomElem.innerHTML = pictureTitle;
        this.domElem.appendChild(titleDomElem);
    };

    // Inherit from observable
    Picture.prototype = Object.create(Observable.prototype);
    Picture.prototype.constructor = Picture;

    Picture.prototype.getDomElem = function() {
        return this.domElem;
    };

    Picture.prototype.clickHandler = function(e) {
        this.trigger('click');
    };

    /**
     * @class Clicker
     */
    var ClickCounter = function(container, target) {

        this.counter = 0;

        this.counterDomElem = document.createElement('div');
        this.counterDomElem.className = "counter";
        container.appendChild(this.counterDomElem);

        target.on('click', this.increaseClicks, this);
    }

    ClickCounter.prototype.increaseClicks = function() {
        this.counter++;
        this.updateCounter();
    };

    ClickCounter.prototype.updateCounter = function() {
        this.counterDomElem.innerHTML = this.counter;
    };

    /**
     * App init
     */
    window.onload = function() {
        new App('cat-clicker-russle');
        new App('cat-clicker-brad');
    }

}(window));
