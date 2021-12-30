import _ from 'lodash';
import paper from 'paper';
import { clearSelection, getSelectedLeafItems } from './tools/selection';
import { getRaster, hideGuideLayers, showGuideLayers } from './tools/layer';
import Modes, { BitmapModes } from './lib/modes';
import log from './log/log';
import Formats, { isBitmap, isVector } from './lib/format';
import { commitOvalToBitmap, commitRectToBitmap, commitSelectionToBitmap, getHitBounds } from './tools/bitmap';
import { scaleWithStrokes } from './tools/math';
import Cursors from './lib/cursors';
import { StateStore } from '../StateStore';
import { ART_BOARD_HEIGHT, ART_BOARD_WIDTH, setWorkspaceBounds, SVG_ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH } from './tools/view';
import GradientTypes from './lib/gradient-types';
import { DEFAULT_COLOR } from './tools/colors';
import BitBrushModeCommand, { BitBrushModeCommand_commandId } from './ui/bit-brush-mode/bit-brush-mode';
import BitLineModeCommand, { BitLineModeCommand_commandId } from './ui/bit-line-mode/bit-line-mode';
import BitRectModeCommand, { BitRectModeCommand_commandId } from './ui/bit-rect-mode/bit-rect-mode';
import BitEraserModeCommand, { BitEraserModeCommand_commandId } from './ui/bit-eraser-mode/bit-eraser-mode';
import BitOvalModeCommand, { BitOvalModeCommand_commandId } from './ui/bit-oval-mode/bit-oval-mode';
import BitSelectModeCommand, { BitSelectModeCommand_commandId } from './ui/bit-select-mode/bit-select-mode';
import BitTextModeCommand, { BitTextModeCommand_commandId } from './ui/bit-text-mode/bit-text-mode';
import RectModeCommand, { RectModeCommand_commandId } from './ui/rect-mode/rect-mode';
import OvalModeCommand, { OvalModeCommand_commandId } from './ui/oval-mode/oval-mode';
import LineModeCommand, { LineModeCommand_commandId } from './ui/line-mode/line-mode';
import FillModeCommand, { FillModeCommand_commandId } from './ui/fill-mode/fill-mode';
import BrushModeCommand, { BrushModeCommand_commandId } from './ui/brush-mode/brush-mode';
import * as project from 'bark-core';

export class BrushMode {
  public brushSize: any = 1;
}

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

export class ColorState {
  public fillColor1: Color | null = null;
  public fillColor2: Color | null = null;
  public fillGradient: Color | null = null;
  public strokeColor1: Color | null = null;
  public strokeColor2: Color | null = null;
  public strokeGradient: Color | null = null;

  public validate() {
    /*
        validateColorState() {
            // Make sure that at least one of fill/stroke is set, and that MIXED is not one of the colors.
            // If fill and stroke color are both missing, set fill to default and stroke to transparent.
            // If exactly one of fill or stroke color is set, set the other one to transparent.
            const { strokeWidth } = this.props.colorState;
            const fillColor1 = this.props.colorState.fillColor.primary;
            let fillColor2 = this.props.colorState.fillColor.secondary;
            let fillGradient = this.props.colorState.fillColor.gradientType;
            const strokeColor1 = this.props.colorState.strokeColor.primary;
            let strokeColor2 = this.props.colorState.strokeColor.secondary;
            let strokeGradient = this.props.colorState.strokeColor.gradientType;
    
            if (fillColor2 === MIXED) {
                this.props.clearFillGradient();
                fillColor2 = null;
                fillGradient = GradientTypes.SOLID;
            }
            if (strokeColor2 === MIXED) {
                this.props.clearStrokeGradient();
                strokeColor2 = null;
                strokeGradient = GradientTypes.SOLID;
            }
    
            const fillColorMissing = fillColor1 === MIXED ||
                (fillGradient === GradientTypes.SOLID && fillColor1 === null) ||
                (fillGradient !== GradientTypes.SOLID && fillColor1 === null && fillColor2 === null);
            const strokeColorMissing = strokeColor1 === MIXED ||
                strokeWidth === null ||
                strokeWidth === 0 ||
                (strokeGradient === GradientTypes.SOLID && strokeColor1 === null) ||
                (strokeGradient !== GradientTypes.SOLID && strokeColor1 === null && strokeColor2 === null);
    
            if (fillColorMissing && strokeColorMissing) {
                this.props.onChangeFillColor(DEFAULT_COLOR);
                this.props.clearFillGradient();
                this.props.onChangeStrokeColor(null);
                this.props.clearStrokeGradient();
            } else if (fillColorMissing && !strokeColorMissing) {
                this.props.onChangeFillColor(null);
                this.props.clearFillGradient();
            } else if (!fillColorMissing && strokeColorMissing) {
                this.props.onChangeStrokeColor(null);
                this.props.clearStrokeGradient();
            }
        }
        */
  }
}

/**
 * observable state used by controls
 */
export interface IPaperEditorState {
  get format(): string; // seems to be the same as mode
  get imageFormat(): string;
  get mode(): any; // current editing tool
  get color(): Color;
  get colorState(): ColorState;
  get brushMode(): BrushMode;
  get bitBrushSize(): number;
  get bitEraserSize(): number;
  get filled(): boolean;
  get thickness(): number;
  get rotationCenterY(): number | undefined;
  get rotationCenterX(): number | undefined;
  get cursor(): string;
  get zoom(): number;
  get selectedItems(): [];

  /**
   * string representing source of image. when source changes, we consider image different
   */
  get imageSource(): string | undefined;

