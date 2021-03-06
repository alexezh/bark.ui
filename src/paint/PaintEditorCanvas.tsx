import * as React from 'react';
import _ from "lodash";

import PaperCanvas from './PaperCanvas'
import PaintEditorToolbar from './PaintEditorToolbar'
import PaintEditorSidebar from './PaintEditorSidebar'
import { IPaperEditor, PaperEditor } from './PaperEditor';
import PaintEditorCostumePane from './PaintEditorCostumePane';
import workspace from '../Workspace';
import * as bark from 'bark-core';

//import { addLocaleData } from 'react-intl';

// import PaintEditor from '..';
// scratch-render-fonts is a playground-only dep. Fonts are expected to be imported
// as a peer dependency, otherwise there will be two copies of them.

//const PaintEditor = window['scratch-paint'].PaintEditor;
//const ScratchPaintReducer = window['scratch-paint'].ScratchPaintReducer;

const svgString =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
  ' x="0px" y="0px" width="32px" height="32px" viewBox="0.5 384.5 32 32"' +
  ' enable-background="new 0.5 384.5 32 32" xml:space="preserve">' +
  '<path fill="none" stroke="#000000" stroke-width="3" stroke-miterlimit="10" d="M7.5,392.241h7.269' +
  'c4.571,0,8.231,5.555,8.231,10.123v7.377"/>' +
  '<polyline points="10.689,399.492 3.193,391.997 10.689,384.5 "/>' +
  '<polyline points="30.185,405.995 22.689,413.491 15.192,405.995 "/>' +
  '</svg>';

export interface IPaintCanvasProps {
  onClose: any;
}

export interface IPaintCanvasState {
  sprite: bark.SpriteDef;
  costume: bark.CostumeDef;
  imageId?: string;
}

export default class PaintEditorCanvas extends React.Component<IPaintCanvasProps, IPaintCanvasState> {
  private paintEditor: PaperEditor;
  constructor(props: IPaintCanvasProps) {
    super(props);

    this.paintEditor = new PaperEditor();

    _.bindAll(this, [
      'onEditorStateChange',
      'onCostumePaneChange',
      'onSpriteSelected',
    ]);

    console.log(typeof workspace);
    let sprite = workspace.lastEditedSprite;

    this.paintEditor.setState({ imageSource: sprite.firstCostume.id });

    this.state = {
      sprite: sprite,
      costume: sprite.firstCostume,
      imageId: sprite.firstCostume.id,
    }
  }

  componentDidMount() {
    this.paintEditor.registerStateChange('PaintEditorCanvas', this.onEditorStateChange);
  }
  componentWillUnmount() {
    this.paintEditor.unregisterStateChange('PaintEditorCanvas');
  }

  /**
   * canvas is the object which knows that we are editing particular sprite / costume
   * when image changes, it updates the image. Technically, this can be done by a separate component 'ProjectEditor'
   * but for now it is fine to have on canvas
   */
  public onEditorStateChange() {
    if (this.state.imageId !== this.paintEditor.state.image?.imageId) {
      if (this.paintEditor.state.image !== undefined) {
        this.state.costume.updateImage(this.paintEditor.state.image);
      }

      this.setState({ imageId: this.paintEditor.state.image?.imageId })
    }
  }

  private onSpriteSelected(sprite: bark.SpriteDef) {
    console.log('select sprite:' + sprite.id);
    this.setState({ sprite: sprite, costume: sprite.firstCostume });
    workspace.lastEditedSprite = sprite;
    this.paintEditor.setImage(sprite.firstCostume.id, sprite.firstCostume.imageData);
  }

  private onSidebarChange(costume: bark.CostumeDef) {
    console.log('select costume:' + costume.id);
    // this.setState({ costume: costume });
  }

  private onCostumePaneChange(costume: bark.CostumeDef) {
    console.log('select costume:' + costume.id);
    this.setState({ costume: costume });
    this.paintEditor.setImage(costume.id, costume.imageData);
  }

  public render() {
    return (
      <div className="PaintEditor-canvas">
        <PaintEditorToolbar
          sprite={this.state.sprite}
          onClose={this.props.onClose}
          onChange={this.onSpriteSelected}
          editor={this.paintEditor} />
        <div className="PaintEditor-workarea">
          <PaintEditorSidebar
            sprite={this.state.sprite}
            onClose={this.props.onClose}
            onChange={this.onSidebarChange}
            paintEditor={this.paintEditor} />
          <PaperCanvas
            editor={this.paintEditor}
            imageFormat={this.paintEditor.state.imageFormat}
            imageSource={this.paintEditor.state.imageSource}
          />
          <PaintEditorCostumePane
            sprite={this.state.sprite}
            onChange={this.onCostumePaneChange}
          />
        </div>
      </div>
    );
  }
}

