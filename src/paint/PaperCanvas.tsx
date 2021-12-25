// @1ts-nocheck disabling checks for interop

import bindAll from 'lodash.bindall';
import React from 'react';
import paper from 'paper';
import Formats from './lib/format';

import { performSnapshot } from './tools/undo';
import { isGroup, ungroupItems } from './tools/group';
import { clearRaster, convertBackgroundGuideLayer, getRaster, setupLayers } from './tools/layer';
import {
    ART_BOARD_WIDTH, ART_BOARD_HEIGHT, CENTER, MAX_WORKSPACE_BOUNDS,
    clampViewBounds, resetZoom, setWorkspaceBounds, zoomToFit, resizeCrosshair
} from './tools/view';
import { ensureClockwise, scaleWithStrokes } from './tools/math';
import * as project from '../Project';
import { IPaperEditor } from './PaperEditor';

var paperScope: any = null;

export interface IPaperCanvasProps {
    editor: IPaperEditor;
    imageSource: string | undefined;
    format: string;

    /*
        canvasRef: PropTypes.func,
            changeFormat: PropTypes.func.isRequired,
            clearHoveredItem: PropTypes.func.isRequired,
            clearPasteOffset: PropTypes.func.isRequired,
            clearSelectedItems: PropTypes.func.isRequired,
            clearUndo: PropTypes.func.isRequired,
            cursor: PropTypes.string,
            format: PropTypes.oneOf(Object.keys(Formats)),
            imageFormat: PropTypes.string, // The incoming image's data format, used during import. The user could switch this.
            imageId: PropTypes.string,
            rotationCenterX: PropTypes.number,
            rotationCenterY: PropTypes.number,
            saveZoomLevel: PropTypes.func.isRequired,
            setZoomLevelId: PropTypes.func.isRequired,
            undoSnapshot: PropTypes.func.isRequired,
            updateViewBounds: PropTypes.func.isRequired,
            zoomLevelId: PropTypes.string,
            zoomLevels: PropTypes.shape({
                currentZoomLevelId: PropTypes.string
            })
        };
    */
}

export interface IPaperCanvasState {
    format: string; // Formats;
    imageSource: string | undefined;
    rotationCenterX?: number;
    rotationCenterY?: number;
    cursor: string;
}

export default class PaperCanvas extends React.Component<IPaperCanvasProps, IPaperCanvasState> {
    public canvas: any;
    private editor: IPaperEditor;
    private shouldZoomToFit: boolean | paper.Matrix = false;

    // is set if we are loading image
    private queuedImport: any = null;

    private queuedImageToLoad: any // Image;

    constructor(props) {
        super(props);
        bindAll(this, [
            'clearQueuedImport',
            'setCanvas',
            'importSvg',
            'initializeSvg',
            'maybeZoomToFit',
            'switchCostume',
            'onViewResize',
            'recalibrateSize',
            'onEditorStateChange'
        ]);

        this.editor = props.editor;
        this.state = {
            format: this.props.format,
            imageSource: this.props.imageSource,
            rotationCenterX: this.editor.state.rotationCenterX,
            rotationCenterY: this.editor.state.rotationCenterY,
            cursor: this.editor.state.cursor
        }
        this.editor.registerStateChange('PaperCanvas', this.onEditorStateChange)
    }

    onEditorStateChange() {
        let updateState = {};
        if (this.editor.state.imageSource !== this.state.imageSource) {
            // @ts-ignore
            updateState.imageSource = this.editor.state.imageSource;
        }
        if (this.editor.state.format !== this.state.format) {
            // @ts-ignore
            updateState.format = this.editor.state.format;
        }
        if (Object.keys(updateState).length > 0) {
            console.log('PaperCanvas: update state');
            this.setState(updateState);
        }
    }