  /**
   * latest image content edited
   */
  get image(): project.ImageData | undefined;

  get zoomLevelId(): number;
  get shouldZoomToFit(): boolean;
  get zoomLevels(): paper.Matrix[];
}

/**
 * provides methods for managing state of editor
 */
export interface IPaperEditor {
  getCommand(key: string): any;

  get state(): IPaperEditorState;

  registerStateChange(name: string, onChange: any);
  unregisterStateChange(name: string);
  setState(props: {});

  /**
   * set image to be edited
   */
  setImage(imageSource: string, imageData?: project.ImageData);

  // called from editor logic
  // need to move someth
  handleUpdateImage(skipSnapshot, formatOverride);
  handleSetCursor(cursorString: string);
  handleSetSelectedItems(selectedItems: [], bitmapMode: any);
  handleClearSelectedItems();

  saveZoomLevel();
  setZoomLevelId(newZoomLevelId: string);
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

/**
 * 'model' object for paint editor. Provides set of methods and properties
 * used by PaintEditorCanvas and buttons
 */
export class PaperEditor implements IPaperEditor {

  private commands: { [key: string]: any } = {};
  private stateStore: StateStore<IPaperEditorState>;

  /**
   * canvas used to generate snapshots of images
   */
  private reusableCanvas: any;

  /* selected items managed by paper tools
   * not stored in state since they can change while drawing happens
   */
  private _selectedItems: [] = [];

  public constructor() {

    this.stateStore = new StateStore<IPaperEditorState>({
      imageFormat: 'svg',
      format: 'svg',
      mode: Modes.SELECT,
      color: new Color(DEFAULT_COLOR),
      colorState: new ColorState(),
      brushMode: new BrushMode(),
      rotationCenterX: undefined,
      rotationCenterY: undefined,
      filled: false,
      thickness: 1.0,
      cursor: Cursors.DEFAULT,
      zoom: 1.0,
      bitBrushSize: 1.0,
      bitEraserSize: 1.0,
      selectedItems: [],
      imageSource: undefined,
      image: undefined,

      zoomLevelId: 0,
      shouldZoomToFit: true,
      zoomLevels: [new paper.Matrix()]
    });

    this.commands[BitBrushModeCommand_commandId] = new BitBrushModeCommand(this);
    this.commands[BitLineModeCommand_commandId] = new BitLineModeCommand(this);
    this.commands[BitOvalModeCommand_commandId] = new BitOvalModeCommand(this);
    this.commands[BitRectModeCommand_commandId] = new BitRectModeCommand(this);
    this.commands[BitSelectModeCommand_commandId] = new BitSelectModeCommand(this);
    this.commands[BitEraserModeCommand_commandId] = new BitEraserModeCommand(this);
    this.commands[BitTextModeCommand_commandId] = new BitTextModeCommand(this);
    this.commands[OvalModeCommand_commandId] = new OvalModeCommand(this);
    this.commands[RectModeCommand_commandId] = new RectModeCommand(this);
    this.commands[LineModeCommand_commandId] = new LineModeCommand(this);
    this.commands[FillModeCommand_commandId] = new FillModeCommand(this);
    this.commands[BrushModeCommand_commandId] = new BrushModeCommand(this);

    _.bindAll(this, [
      'handleUpdateImage',
      'handleSetSelectedItems',
      'handleClearSelectedItems',
      'handleSetCursor'
    ]);

    this.reusableCanvas = document.createElement('canvas');
  }

  public get state(): IPaperEditorState { return this.stateStore.state as IPaperEditorState; }

  public setState(state: {}) {
    this.stateStore.setState(state);
  }
  public registerStateChange(name: string, onChange: any) {
    this.stateStore.registerStateChange(name, onChange);
  }

  public unregisterStateChange(name: string) {
    this.stateStore.unregisterStateChange(name);
  }

  public setImage(imageSource: string, imageData?: project.ImageData) {
    console.log('PaperEditor.setImage:' + imageSource);
    this.setState({ imageSource: imageSource, image: imageData });
  }
  public getCommand(key: string): any {
    let command = this.commands[key];
    if (command === undefined) {
      throw 'unknown command: ' + key;
    }
    return command;
  }

  public saveZoomLevel() {
  }
  public setZoomLevelId(newZoomLevelId: string) {
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
      BitmapModes[this.state.mode] ? Formats.BITMAP : Formats.VECTOR;
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
    this.setState({ cursor: cursorString });
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

    const imageData: ImageData = plasteredRaster.getImageData(rect);

    this.updateBitmapImageBits(
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
        // @ts-ignore
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

    this.updateVectorImageBits(
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

  private updateVectorImageBits(image: SVGElement | string, rotationCenterX: number, rotationCenterY: number) {
    this.setState({
      imageFormat: 'svg',
      image: image,
      rotationCenterX: rotationCenterX,
      rotationCenterY: rotationCenterY
    });
  }

  private updateBitmapImageBits(imageData: ImageData, rotationCenterX: number, rotationCenterY: number) {
    // image parameter has type ImageData
    // paint editor takes dataURI as input
    this.reusableCanvas.width = imageData.width;
    this.reusableCanvas.height = imageData.height;
    const context = this.reusableCanvas.getContext('2d');
    context.putImageData(imageData, 0, 0);

    let imageDataUrl = this.reusableCanvas.toDataURL('image/png');

    this.setState({
      imageFormat: 'png',
      image: new project.ImageData(project.ImageFormat.png, imageDataUrl),
      rotationCenterX: rotationCenterX,
      rotationCenterY: rotationCenterY
    });
  }
}

