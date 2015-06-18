require('./picture.css');

import {controller} from '../../controller';
import {View} from '../view/view'
import {ViewPictureViewer} from '../picture-viewer/picture-viewer';
import {ViewPictureEditor} from '../picture-editor/picture-editor'

export class ViewPicture extends View {

    name = 'view-picture';

    state = {
        mode: 'view'
    };

    events = [
        {
            event: 'click',
            elem: 'edit-button',
            callback: this.switchMode.bind(this, 'edit')
        },
        {
            event: 'click',
            elem: 'cancel-button',
            callback: this.switchMode.bind(this, 'view')
        },
        {
            event: 'click',
            elem: 'save-button',
            callback: this.save.bind(this)
        }
    ];

    viewPictureViewer: ViewPictureViewer;

    viewPictureEditor: ViewPictureEditor;

    buildBlock() {

        var rootElement = super.buildBlock();

        rootElement.appendChild(this._buildViewer());
        rootElement.appendChild(this._buildEditor());

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    switchMode(mode) {

        var rootNode = this.rootNode()

        if (mode === 'edit') {

            this.viewPictureEditor.render();
            rootNode.classList.add('view-picture_mode_editor');
            
        } else {

            this.viewPictureViewer.render();
            rootNode.classList.remove('view-picture_mode_editor');
        }
    }

    save() {
        controller.savePicture(this, this.viewPictureEditor.getData());
    }

    private _buildViewer() {

        var editButton,
            viewerElement;

        viewerElement = this.buildElem('viewer');
        editButton = this.buildElem('edit-button');
        editButton.textContent = 'Edit';
        viewerElement.appendChild(editButton);

        this.viewPictureViewer = <ViewPictureViewer>this.createSubView(new ViewPictureViewer(viewerElement, this.data));
        this.viewPictureViewer.render();

        return viewerElement;
    }

    private _buildEditor() {

        var editorElement = this.buildElem('editor'),
            saveButton = this.buildElem('save-button');

        saveButton.textContent = 'Save';
        editorElement.appendChild(saveButton);

        this.viewPictureEditor = <ViewPictureEditor>this.createSubView(new ViewPictureEditor(editorElement, this.data));
        this.viewPictureEditor.render();

        return editorElement;
    }
}