/*

class Playground extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      'downloadImage',
      'handleUpdateName',
      'handleUpdateImage',
      'onUploadImage'
    ]);
    // Append ?dir=rtl to URL to get RTL layout
    const match = location.search.match(/dir=([^&]+)/);
    const rtl = match && match[1] == 'rtl';
    this.id = 0;
    this.state = {
      name: 'meow',
      rotationCenterX: 20,
      rotationCenterY: 400,
      imageFormat: 'svg', // 'svg', 'png', or 'jpg'
      image: svgString, // svg string or data URI
      imageId: this.id, // If this changes, the paint editor will reload
      rtl: rtl,
    };
    this.reusableCanvas = document.createElement('canvas');
  }
  handleUpdateName(name) {
    this.setState({ name });
  }
  handleUpdateImage(isVector, image, rotationCenterX, rotationCenterY) {
    this.setState({
      imageFormat: isVector ? 'svg' : 'png'
    });
    if (!isVector) {
      console.log(`Image width: ${image.width}    Image height: ${image.height}`);
    }
    console.log(`rotationCenterX: ${rotationCenterX}    rotationCenterY: ${rotationCenterY}`);
    if (isVector) {
      this.setState({ image, rotationCenterX, rotationCenterY });
    } else { // is Bitmap
      // image parameter has type ImageData
      // paint editor takes dataURI as input
      this.reusableCanvas.width = image.width;
      this.reusableCanvas.height = image.height;
      const context = this.reusableCanvas.getContext('2d');
      context.putImageData(image, 0, 0);
      this.setState({
        image: this.reusableCanvas.toDataURL('image/png'),
        rotationCenterX: rotationCenterX,
        rotationCenterY: rotationCenterY
      });
    }
  }
  downloadImage() {
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    const format = this.state.imageFormat;
    let data = this.state.image;
    if (format === 'png' || format === 'jpg') {
      data = this.b64toByteArray(data);
    } else {
      data = [data];
    }
    const blob = new Blob(data, { type: format });
    const filename = `${this.state.name}.${format}`;
    if ('download' in HTMLAnchorElement.prototype) {
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.type = blob.type;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    } else {
      // iOS Safari, open a new page and set href to data-uri
      let popup = window.open('', '_blank');
      const reader = new FileReader();
      reader.onloadend = function () {
        popup.location.href = reader.result;
        popup = null;
      };
      reader.readAsDataURL(blob);
    }
    document.body.removeChild(downloadLink);
  }
  b64toByteArray(b64Data, sliceSize = 512) {
    // Remove header
    b64Data = b64Data.substring(b64Data.indexOf('base64,') + 7);

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return byteArrays;
  }
  uploadImage() {
    document.getElementById(styles.fileInput).click();
  }
  onUploadImage(event) {
    var file = event.target.files[0];
    var type = file.type === 'image/svg+xml' ? 'svg' :
      file.type === 'image/png' ? 'png' :
        file.type === 'image/jpg' ? 'jpg' :
          file.type === 'image/jpeg' ? 'jpg' :
            null;

    var reader = new FileReader();
    if (type === 'svg') {
      reader.readAsText(file, 'UTF-8');
    } else if (type === 'png' || type === 'jpg') {
      reader.readAsDataURL(file);
    } else {
      alert("Couldn't read file type: " + file.type);
    }

    const that = this;
    reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!

      that.setState({
        image: content,
        name: file.name.split('.').slice(0, -1).join('.'),
        imageId: ++that.id,
        imageFormat: type,
        rotationCenterX: undefined,
        rotationCenterY: undefined,
      });
    }
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <PaintEditor
          {...this.state}
          onUpdateName={this.handleUpdateName}
          onUpdateImage={this.handleUpdateImage}
        />
        <button className={styles.playgroundButton} onClick={this.uploadImage}>Upload</button>
        <input id={styles.fileInput} type="file" name="name" onChange={this.onUploadImage} />
        <button className={styles.playgroundButton} onClick={this.downloadImage}>Download</button>
      </div>
    );
  }

}

*/
