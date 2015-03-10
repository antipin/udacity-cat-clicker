(function(window) {

    'use strict';

    var doc = window.document;

    /**
     * App init
     */
    window.onload = function() {
        var appContainer = doc.getElementById('app');
        new App(appContainer);
    };

    /**
     * @class Observable
     * @constructor
     */
    var Observable = function() {
        this.bindings = {};
    };

    /** 
     * @param {string} event
     * @param {Function} callback
     * @param {Object} context
     */
    Observable.prototype.on = function(event, callback, context) {
        
        this.bindings[event] = this.bindings[event] || [];

        this.bindings[event].push({
            callback: callback,
            context:  context
        });
    };

    /**
     * @param {string} event
     * @param {Function} callback
     * @param {Object} context
     */
    Observable.prototype.off = function(event, callback, context) {

        if (Array.isArray(this.bindings[event])) {

            this.bindings[event].forEach(function(callbackParams, index) {

                if (callbackParams.callback === callback && callbackParams.context === context) {

                    this.bindings[event].splice(index, 1);
                }
            }, this);
        }
    };

    /**
     * @param {string} event
     * @param {Object} data
     */
    Observable.prototype.trigger = function(event, data) {

        if (Array.isArray(this.bindings[event])) {

            this.bindings[event].forEach(function(callbackParams) {

                callbackParams.callback.call(callbackParams.context, data);
            });
        }  
    };

    /**
     * @class App
     * @param {HTMLElement} container
     * @constructor
     */
    var App = function(container) {
        
        this.container = container;

        var pictures = this.getPictureItems();

        this.browser = new BrowserView(this.container);

        this.browser
            
            .registerItemType({
                name: 'picture',
                previewConstructor:  PictureView,
                fullviewConstructor: PictureView,
            })
            
            .addItems(pictures)
            
            .render();
    };

    /**
     * @return {Array.<BrowserItemData>}
     */
    App.prototype.getPictureItems = function() {
        
        var pictures = this.container.getAttribute('data-pictures').split(',');

        return pictures.map(function(picture) {

            return new BrowserItemData('picture', {
                path:  picture + '.jpg',
                title: picture
            });
        });
    };

    /**
     * Base class for views
     * @class View
     * @param {HTMLElement} container
     * @constructor
     */
    var View = function(container) {
        
        // Invoke Observable constructor
        Observable.call(this);

        this.container = container;

        this.domElem = doc.createElement(this.tag || 'div');

        if (this.name) {
            this.domElem.classList.add(this.name);
        }
    };

    // Inherit from observable
    View.prototype = Object.create(Observable.prototype);
    View.prototype.constructor = View;

    /**
     * Renders view
     * @param {string} [tagName]
     * @return {View} instance
     */
    View.prototype.render = function(tagName) {

        this.domElem.innerHTML = this.getTemplate();

        return this;
    };

    /**
     * Appends rendered HTMLElement to container
     * @return {View} instance
     */
    View.prototype.attachToContainer = function() {

        this.container.appendChild(this.domElem);

        return this;
    };

    /**
     * @return {string} HTML template
     */
    View.prototype.getTemplate = function() {

        return '';
    };

    /**
     * Returns view's element by name
     * @return {HTMLElement} 
     */
    View.prototype.elem = function(elemName) {

        var elemSelector = '.' + this.name + '__' + elemName,
            elem;

        this._elemsCache = this._elemsCache || {};

        if (this._elemsCache[elemName]) {
            return this._elemsCache[elemName];
        }

        elem = this.domElem.querySelector(elemSelector);

        if (elem !== null) {
            this._elemsCache[elemName] = elem;
        }

        return elem;
    };

    /**
     * @class BrowserView
     * @param {HTMLElement} container
     * @param {Array.<string>} pictures
     * @constructor
     */
    var BrowserView = function(container) {

        this.name = 'browser';

        /**
         * @type {Array.<BrowserItemData>}
         */
        this._items = [];

        // Invoke View constructor
        var basePrototype = Object.getPrototypeOf(this.constructor.prototype);

        basePrototype.constructor.call(this, container);
    };

    // Inherit from View
    BrowserView.prototype = Object.create(View.prototype);
    BrowserView.prototype.constructor = BrowserView;

    /**
     * @typedef BrowserItemType
     * @type {Object}
     * @property {name}
     * @property {previewConstructor}
     * @property {fullviewConstructor}
     */

    /**
     * @param {BrowserItemType} itemType
     * @return {BrowserView} instance
     */
    BrowserView.prototype.registerItemType = function(itemType) {

        this._itemTypes = this._itemTypes || {};

        this._itemTypes[itemType.name] = itemType;

        return this;
    };

    /**
     * @param {Array.<BrowserItemData>} items
     */
    BrowserView.prototype.addItems = function(items) {

        this._items = this._items.concat(items);

        return this;
    };

    /**
     * Renders BrowserView view
     * @param {string} title
     * @param {string} items - HTML 
     * @override
     */
    BrowserView.prototype.getTemplate = function(title, items) {

        return '<div class="browser__popup"></div>' +
               '<ul class="browser__list"></ul>';
    };

    /**
     * @inheritdoc
     * @override
     */
    BrowserView.prototype.render = function() {

        // Invoke View constructor
        var basePrototype = Object.getPrototypeOf(this.constructor.prototype);
        basePrototype.render.call(this);
        
        this.renderList();

        this.attachToContainer();

        return this;
    };

    /**
     * Renders pictures
     */
    BrowserView.prototype.renderList = function() {

        this._itemViews = [];

        this._items.forEach(function(item) {

            var ItemView = this.getItemConstructor(item.type, 'preview');

            this._itemViews.push(new ItemView(this.elem('list'), item.data));

        }, this);
    };

    /**
     * Returns item constructor BrowserItemType
     * @param {string} type - BrowserItem type name
     * @param {('preview'|'fullview')} mode - BrowserItem constructor mode
     * @returns {Function}
     */
    BrowserView.prototype.getItemConstructor = function(type, mode) {

        var itemType = this._itemTypes[type] || this._itemTypes['default'],
            modesMap = {
                preview:  'previewConstructor',
                fullview: 'fullviewConstructor'
            };

        return itemType[modesMap[mode]];
    };

    /**
     * @class BrowserItemData
     * @param {string} [type] Item type
     * @param {Object} data Item data object
     * @constructor
     */
    var BrowserItemData = function(type, data) {

        if (typeof type === 'object') {
            data = type;
            type = 'default'
        }

        this.data = data;
        this.type = type;
    };

    /**
     * @class PictureView
     * @param {HTMLElement} container
     * @param {Object} data
     * @constructor
     */
    var PictureView = function(container, data) {

        data = data || {};

        var basePrototype = Object.getPrototypeOf(this.constructor.prototype);

        this.tag = 'li';
        this.name = 'picture';

        this.counter = 0;

        // Invoke View constructor
        basePrototype.constructor.call(this, container);

        this.path = data.path;
        this.title = data.title || '';
        
        this.render();
    };

    // Inherit from observable
    PictureView.prototype = Object.create(View.prototype);
    PictureView.prototype.constructor = PictureView;

    PictureView.prototype.getTemplate = function(title, items) {

        return '<div class="picture__title"></div>' +
               '<div class="picture__counter"></div>' +
               '<div class="picture__image"></div>';
    };

    /**
     * @inheritdoc
     * @override
     */
    PictureView.prototype.render = function() {

        // Invoke View constructor
        var basePrototype = Object.getPrototypeOf(this.constructor.prototype);
        basePrototype.render.call(this);

        this.elem('image').style.backgroundImage = 'url(images/' + this.path + ')';
        this.elem('image').addEventListener('click', this._clickHandler.bind(this));
        
        this.elem('title').innerHTML = this.title;

        this.renderCounter();

        this.attachToContainer();

        return this;
    };

    /**
     * @param {MouseEvent} e
     */
    PictureView.prototype._clickHandler = function(e) {

        this.counter++;
        this.renderCounter();
    };

    /**
     * Updates counter
     */
    PictureView.prototype.renderCounter = function() {

        this.elem('counter').innerHTML = this.counter;
    };

}(window));
