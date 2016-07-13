import { Component, ViewChild } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'load-save',
    template: `
    <style>
      #folder {
        width:100px;
        height:100px;
        position: absolute;
        right: 0;
        margin:20px;
      }
    </style>
    <img id='folder' src="folder.svg"/>
`,
    styles: [],
    directives: [LoadSaveComponent]
})
export class LoadSaveComponent {

}
