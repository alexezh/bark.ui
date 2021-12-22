import _ from 'lodash';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import { getRaster, hideGuideLayers, showGuideLayers } from '../tools/layer';
import Modes, { BitmapModes } from '../lib/modes';
import log from '../log/log';
import Formats, { isBitmap, isVector } from '../lib/format';
import { commitOvalToBitmap, commitRectToBitmap, commitSelectionToBitmap, getHitBounds } from '../tools/bitmap';
import { scaleWithStrokes } from '../tools/math';
import Cursors from '../lib/cursors';
import { StateStore } from './StateStore';
import { ART_BOARD_HEIGHT, ART_BOARD_WIDTH, setWorkspaceBounds, SVG_ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH } from '../tools/view';
import GradientTypes from '../lib/gradient-types';
import BitBrushModeCommand, { BitBrushModeCommand_commandId } from './bit-brush-mode/bit-brush-mode';
import BitLineModeCommand, { BitLineModeCommand_commandId } from './bit-line-mode/bit-line-mode';
import BitOvalModeCommand, { BitOvalModeCommand_commandId } from './bit-oval-mode/bit-oval-mode';
import BitSelectModeCommand, { BitSelectModeCommand_commandId } from './bit-select-mode/bit-select-mode';
import BitTextModeCommand, { BitTextModeCommand_commandId } from './bit-text-mode/bit-text-mode';
import { DEFAULT_COLOR } from '../tools/colors';


export class Color {
  public primary: string | null = null;
  public secondary: string | null = null;
  public gradientType: any = GradientTypes.SOLID;

  public constructor(primary: string | null, secondary: string | null = null, gradientType: any = GradientTypes.SOLID) {
    this.primary = primary;
    this.secondary = secondary;
    this.gradientType = gradientType;
  }
};

/*
onst BitLineComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitLineComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

const redrawSelectionBox = function () {
    return {
        type: REDRAW_SELECTION_BOX
    };
};

 */
export interface IPaintEditor {
  get mode(): any; // Modes
  get imageFormat(): string;
  get color(): Color;
  get bitBrushSize(): any;
  get filled(): boolean;
  get thickness(): number;
  get zoom(): number;
  get selectedItems(): [];

  registerStateChange(name: string, onChange: any);
  unregisterStateChange(name: string);

  setState(props: {});
  getCommand(key: string): any;

  handleUpdateImage(skipSnapshot, formatOverride);
  handleSetCursor(cursorString: string);
  handleSetSelectedItems(selectedItems: [], bitmapMode: any);
  handleClearSelectedItems();
}

/*
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_LINE));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }

*/


export class PaintEditor implements IPaintEditor {

  private stateStore: StateStore;

  private commands: { [key: string]: any } = {};

  /* selected items managed by paper tools
   * not stored in state since they can change while drawing happens
   */
  private _selectedItems: [] = [];

  public constructor() {
    this.stateStore = new StateStore({
      imageFormat: 'svg',
      mode: Modes.SELECT,
      color: new Color(DEFAULT_COLOR),
      rotationCenterX: undefined,
      rotationCenterY: undefined,
      filled: false,
      thickness: 1.0,
      cusros: Cursors.DEFAULT,
      zoom: 1.0,
    });

    this.commands[BitBrushModeCommand_commandId] = new BitBrushModeCommand(this);
    this.commands[BitLineModeCommand_commandId] = new BitLineModeCommand(this);
    this.commands[BitOvalModeCommand_commandId] = new BitOvalModeCommand(this);
    this.commands[BitSelectModeCommand_commandId] = new BitSelectModeCommand(this);
    this.commands[BitTextModeCommand_commandId] = new BitTextModeCommand(this);

    _.bindAll(this, [
      'handleUpdateImage',
      'handleSetSelectedItems',
      'handleClearSelectedItems',
      'handleSetCursor'
    ]);

    this.handleUpdateImage.bind(this);
  }

