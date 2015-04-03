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

    //==========================================================================================================================================================================

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

    //==========================================================================================================================================================================

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
                previewConstructor:  PictureThumbView,
                fullviewConstructor: PictureFullView
            })
            
            .addItems(pictures)
            
            .toContainer();
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

    //==========================================================================================================================================================================

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
    };

    // Inherit from observable
    View.prototype = Object.create(Observable.prototype);
    View.prototype.constructor = View;

    /**
     * Set views name. All names uses as css class names
     * @param {string} name
     * @return {View} instance
     */
    View.prototype._setName = function(name) {

        if (!this.name) {
            this.name = name;   
        }

        this._names = this._names || [];
        this._names.push(name);
    };

    /**
     * Renders view
     * @param {string} [tagName]
     * @return {View} instance
     */
    View.prototype.buildDomElem = function(tagName) {

        var domElem = doc.createElement(this.tag || 'div');

        if (Array.isArray(this._names)) {
            domElem.classList.add.apply(domElem.classList, this._names);
        }

        domElem.innerHTML = this.getTemplate();

        return domElem;
    };

    /**
     * Appends rendered HTMLElement to container
     * @return {View} instance
     */
    View.prototype.toContainer = function() {

        var domElem = this.buildDomElem();

        // View is being rendered for the first time
        if (!this.publishedDomElem) {

            this.container.appendChild(domElem);

        } else {

            this.container.replaceChild(domElem, this.publishedDomElem);
        }

        this.publishedDomElem = domElem;

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
     * @param {HTMLElement} domElem
     * @return {string} element name
     * @return {HTMLElement} 
     */
    View.prototype.elem = function(domElem, elemName) {

        var elemSelector = '.' + this.name + '__' + elemName;

        return domElem.querySelector(elemSelector);
    };

    //==========================================================================================================================================================================

    /**
     * @class BrowserView
     * @param {HTMLElement} container
     * @param {Array.<string>} pictures
     * @constructor
     */
    var BrowserView = function(container) {

        this._setName('browser');

        /**
         * @type {Array.<BrowserItemData>}
         */
        this._items = [];

        View.call(this, container);
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
    BrowserView.prototype.buildDomElem = function() {

        // Invoke View constructor
        var domElem = View.prototype.buildDomElem.call(this),
            listDomElem = this.elem(domElem, 'list');
        
        this.populateDomElemWithListItems(listDomElem);

        return domElem;
    };

    /**
     * Renders pictures
     * @param {HTMLElement} domElem
     */
    BrowserView.prototype.populateDomElemWithListItems = function(domElem) {

        this._items.forEach(function(item) {

            var ItemView = this.getItemConstructor(item.type, 'preview'),
                item = new ItemView(domElem, item.data);

            item.toContainer();

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

    //==========================================================================================================================================================================

    /**
     * @class BrowserItemView
     * @param {HTMLElement} container
     * @constructor
     */
    var BrowserItemView = function(container) {

        this._setName('browser-item');

        View.call(this, container);
    };

    // Inherit from View
    BrowserItemView.prototype = Object.create(View.prototype);
    BrowserItemView.prototype.constructor = BrowserItemView;

    //==========================================================================================================================================================================

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

    //==========================================================================================================================================================================

    /**
     * @class PictureThumbView
     * @param {HTMLElement} container
     * @param {Object} data
     * @constructor
     */
    var PictureThumbView = function(container, data) {

        data = data || {};

        this.tag = 'li';

        this._setName('picture-thumb');

        BrowserItemView.call(this, container);

        this.counter = 0;

        this.path = data.path;
        this.title = data.title || '';
    };

    // Inherit from observable
    PictureThumbView.prototype = Object.create(BrowserItemView.prototype);
    PictureThumbView.prototype.constructor = PictureThumbView;

    PictureThumbView.prototype.getTemplate = function(title, items) {

        return '<div class="picture-thumb__title"></div>' +
               '<div class="picture-thumb__image"></div>';
    };

    /**
     * @inheritdoc
     * @override
     */
    PictureThumbView.prototype.buildDomElem = function() {

        var domElem = BrowserItemView.prototype.buildDomElem.call(this);

        this.elem(domElem, 'image').style.backgroundImage = 'url(images/' + this.path + ')';
        
        this.elem(domElem, 'title').innerHTML = this.title;

        return domElem;
    };

    //==========================================================================================================================================================================

    /**
     * @class PictureFullView
     * @param {HTMLElement} container
     * @param {Object} data
     * @constructor
     */
    var PictureFullView = function(container, data) {

        data = data || {};

        this.tag = 'li';

        this._setName('picture-full');
        
        View.call(this, container);
        
        this.counter = 0;

        this.path = data.path;
        this.title = data.title || '';
    };

    // Inherit from observable
    PictureFullView.prototype = Object.create(View.prototype);
    PictureFullView.prototype.constructor = PictureFullView;

    PictureFullView.prototype.getTemplate = function(title, items) {

        return '<div class="picture-full__title"></div>' +
               '<div class="picture-full__counter"></div>' +
               '<div class="picture-full__image"></div>';
    };

    /**
     * @inheritdoc
     * @override
     */
    PictureFullView.prototype.buildDomElem = function() {

        var domElem = View.prototype.buildDomElem.call(this);

        this.elem(domElem, 'image').style.backgroundImage = 'url(images/' + this.path + ')';
        this.elem(domElem, 'image').addEventListener('click', this._clickHandler.bind(this));
        
        this.elem(domElem, 'title').innerHTML = this.title;

        this.updateCounterDomElem(domElem);

        return domElem;
    };

    /**
     * @param {MouseEvent} e
     */
    PictureFullView.prototype._clickHandler = function(e) {

        this.counter++;
        this.updateCounterDomElem(this.publishedDomElem);
    };

    /**
     * Updates counter
     */
    PictureFullView.prototype.updateCounterDomElem = function(domElem) {

        this.elem(domElem, 'counter').innerHTML = this.counter;
    };

}(window));
