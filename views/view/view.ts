declare var document: Document;

interface EventDeclaration {
    event: string;
    selector: string;
    callback(): void;
}

var BEM_DELIMITER = '_';

export class View {

    public name: string = 'view';

    public tag: string = 'div';

    public events: Array<EventDeclaration>;

    public data: any;

    /**
     * Link to elem that is built with this._rebuildCurrentElem()
     * May be not attached to DOM
     */
    private _currentElem;

    /**
     * Link to elem that is attached to DOM
     */
    private _publishedElem;

    private _container;

    private _childViews: Array<View>;

    public get childViews() {
        return this._childViews;
    }

    constructor(container, data?) {
        this.events = this.events || [];
        this.data = data || {};
        this._currentElem = null;
        this._publishedElem = null;
        this._childViews = [];
        this._container = container;
    }

    destroy() {
        this._destroyChildViews();
        this.detachEventsFrom(this._currentElem);
    }

    /**
     * Renders views elem and attaches/updates it to DOM
     * @param data
     */
    render() {

        this._rebuildCurrentElem(this.data);

        // Rendering this view for the first time
        if (this._publishedElem === null) {

            this._container.appendChild(this._currentElem);

            // Update existing DOM HTMLElement of this view
        } else if (this._publishedElem instanceof HTMLElement) {

            this._container.replaceChild(this._currentElem, this._publishedElem);
        }

        this._updatePublishedElem();
    }

    /**
     * Returns elem
     * Should be implemented at descendant classes
     * @param data
     */
    buildBlock(data?: any): HTMLElement {
        this._currentElem = document.createElement(this.tag);
        this._currentElem.classList.add(this.name);
        return this._currentElem;
    }

    buildElem(elemName: string, tag?: string) {
        var elem = document.createElement(tag || 'div');
        elem.classList.add(this.name + BEM_DELIMITER + elemName);
        return elem;
    }

    /**
     * Wrapper for child views creation
     * @param viewInstance
     * @returns {any}
     */
    createSubView(viewInstance): View {
        this._childViews.push(viewInstance);
        return viewInstance;
    }

    getChildView(index: number): View{
        return this._childViews[index];
    }

    /**
     * Attaches events to elem
     * @param node
     */
    attachEventsTo(node: HTMLElement) {
        this.events.forEach((eventDecl) => {
            var targetNode = eventDecl.selector ? node.querySelector(eventDecl.selector) : node;
            targetNode.addEventListener(eventDecl.event, eventDecl.callback);
        });
    }

    /**
     * Dettaches events from elem
     * @param node
     * @private
     */
    detachEventsFrom(node: HTMLElement) {
        this.events.forEach((eventDecl) => {
            var targetNode = eventDecl.selector ? node.querySelector(eventDecl.selector) : node;
            targetNode.removeEventListener(eventDecl.event, eventDecl.callback);
        });
    }

    /**
     * Completely rebuilds views elem (including child views) and puts it to this._currentElem
     * @param data
     * @private
     */
    private _rebuildCurrentElem(data: any) {

        this._destroyChildViews();

        // Detach events from currentNode
        if (this._currentElem instanceof HTMLElement) {
            this.detachEventsFrom(this._currentElem);
        }

        this._currentElem = this.buildBlock(data);
    }

    /**
     * Keep this._publishedElem property up to date for current view and child views
     * @private
     */
    private _updatePublishedElem() {

        this._publishedElem = this._currentElem;

        this._childViews.forEach((childView) => {
            childView._updatePublishedElem();
        });
    }

    /**
     * Destroys child views
     * @private
     */
    private _destroyChildViews() {
        while (this._childViews.length > 0) {
            this._childViews.shift().destroy();
        }
    }
}
