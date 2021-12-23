
// @ts-nocheck
import paper from 'paper';
import { clearSelection } from '../../tools/selection';
import { endPointHit, touching } from '../../tools/snapping';
import { drawHitPoint, removeHitPoint } from '../../tools//guides';
import { styleShape, MIXED } from '../../tools/style-path';
import { snapDeltaToAngle } from '../../tools/math';

import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { ColorState, IPaintEditor } from '../../PaintEditor';

import lineIcon from './line.svg';

export const LineModeCommand_commandId: string = 'line-mode';

class LineTool extends paper.Tool {
    static get SNAP_TOLERANCE() {
        return 6;
    }
    static get DEFAULT_COLOR() {
        return '#000000';
    }

    private hitResult: any;
    private path: any;
    private drawHitPoint: any;
    private colorState: ColorState;

    public constructor() {
        super();

        let superActivate = this.activate;
        this.activate = () => {
            this.path = null;
            this.hitResult = null;

            superActivate();
        }

        let superMouseDown = this.onMouseDown;
        this.onMouseDown = (event) => {
            if (event.event.button > 0) return; // only first mouse button
            // this.active = true;

            // If you click near a point, continue that line instead of making a new line
            // @ts-ignore
            this.hitResult = endPointHit(event.point, LineMode.SNAP_TOLERANCE);
            if (this.hitResult) {
                this.path = this.hitResult.path;
                styleShape(this.path, {
                    fillColor: null,
                    strokeColor: this.props.colorState.strokeColor,
                    strokeWidth: this.props.colorState.strokeWidth
                });
                if (this.hitResult.isFirst) {
                    this.path.reverse();
                }

                this.path.lastSegment.handleOut = null; // Make sure added line isn't made curvy
                this.path.add(this.hitResult.segment.point); // Add second point, which is what will move when dragged
            }

            // If not near other path, start a new path
            if (!this.path) {
                this.path = new paper.Path();
                this.path.strokeCap = 'round';
                styleShape(this.path, {
                    fillColor: null,
                    strokeColor: this.colorState.strokeColor1,
                    strokeWidth: this.colorState.strokeWidth
                });

                this.path.add(event.point);
                this.path.add(event.point); // Add second point, which is what will move when dragged
            }
        }

        this.drawHitPoint = (hitResult) => {
            // If near another path's endpoint, draw hit point to indicate that paths would merge
            if (hitResult) {
                const hitPath = hitResult.path;
                if (hitResult.isFirst) {
                    drawHitPoint(hitPath.firstSegment.point);
                } else {
                    drawHitPoint(hitPath.lastSegment.point);
                }
            }
        }

        let superMouseMove = this.onMouseMove;
        this.onMouseMove = (event) => {
            if (this.hitResult) {
                removeHitPoint();
            }
            // @ts-ignore
            this.hitResult = endPointHit(event.point, LineTool.SNAP_TOLERANCE);
            this.drawHitPoint(this.hitResult);
            superMouseMove(event);
        }

        let superMouseDrag = this.onMouseDrag;
        this.onMouseDrag = (event) => {
            if (event.event.button > 0 || !this.active) return; // only first mouse button

            // Clear the last hit result
            if (this.hitResult) {
                removeHitPoint();
                this.hitResult = null;
            }

            // If shift is held, act like event.point always lies on a straight or 45 degree line from the last point
            let endPoint = event.point;
            if (event.modifiers.shift) {
                const line = event.point.subtract(this.path.lastSegment.previous.point);
                endPoint = this.path.lastSegment.previous.point.add(snapDeltaToAngle(line, Math.PI / 4));
            }

            // Find an end point that endPoint is close to (to snap lines together)
            if (this.path &&
                !this.path.closed &&
                this.path.segments.length > 3 &&
                touching(this.path.firstSegment.point, endPoint, LineTool.SNAP_TOLERANCE)) {
                this.hitResult = {
                    path: this.path,
                    segment: this.path.firstSegment,
                    isFirst: true
                };
            } else {
                this.hitResult = endPointHit(endPoint, LineTool.SNAP_TOLERANCE, this.path);
            }

            // If shift is being held, we shouldn't snap to end points that change the slope by too much.
            // In that case, clear the hit result.
            if (this.hitResult && event.modifiers.shift) {
                const lineToSnap = this.hitResult.segment.point.subtract(this.path.lastSegment.previous.point);
                const lineToEndPoint = endPoint.subtract(this.path.lastSegment.previous.point);
                if (lineToSnap.normalize().getDistance(lineToEndPoint.normalize()) > 1e-2) {
                    this.hitResult = null;
                }
            }

            // If near another path's endpoint, or this path's beginpoint, clip to it to suggest
            // joining/closing the paths.
            if (this.hitResult) {
                this.drawHitPoint(this.hitResult);
                this.path.lastSegment.point = this.hitResult.segment.point;
            } else {
                this.path.lastSegment.point = endPoint;
            }

            styleShape(this.path, {
                fillColor: null,
                strokeColor: this.props.colorState.strokeColor,
                strokeWidth: this.props.colorState.strokeWidth
            });

            superMouseMove();
        }

        let superMouseUp = this.onMouseUp;
        this.onMouseUp = (event) => {
            if (event.event.button > 0 || !this.active) return; // only first mouse button

            // If I single clicked, don't do anything
            if (this.path.segments.length < 2 ||
                (this.path.segments.length === 2 &&
                    touching(this.path.firstSegment.point, event.point, LineTool.SNAP_TOLERANCE) &&
                    !this.hitResult)) { // Let lines be short if you're connecting them
                this.path.remove();
                this.path = null;
                return;
            } else if (!this.hitResult &&
                touching(this.path.lastSegment.point, this.path.segments[this.path.segments.length - 2].point,
                    LineTool.SNAP_TOLERANCE)) {
                // Single click or short drag on an existing path end point
                this.path.removeSegment(this.path.segments.length - 1);
                this.path = null;
                return;
            }
            // If I intersect other line end points, join or close
            if (this.hitResult) {
                this.path.removeSegment(this.path.segments.length - 1);
                if (this.path.firstSegment.point.equals(this.hitResult.segment.point)) {
                    this.path.firstSegment.handleIn = null; // Make sure added line isn't made curvy
                    // close path
                    this.path.closed = true;
                } else {
                    // joining two paths
                    if (!this.hitResult.isFirst) {
                        this.hitResult.path.reverse();
                    }
                    this.hitResult.path.firstSegment.handleIn = null; // Make sure added line isn't made curvy
                    this.path.join(this.hitResult.path);
                }
                removeHitPoint();
                this.hitResult = null;
            }

            styleShape(this.path, {
                fillColor: null,
                strokeColor: this.props.colorState.strokeColor,
                strokeWidth: this.props.colorState.strokeWidth
            });

            if (this.path) {
                this.props.onUpdateImage();
                this.path = null;
            }
        }
    }
}

