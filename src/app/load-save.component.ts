import { Component, ViewChild, AfterViewInit, ElementRef, Renderer } from '@angular/core';

enum DragState {
    NotDragging,
    DraggingWithinSlop,
    Dragging
}

@Component({
    moduleId: module.id,
    selector: 'load-save',
    template: `
    <style>
      #folder {
        /* TODO - get size from FOLDER_SIZE */
        width:100px;
        height:100px;
        position: absolute;
        right: 0;
        margin:20px;
      }
    </style>
    <img #folder id='folder' src="folder.svg"/>
`,
    styles: [],
    directives: [LoadSaveComponent]
})
export class LoadSaveComponent implements AfterViewInit {
    static get SLOP_SIZE(): number { return 75; };
    static get FOLDER_SIZE(): number { return 120; };

    private renderer: Renderer;
    private dragState: DragState = DragState.NotDragging;
    @ViewChild('folder') folder;

    constructor(elementRef: ElementRef, renderer: Renderer) {
        this.renderer = renderer;
    }

    pointerRelease(e): void {
        this.dragState = DragState.NotDragging;
        this.folder.nativeElement.style.left = '';
        this.folder.nativeElement.style.right = '0';
        this.folder.nativeElement.style.top = '0';
    }

    maybeStartDrag(e): void {
        let x = e.offsetX - LoadSaveComponent.FOLDER_SIZE / 2;
        let y = e.offsetY - LoadSaveComponent.FOLDER_SIZE / 2;

        let distance = Math.sqrt(x * x + y * y);
        if (distance > LoadSaveComponent.SLOP_SIZE) {
            this.dragState = DragState.Dragging;
        }
    }

    drag(e): void {
        // TODO - this should probably be done in rAF.
        let x = e.clientX - LoadSaveComponent.FOLDER_SIZE / 2;
        let y = e.clientY - LoadSaveComponent.FOLDER_SIZE / 2;

        this.folder.nativeElement.style.left = x + 'px';
        this.folder.nativeElement.style.top = y + 'px';
    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.folder.nativeElement, 'pointerdown', (e) => {
            this.folder.nativeElement.setPointerCapture(e.pointerId);
            e.preventDefault();
            console.log("DOWN ON SAVE/LOAD");
            this.dragState = DragState.DraggingWithinSlop;
        });

        this.renderer.listen(this.folder.nativeElement, 'pointerup', (e) => {
            this.pointerRelease.bind(this)(e);
        });

        this.renderer.listen(this.folder.nativeElement, 'pointercancel', (e) => {
            this.pointerRelease.bind(this)(e);
        });

        this.renderer.listen(this.folder.nativeElement, 'pointermove', (e) => {
            e.preventDefault();
            switch(this.dragState) {
            case DragState.NotDragging:
                return;
            case DragState.DraggingWithinSlop:
                this.maybeStartDrag(e);
                break;
            case DragState.Dragging:
                this.drag(e);
                break;
            }
        });
    }
}