    componentDidMount() {
        paper.setup(this.canvas);
        paper.view.on('resize', this.onViewResize);
        //new paper.Project()
        // resetZoom();
        /*
        if (this.props.zoomLevelId) {
            this.props.setZoomLevelId(this.props.zoomLevelId);
            if (this.props.zoomLevels[this.props.zoomLevelId]) {
                // This is the matrix that the view should be zoomed to after image import
                this.shouldZoomToFit = this.props.zoomLevels[this.props.zoomLevelId];
            } else {
                // Zoom to fit true means find a comfortable zoom level for viewing the costume
                this.shouldZoomToFit = true;
            }
        } else {
            this.props.updateViewBounds(paper.view.matrix);
        }
*/
        const context = this.canvas.getContext('2d');
        context.webkitImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        // Don't show handles by default
        paper.settings.handleSize = 0;
        // Make layers.
        setupLayers(this.props.editor.state.format);
        this.importImage(
            this.editor.state.imageFormat, this.editor.state.image,
            this.editor.state.rotationCenterX, this.editor.state.rotationCenterY);
    }
    componentWillReceiveProps(newProps) {
        if (this.state.imageSource !== newProps.imageSource) {
            console.log('PaperCanvas: load:' + newProps.imageSource);

            this.switchCostume(newProps.imageFormat, newProps.image,
                newProps.rotationCenterX, newProps.rotationCenterY,
                this.editor.state.zoomLevelId, newProps.zoomLevelId);
        }
        if (this.state.format !== newProps.format) {
            this.recalibrateSize();
            convertBackgroundGuideLayer(newProps.format);
        }
    }
    componentWillUnmount() {
        this.clearQueuedImport();
        // shouldZoomToFit means the zoom level hasn't been initialized yet
        if (!this.shouldZoomToFit) {
            this.editor.saveZoomLevel();
        }
        // @ts-ignore
        paper.remove();

        this.editor.unregisterStateChange('PaperCanvas');
    }
    clearQueuedImport() {
        if (this.queuedImport) {
            window.clearTimeout(this.queuedImport);
            this.queuedImport = null;
        }
        if (this.queuedImageToLoad) {
            this.queuedImageToLoad.src = '';
            this.queuedImageToLoad.onload = null;
            this.queuedImageToLoad = null;
        }
    }
    switchCostume(format, image, rotationCenterX, rotationCenterY, oldZoomLevelId, newZoomLevelId) {
        if (oldZoomLevelId && oldZoomLevelId !== newZoomLevelId) {
            this.editor.saveZoomLevel();
        }
        if (newZoomLevelId && oldZoomLevelId !== newZoomLevelId) {
            if (this.editor.state.zoomLevels[newZoomLevelId]) {
                this.shouldZoomToFit = this.editor.state.zoomLevels[newZoomLevelId];
            } else {
                this.shouldZoomToFit = true;
            }
            this.editor.setZoomLevelId(newZoomLevelId);
        }
        for (const layer of paper.project.layers) {
            if (layer.data.isRasterLayer) {
                clearRaster();
            } else if (!layer.data.isBackgroundGuideLayer &&
                !layer.data.isDragCrosshairLayer &&
                !layer.data.isOutlineLayer) {
                layer.removeChildren();
            }
        }
        //this.props.clearUndo();
        //this.props.clearSelectedItems();
        //this.props.clearHoveredItem();
        //this.props.clearPasteOffset();
        this.importImage(format, image, rotationCenterX, rotationCenterY);
    }
    importImage(format, image, rotationCenterX, rotationCenterY) {
        // Stop any in-progress imports
        this.clearQueuedImport();

        if (!image) {
            //this.props.changeFormat(Formats.VECTOR_SKIP_CONVERT);
            //performSnapshot(this.props.undoSnapshot, Formats.VECTOR_SKIP_CONVERT);
            this.recalibrateSize();
            return;
        }

        if (format === 'jpg' || format === 'png') {
            // import bitmap
            // @ts-ignore
            // this.props.changeFormat(Formats.BITMAP_SKIP_CONVERT);

            const mask = new paper.Shape.Rectangle(getRaster().getBounds());
            // @ts-ignore
            mask.guide = true;
            mask.locked = true;
            // @ts-ignore
            mask.setPosition(CENTER);
            mask.clipMask = true;

            const imgElement = new Image();
            this.queuedImageToLoad = imgElement;
            imgElement.onload = () => {
                if (!this.queuedImageToLoad) return;
                this.queuedImageToLoad = null;

                if (typeof rotationCenterX === 'undefined') {
                    rotationCenterX = imgElement.width / 2;
                }
                if (typeof rotationCenterY === 'undefined') {
                    rotationCenterY = imgElement.height / 2;
                }

                // @ts-ignore
                getRaster().drawImage(
                    imgElement,
                    (ART_BOARD_WIDTH / 2) - rotationCenterX,
                    (ART_BOARD_HEIGHT / 2) - rotationCenterY);
                // @ts-ignore
                getRaster().drawImage(
                    imgElement,
                    (ART_BOARD_WIDTH / 2) - rotationCenterX,
                    (ART_BOARD_HEIGHT / 2) - rotationCenterY);

                this.maybeZoomToFit(true /* isBitmap */);
                //performSnapshot(this.props.undoSnapshot, Formats.BITMAP_SKIP_CONVERT);
                this.recalibrateSize();
            };
            imgElement.src = image;
        } else if (format === 'svg') {
            //this.props.changeFormat(Formats.VECTOR_SKIP_CONVERT);
            this.importSvg(image, rotationCenterX, rotationCenterY);
        } else {
            //this.props.changeFormat(Formats.VECTOR_SKIP_CONVERT);
            //performSnapshot(this.props.undoSnapshot, Formats.VECTOR_SKIP_CONVERT);
            this.recalibrateSize();
        }
    }
    maybeZoomToFit(isBitmapMode: boolean = false) {
        if (this.shouldZoomToFit instanceof paper.Matrix) {
            paper.view.matrix = this.shouldZoomToFit;
            //this.props.updateViewBounds(paper.view.matrix);
            resizeCrosshair();
        } else if (this.shouldZoomToFit === true) {
            zoomToFit(isBitmapMode);
        }
        this.shouldZoomToFit = false;
        setWorkspaceBounds(false);
        //this.props.updateViewBounds(paper.view.matrix);
    }

