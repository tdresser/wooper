import { Component, ViewChild, AfterViewInit, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';

import { Loop, PlayState } from './loop';

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
      #file-input {
        display:none;
      }
    </style>
    <img #folder id='folder' src="./folder.svg"/>
    <!-- TODO: add accept -->
    <input type="file" #fileInput id="file-input">
`,
    styles: [],
    directives: [LoadSaveComponent]
})
export class LoadSaveComponent implements AfterViewInit {
    static get SLOP_SIZE(): number { return 75; };
    static get FOLDER_SIZE(): number { return 120; };

    private renderer: Renderer;
    private dragState: DragState = DragState.NotDragging;
    private loadingLoop: Loop;
    @ViewChild('folder') folder;
    @ViewChild('fileInput') fileInput;

    @Output() loadEvent = new EventEmitter();

    constructor(elementRef: ElementRef, renderer: Renderer) {
        this.renderer = renderer;
    }

    pointerRelease(e): void {
        this.dragState = DragState.NotDragging;
        this.folder.nativeElement.style.left = '';
        this.folder.nativeElement.style.right = '0';
        this.folder.nativeElement.style.top = '0';
        this.loadEvent.emit({x:e.clientX, y:e.clientY});
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

    loadInto(loop: Loop) {
        this.loadingLoop = loop;
        this.fileInput.nativeElement.click();
    }

    containsPoint(x:number, y:number): boolean {
        let rect = this.folder.nativeElement.getBoundingClientRect();

        let result = rect.left < x && x < rect.right &&
            rect.top < y && y < rect.bottom;
        return result;
    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.folder.nativeElement, 'pointerdown', (e) => {
            this.folder.nativeElement.setPointerCapture(e.pointerId);
            e.preventDefault();
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

        this.renderer.listen(this.fileInput.nativeElement, 'change', (e) => {
            let file = e.target.files[0];

            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.loadingLoop.load(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        });
    }
}