  public getCommand(key: string): any {
    return this.commands[key];
  }

  // @ts-ignore
  public get mode() { return this.stateStore.state.mode };

  // @ts-ignore
  public get imageFormat() { return this.stateStore.state.imageFormat };

  // @ts-ignore
  public get color(): Color { return this.stateStore.state.color };

  // @ts-ignore
  public get bitBrushSize() { return this.stateStore.state.bitBrushSize };

  // @ts-ignore
  public get filled(): boolean { return this.stateStore.state.filled };

  // @ts-ignore
  public get thickness(): number { return this.stateStore.state.thickness };

  // @ts-ignore
  public get zoom(): number { return this.stateStore.state.zoom };

  // @ts-ignore
  public get selectedItems(): [] { return this.stateStore._selectedItems };

  public setState(state: {}) {
    this.stateStore.setState(state);
  }
  public registerStateChange(name: string, onChange: any) {
    this.stateStore.registerStateChange(name, onChange);
  }

  public unregisterStateChange(name: string) {
    this.stateStore.unregisterStateChange(name);
  }

  private updateImageState(isVector, image, rotationCenterX, rotationCenterY) {
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
      /*
      this.reusableCanvas.width = image.width;
      this.reusableCanvas.height = image.height;
      const context = this.reusableCanvas.getContext('2d');
      context.putImageData(image, 0, 0);
      this.setState({
          image: this.reusableCanvas.toDataURL('image/png'),
          rotationCenterX: rotationCenterX,
          rotationCenterY: rotationCenterY
      });
      */
    }
  }

  /**
   * @param {?boolean} skipSnapshot True if the call to update image should not trigger saving
   * an undo state. For instance after calling undo.
   * @param {?Formats} formatOverride Normally the mode is used to determine the format of the image,
   * but the format used can be overridden here. In particular when converting between formats,
   * the does not accurately represent the format.
   */
  public handleUpdateImage(skipSnapshot, formatOverride) {
    // If in the middle of switching formats, rely on the current mode instead of format.
    const actualFormat = formatOverride ? formatOverride :
      BitmapModes[this.mode] ? Formats.BITMAP : Formats.VECTOR;
    if (isBitmap(actualFormat)) {
      this.handleUpdateBitmap(skipSnapshot);
    } else if (isVector(actualFormat)) {
      this.handleUpdateVector(skipSnapshot);
    }
    // Any time an image update is made, recalculate the bounds of the artwork
    // @ts-ignore
    setWorkspaceBounds();
    //this.state.updateViewBounds(paper.view.matrix);
  }

  public handleSetCursor(cursorString: string) {
    this.stateStore.setState({ cursor: cursorString });
  }

  public handleSetSelectedItems(selectedItems: [], bitmapMode: any) {
    // this.stateStore.setState({ selectedItems: selectedItems });
    this._selectedItems = selectedItems;
  }

  public handleClearSelectedItems() {
    //    this.stateStore.setState({ selectedItems: [] });
    this._selectedItems = [];
  }

  private handleUpdateBitmap(skipSnapshot) {
    // @ts-ignore
    if (!getRaster().loaded) {
      // In general, callers of updateImage should wait for getRaster().loaded = true before
      // calling updateImage.
      // However, this may happen if the user is rapidly undoing/redoing. In this case it's safe
      // to skip the update.
      log.warn('Bitmap layer should be loaded before calling updateImage.');
      return;
    }
    // Anything that is selected is on the vector layer waiting to be committed to the bitmap layer.
    // Plaster the selection onto the raster layer before exporting, if there is a selection.
    // @ts-ignore
    const plasteredRaster = getRaster().getSubRaster(getRaster().bounds); // Clone the raster layer
    plasteredRaster.remove(); // Don't insert
    const selectedItems = getSelectedLeafItems();
    if (selectedItems.length === 1) {
      const item = selectedItems[0];
      if (item instanceof paper.Raster) {
        if (!item.loaded ||
          (item.data &&
            item.data.expanded &&
            !item.data.expanded.loaded)) {
          // This may get logged when rapidly undoing/redoing or changing costumes,
          // in which case the warning is not relevant.
          log.warn('Bitmap layer should be loaded before calling updateImage.');
          return;
        }
        commitSelectionToBitmap(item, plasteredRaster);
      } else if (item instanceof paper.Shape && item.type === 'rectangle') {
        // @ts-ignore
        commitRectToBitmap(item, plasteredRaster);
      } else if (item instanceof paper.Shape && item.type === 'ellipse') {
        commitOvalToBitmap(item, plasteredRaster);
      } else if (item instanceof paper.PointText) {
        // @ts-ignore
        const bounds = item.drawnBounds;
        // @ts-ignore
        const textRaster = item.rasterize(72, false /* insert */, bounds);
        plasteredRaster.drawImage(
          textRaster.canvas,
          new paper.Point(Math.floor(bounds.x), Math.floor(bounds.y))
        );
      }
    }
    const rect = getHitBounds(plasteredRaster);

    // Use 1x1 instead of 0x0 for getting imageData since paper.js automagically
    // returns the full artboard in the case of getImageData(0x0).
    // Bitmaps need a non-zero width/height in order to be saved as PNG.
    if (rect.width === 0 || rect.height === 0) {
      rect.width = rect.height = 1;
    }

    const imageData = plasteredRaster.getImageData(rect);

    this.updateImageState(
      false /* isVector */,
      imageData,
      (ART_BOARD_WIDTH / 2) - rect.x,
      (ART_BOARD_HEIGHT / 2) - rect.y);

    if (!skipSnapshot) {
      // performSnapshot(this.state.undoSnapshot, Formats.BITMAP);
    }
  }

  private handleUpdateVector(skipSnapshot) {
    // Remove viewbox (this would make it export at MAX_WORKSPACE_BOUNDS)
    let workspaceMask;

    // @ts-ignore
    if (paper.project.activeLayer.clipped) {
      // @ts-ignore
      for (const child of paper.project.activeLayer.children) {
        if (child.isClipMask()) {
          workspaceMask = child;
          break;
        }
      }
      // @ts-ignore
      paper.project.activeLayer.clipped = false;
      workspaceMask.remove();
    }
    const guideLayers = hideGuideLayers(true /* includeRaster */);

    // Export at 0.5x
    // @ts-ignore
    scaleWithStrokes(paper.project.activeLayer, .5, new paper.Point());

    // @ts-ignore
    const bounds = paper.project.activeLayer.drawnBounds;

    // `bounds.x` and `bounds.y` are relative to the top left corner,
    // but if there is no content in the active layer, they default to 0,
    // making the "Scratch space" rotation center ((SVG_ART_BOARD_WIDTH / 2), (SVG_ART_BOARD_HEIGHT / 2)),
    // aka the upper left corner. Special-case this to be (0, 0), which is the center of the art board.
    const centerX = bounds.width === 0 ? 0 : (SVG_ART_BOARD_WIDTH / 2) - bounds.x;
    const centerY = bounds.height === 0 ? 0 : (SVG_ART_BOARD_HEIGHT / 2) - bounds.y;

    this.updateImageState(
      true /* isVector */,
      // @ts-ignore
      paper.project.exportSVG({
        asString: true,
        bounds: 'content',
        matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
      }),
      centerX,
      centerY);

    // @ts-ignore
    scaleWithStrokes(paper.project.activeLayer, 2, new paper.Point());
    // @ts-ignore
    paper.project.activeLayer.applyMatrix = true;

    showGuideLayers(guideLayers);

    // Add back viewbox
    if (workspaceMask) {
      // @ts-ignore
      paper.project.activeLayer.addChild(workspaceMask);
      workspaceMask.clipMask = true;
    }

    if (!skipSnapshot) {
      //performSnapshot(this.state.undoSnapshot, Formats.VECTOR);
    }
  }
}