    importSvg(svg, rotationCenterX, rotationCenterY) {
        const paperCanvas = this;
        // Pre-process SVG to prevent parsing errors (discussion from #213)
        // 1. Remove svg: namespace on elements.
        // TODO: remove
        svg = svg.split(/<\s*svg:/).join('<');
        svg = svg.split(/<\/\s*svg:/).join('</');
        // 2. Add root svg namespace if it does not exist.
        const svgAttrs = svg.match(/<svg [^>]*>/);
        if (svgAttrs && svgAttrs[0].indexOf('xmlns=') === -1) {
            svg = svg.replace(
                '<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
        }

        // Get the origin which the viewBox is defined relative to. During import, Paper will translate
        // the viewBox to start at (0, 0), and we need to translate it back for some costumes to render
        // correctly.
        const parser = new DOMParser();
        const svgDom = parser.parseFromString(svg, 'text/xml');

        // @ts-ignore
        const viewBox = svgDom.documentElement.attributes.viewBox ? svgDom.documentElement.attributes.viewBox.value.match(/\S+/g) : null;
        if (viewBox) {
            for (let i = 0; i < viewBox.length; i++) {
                viewBox[i] = parseFloat(viewBox[i]);
            }
        }

        paper.project.importSVG(svg, {
            expandShapes: true,
            onLoad: function (item) {
                if (!item) {
                    // this.props.changeFormat(Formats.VECTOR_SKIP_CONVERT);
                    //performSnapshot(paperCanvas.props.undoSnapshot, Formats.VECTOR_SKIP_CONVERT);
                    return;
                }
                item.remove();

                // Without the callback, rasters' load function has not been called yet, and they are
                // positioned incorrectly
                paperCanvas.queuedImport = paperCanvas.recalibrateSize(() => {
                    // paperCanvas.props.updateViewBounds(paper.view.matrix);
                    paperCanvas.initializeSvg(item, rotationCenterX, rotationCenterY, viewBox);
                });
            }
        });
    }
    initializeSvg(item, rotationCenterX, rotationCenterY, viewBox) {
        if (this.queuedImport) this.queuedImport = null;
        const itemWidth = item.bounds.width;
        const itemHeight = item.bounds.height;

        // Get reference to viewbox
        let mask;
        if (item.clipped) {
            for (const child of item.children) {
                if (child.isClipMask()) {
                    mask = child;
                    break;
                }
            }
            mask.clipMask = false;
        } else {
            mask = new paper.Shape.Rectangle(item.bounds);
        }
        mask.guide = true;
        mask.locked = true;
        mask.matrix = new paper.Matrix(); // Identity
        // Set the artwork to get clipped at the max costume size
        mask.size.height = MAX_WORKSPACE_BOUNDS.height;
        mask.size.width = MAX_WORKSPACE_BOUNDS.width;
        mask.setPosition(CENTER);
        paper.project.activeLayer.addChild(mask);
        mask.clipMask = true;

        // Reduce single item nested in groups
        if (item instanceof paper.Group && item.children.length === 1) {
            item = item.reduce(undefined);
        }

        ensureClockwise(item);

        // @ts-ignore
        scaleWithStrokes(item, 2, new paper.Point()); // Import at 2x

        // Apply rotation center
        if (typeof rotationCenterX !== 'undefined' && typeof rotationCenterY !== 'undefined') {
            let rotationPoint = new paper.Point(rotationCenterX, rotationCenterY);
            if (viewBox && viewBox.length >= 2 && !isNaN(viewBox[0]) && !isNaN(viewBox[1])) {
                // @ts-ignore
                rotationPoint = rotationPoint.subtract(viewBox[0], viewBox[1]);
            }
            item.translate(CENTER.subtract(rotationPoint.multiply(2)));
        } else {
            // Center
            // @ts-ignore
            item.translate(CENTER.subtract(itemWidth, itemHeight));
        }

        paper.project.activeLayer.insertChild(0, item);
        if (isGroup(item)) {
            // Fixes an issue where we may export empty groups
            for (const child of item.children) {
                if (isGroup(child) && child.children.length === 0) {
                    child.remove();
                }
            }
            // @ts-ignore
            ungroupItems([item]);
        }

        //performSnapshot(this.props.undoSnapshot, Formats.VECTOR_SKIP_CONVERT);
        this.maybeZoomToFit();
    }
    onViewResize() {
        setWorkspaceBounds(true /* clipEmpty */);
        clampViewBounds();
        // Fix incorrect paper canvas scale on browser zoom reset
        this.recalibrateSize();
        //this.props.updateViewBounds(paper.view.matrix);
    }
    recalibrateSize(callback?: any) {
        // Sets the size that Paper thinks the canvas is to the size the canvas element actually is.
        // When these are out of sync, the mouse events in the paint editor don't line up correctly.
        return window.setTimeout(() => {
            // If the component unmounts, the canvas will be removed from the page, detaching paper.view.
            // This could also be called before paper.view exists.
            // In either case, return early if so without running the callback.
            if (!paper.view) return;
            // Prevent blurriness caused if the "CSS size" of the element is a float--
            // setting canvas dimensions to floats floors them, but we need to round instead
            // @ts-ignore
            const elemSize = paper.DomElement.getSize(paper.view.element);
            elemSize.width = Math.round(elemSize.width);
            elemSize.height = Math.round(elemSize.height);
            // @ts-ignore
            paper.view.setViewSize(elemSize);

            if (callback) callback();
        }, 0);
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        //if (this.props.canvasRef) {
        //    this.props.canvasRef(canvas);
        //}
    }
    render() {
        return (
            <canvas
                className='Paper-canvas'
                ref={this.setCanvas}
                style={{ cursor: this.state.cursor }}
            />
        );
    }
}

