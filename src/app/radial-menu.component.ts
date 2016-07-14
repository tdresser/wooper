import { Component, ViewChild, Input } from '@angular/core';

import { PlayState } from './loop';

export enum DragState {
    NotDragging,
    DragNoDirection,
    Up,
    Down,
    Left,
    Right,
    Merging
}

@Component({
  moduleId: module.id,
  selector: 'radial-menu',
  template: `
  <style>
    path {
      fill: #ddd;
    }
    .radial-legend {
       color: #555;
       font: 18px arial, sans-serif;
       z-index:2;
       position:absolute;
       left:0;
       right:0;
    }
    #center-text {
    }
    #top-text {
      top: -70px;
    }
    #bottom-text {
      top: 200px;
    }
    #left-text {
      top: 65px;
      left: -310px;
    }
    #right-text {
      top: 65px;
      left: 210px;
    }

    #svg-container {
      position:absolute;
      left:50%;
      top:50%;
    }
  </style>
  <ng-content></ng-content>
  <div [style.display] = "(_dragState == DragState.NotDragging || _dragState == DragState.Merging) ? 'none': 'block'">
  <span class="radial-legend" id='center-text'>{{getActionText(playState)}}</span>
  <span class="radial-legend" id='top-text'>Queue {{getActionText(playState)}}</span>
  <span class="radial-legend" id='left-text'>Merge</span>
  <span class="radial-legend" id='right-text'>?</span>
  <span class="radial-legend" id='bottom-text'>Clear</span>

  <div id="svg-container" >
  <svg [ngStyle]="radialMenuStyles()"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   version="1.1"
   width="241.59375"
   height="241.5625"
   id="svg2">
  <defs
     id="defs4" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     transform="translate(-313.0625,-545.21875)"
     id="layer1">
    <path #up [style.fill] = "_dragState == DragState.Up ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'"
       d="m 433.9375,545.21875 c -28.65271,0 -55.01187,9.9968 -75.75,26.6875 l 10.6875,10.65625 c 17.93913,-13.96725 40.52691,-22.28125 65.0625,-22.28125 24.51989,0 47.06597,8.29894 64.96875,22.25 L 509.5625,571.875 c -20.69969,-16.66949 -46.99248,-26.65625 -75.625,-26.65625 z"/>
    <path #right [style.fill] = "_dragState == DragState.Right ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'"
       d="m 527.96875,590.25 -10.65625,10.6875 c 13.96593,17.90787 22.25,40.46569 22.25,65 0,24.55022 -8.29895,47.11822 -22.28125,65.0625 l 10.6875,10.6875 c 16.69132,-20.73833 26.6875,-47.09668 26.6875,-75.75 0,-28.64907 -10.00062,-54.98233 -26.6875,-75.6875 z"/>
    <path #left [style.fill] = "_dragState == DragState.Left ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'"
       d="m 339.78125,590.28125 c -16.70582,20.70114 -26.71875,47.01938 -26.71875,75.65625 0,28.64127 10.00834,54.98442 26.71875,75.71875 l 10.6875,-10.6875 C 336.47201,713.03008 328.125,690.47183 328.125,665.9375 c 0,-24.51842 8.33215,-47.06647 22.3125,-64.96875 l -10.65625,-10.6875 z"/>
    <path #down [style.fill] = "_dragState == DragState.Down ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'"
       d="m 368.875,749.375 -10.6875,10.6875 c 20.73693,16.71863 47.10093,26.71875 75.75,26.71875 28.63607,0 54.92414,-10.01381 75.625,-26.71875 l -10.65625,-10.65625 c -17.90315,13.9829 -40.44783,22.3125 -64.96875,22.3125 -24.53652,0 -47.12304,-8.34474 -65.0625,-22.34375 z"/>
  </g>
</svg>
</div>
</div>
  `,
  styles: [],
  directives: []
})
export class RadialMenuComponent {
    static get SIZE(): number { return 241; };
    static get ACTIVE_COLOR(): string { return '#aaa'; };

    @ViewChild('up') up;
    @ViewChild('left') left;
    @ViewChild('right') right;
    @ViewChild('down') down;

    @Input() playState: PlayState = PlayState.Empty;

    private _dragState: DragState = DragState.NotDragging;

    // This is a hack, to enable accessing an enum in a template.
    private DragState = DragState;

    // This is a hack to make it easy to access static members from templates.
    RadialMenuComponent = RadialMenuComponent;

    public set dragState(v: DragState) {
        this._dragState = v;
    }

    public get dragState(): DragState {
        return this._dragState;
    }

    public getActionText(playState: PlayState) {
        switch(playState) {
        case PlayState.Empty:
            return "Record";
        case PlayState.Recording:
            return "Stop Record";
        case PlayState.Playing:
            return "Stop";
        case PlayState.Stopped:
            return "Play";
        }
    }

    radialMenuStyles() {
        return {
            marginTop: -RadialMenuComponent.SIZE / 2 + 'px',
            marginLeft: -RadialMenuComponent.SIZE / 2 + 'px',
        };
    }
}
