import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import { getRaster, hideGuideLayers, showGuideLayers } from '../tools/layer';
import Modes, { BitmapModes } from '../lib/modes';
import log from '../log/log';
import Formats, { isBitmap, isVector } from '../lib/format';
import { commitOvalToBitmap, commitRectToBitmap, commitSelectionToBitmap, getHitBounds } from '../tools/bitmap';
import { scaleWithStrokes } from '../tools/math';
import { ART_BOARD_HEIGHT, ART_BOARD_WIDTH, setWorkspaceBounds, SVG_ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH } from '../tools/view';
import BitBrushModeCommand from './BitBrushModeCommand';

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
 */
export interface IPaintEditor {
  get mode(): any; // Modes
  get imageFormat(): string;
  setState(props: {});
  getCommand(key: string): any;
}

export class PaintEditor implements IPaintEditor {

  private state: {} = {
    imageFormat: 'svg',
    mode: Modes.SELECT,
    rotationCenterX: undefined,
    rotationCenterY: undefined
  };

  private commands: { [key: string]: any };

  public constructor() {
    this.commands = {
      'bit-brush-mode': new BitBrushModeCommand(this)
    }
  }
  public getCommand(key: string): any {
    return this.commands[key];
  }

  // @ts-ignore
  public get mode() { return this.state.mode };

  // @ts-ignore
  public get imageFormat() { return this.state.imageFormat };

  public setState(state: {}) {
    for (let key in state) {
      this.state[key] = state[key];
    }
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
  handleUpdateImage(skipSnapshot, formatOverride) {
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

  handleUpdateBitmap(skipSnapshot) {
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

  handleUpdateVector(skipSnapshot) {
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

