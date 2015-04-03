(function(window) {

    'use strict';

    var doc = window.document,
        body = doc.querySelector('body');

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

        var pictures = this.getPictureItems(container);

        this.browser = new BrowserView();

        this.browser
            
            .registerItemType({
                name: 'picture',
                previewConstructor:  PictureThumbView,
                fullviewConstructor: PictureFullView
            })
            
            .addItems(pictures)
            
            .toContainer(container);
    };

    /**
     * @param {HTMLElement} container
     * @return {Array.<BrowserItemData>}
     */
    App.prototype.getPictureItems = function(container) {
        
        var pictures = container.getAttribute('data-pictures').split(',');

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
     * @constructor
     */
    var View = function() {
        
        // Invoke Observable constructor
        Observable.call(this);
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
    View.prototype.toContainer = function(container) {

        var domElem = this.buildDomElem();

        // View is being rendered for the first time
        if (!this.publishedDomElem) {

            container.appendChild(domElem);

        } else {

            this.detachEventListeners(this.publishedDomElem);
            container.replaceChild(domElem, this.publishedDomElem);
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

    /**
     * Event listeners attacher. Should be called after domElem was build
     * @param {HTMLElement} domElem
     * @return {View} instance
     */
    View.prototype.attachEventListeners = function(domElem) {
        return this;
    };

    /**
     * Event listeners detacher. Should be called before domElem is going to be removed from the DOM
     * @param {HTMLElement} domElem
     * @return {View} instance
     */
    View.prototype.detachEventListeners = function(domElem) {
        return this;
    };

    //==========================================================================================================================================================================

    /**
     * @class PopupView
     * @constructor
     */
    var PopupView = function(browser) {

        this._setName('popup');

        View.call(this);
    };

    // Inherit from View
    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    /**
     * Renders BrowserView view
     * @param {string} title
     * @param {string} items - HTML 
     * @override
     */
    PopupView.prototype.getTemplate = function(title, items) {

        return '<div class="popup__popup">' + 
                   '<div class="popup__close">close</div>' + 
                   '<div class="popup__content"></div>' + 
               '</div>';
    };

    PopupView.prototype.setContent = function(content) {
        
        this.elem(this.publishedDomElem, 'content').appendChild(content);
    };

    //==========================================================================================================================================================================

    /**
     * @class BrowserView
     * @param {Array.<string>} pictures
     * @constructor
     */
    var BrowserView = function() {

        this._setName('browser');

        /**
         * @type {Array.<BrowserItemData>}
         */
        this._items = [];

        this._itemsViews = [];

        View.call(this);
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

        this._itemsViews = this._itemsViews.concat(this.buildItemsViews(items));

        return this;
    };

    BrowserView.prototype.buildItemsViews = function(items) {    
    
        return items.map(function(item) {

            var ItemView = this.getItemConstructor(item.type, 'preview');
            
            return new ItemView(this, item.data);

        }, this);
    };

    /**
     * Renders BrowserView view
     * @param {string} title
     * @param {string} items - HTML 
     * @override
     */
    BrowserView.prototype.getTemplate = function(title, items) {

        return '<ul class="browser__list"></ul>';
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

        this.attachEventListeners(domElem);

        return domElem;
    };

    /**
     * Renders pictures
     * @param {HTMLElement} domElem
     */
    BrowserView.prototype.populateDomElemWithListItems = function(domElem) {

        this._itemsViews.forEach(function(itemView) {
            itemView.toContainer(domElem);
        });
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

    
    BrowserView.prototype.showFullView = function(itemData) {

        var ItemFullView = this.getItemConstructor('picture', 'fullview'),
            itemFullView = new ItemFullView(itemData),
            popup = new PopupView();

        popup.toContainer(body);

        popup.setContent(itemFullView.buildDomElem());
    }

    //==========================================================================================================================================================================

    /**
     * @class BrowserItemView
     * @param {BrowserView} browser
     * @constructor
     */
    var BrowserItemView = function(browser) {

        this._setName('browser-item');

        View.call(this);

        this.browser = browser;
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
     * @param {BrowserView} browser
     * @param {Object} data
     * @constructor
     */
    var PictureThumbView = function(browser, data) {

        data = data || {};

        this.tag = 'li';

        this._setName('picture-thumb');

        BrowserItemView.call(this, browser);

        this.counter = 0;

        this.data = data;
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

        this.elem(domElem, 'image').style.backgroundImage = 'url(images/' + this.data.path + ')';
        
        this.elem(domElem, 'title').innerHTML = this.data.title || '';

        this.attachEventListeners(domElem);

        return domElem;
    };

    /**
     * @param {MouseEvent} e
     */
    PictureThumbView.prototype._clickHandler = function(e) {
        this.browser.showFullView(this.data);
    };

    PictureThumbView.prototype.attachEventListeners = function(domElem) {

        this._bindedClickHandler = this._clickHandler.bind(this);

        this.elem(domElem, 'image').addEventListener('click', this._bindedClickHandler);
        return this;
    };

    PictureThumbView.prototype.removeEventListeners = function(domElem) {
        this.elem(domElem, 'image').removeEventListener('click', this._bindedClickHandler);
        return this;
    };    

    //==========================================================================================================================================================================

    /**
     * @class PictureFullView
     * @param {Object} data
     * @constructor
     */
    var PictureFullView = function(data) {

        data = data || {};

        this._setName('picture-full');
        
        View.call(this);
        
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
        this.elem(domElem, 'title').innerHTML = this.title;

        this.updateCounterDomElem(domElem);

        this.attachEventListeners(domElem);

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

    PictureFullView.prototype.attachEventListeners = function(domElem) {

        this._bindedClickHandler = this._clickHandler.bind(this);

        this.elem(domElem, 'image').addEventListener('click', this._bindedClickHandler);
        return this;
    };

    PictureFullView.prototype.removeEventListeners = function(domElem) {
        this.elem(domElem, 'image').removeEventListener('click', this._bindedClickHandler);
        return this;
    };    

}(window));
