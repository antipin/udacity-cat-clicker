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

        var rootElement = super.buildBlock(),
            editButton,
            saveButton,
            innerElement;

        switch (this.state.mode) {

            case 'view':
                innerElement = this.buildElem('viewer');
                editButton = this.buildElem('edit-button');
                editButton.textContent = 'Edit';
                innerElement.appendChild(editButton);

                this.viewPictureViewer = <ViewPictureViewer>this.createSubView(new ViewPictureViewer(innerElement, this.data));
                this.viewPictureViewer.render();

                rootElement.appendChild(innerElement);
                break;

            case 'edit':
                innerElement = this.buildElem('editor');
                saveButton = this.buildElem('save-button');
                saveButton.textContent = 'Save';
                innerElement.appendChild(saveButton);

                this.viewPictureEditor = <ViewPictureEditor>this.createSubView(new ViewPictureEditor(innerElement, this.data));
                this.viewPictureEditor.render();

                rootElement.appendChild(innerElement);
                break;
        }

        this.attachEventsTo(rootElement);

        return rootElement;
    }

    switchMode(mode) {
        this.setState('mode', mode)
            .render();
    }

    save() {
        controller.savePicture(this, this.viewPictureEditor.getData());
    }
}