export default class LineModeCommand extends ToolSelectCommand<LineTool> {
    private path: paper.Path;
    static get SNAP_TOLERANCE() {
        return 6;
    }
    static get DEFAULT_COLOR() {
        return '#000000';
    }

    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaintEditor) {
        super(editor, LineModeCommand_commandId, Modes.LINE, lineIcon, 'hello');
        this.zoom = 1.0;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.editor.color !== this.tool.color) {
                this.tool.setColor(this.editor.color);
                isDirty = true;
            }
            //if (this.editor.selectedItems !== this.selectedItems) {
            //    this.selectedItems = this.editor.selectedItems;
            //    this.tool.onSelectionChanged(this.editor.selectedItems);
            //}
            if (this.editor.filled !== this.tool.filled) {
                this.tool.setFilled(this.editor.filled);
            }
            if (this.editor.thickness !== this.tool.thickness ||
                this.editor.zoom !== this.zoom) {
                this.tool.setThickness(this.editor.thickness);
            }
        }
        return isDirty;
    }

    activateTool() {
        clearSelection(this.editor.handleClearSelectedItems);
        /*
        // Force the default line color if stroke is MIXED or transparent
        const strokeColor1 = this.props.colorState.strokeColor.primary;
        const strokeColor2 = this.props.colorState.strokeColor.secondary;
        if (strokeColor1 === MIXED ||
            (strokeColor1 === null &&
                (strokeColor2 === null || strokeColor2 === MIXED))) {
            this.props.onChangeStrokeColor(LineMode.DEFAULT_COLOR);
        }
        if (strokeColor2 === MIXED) {
            this.props.clearStrokeGradient();
        }
        // Force a minimum stroke width
        if (!this.props.colorState.strokeWidth) {
            this.props.onChangeStrokeWidth(1);
        }*/
    }

    deactivateTool(): void {
        this.tool.remove();
        this.tool = null;
        if (this.hitResult) {
            removeHitPoint();
            this.hitResult = null;
        }
        if (this.path) {
            this.path = null;
        }
    }
}
