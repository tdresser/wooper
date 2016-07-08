import { Component } from '@angular/core';

import { Loop } from './loop';

@Component({
    moduleId: module.id,
    selector: 'loop',
    template: `
<p> A loop </p>
`,
    styles: [],
    directives: []
})
export class LoopComponent {
    constructor() {
        this.loops = [];
        let loop : Loop;
        loop = new Loop();
        this.loops.push(loop);
    }

    public ngAfterViewChecked(): void {
        let left = document.getElementById("left");
        left.style.fill = "#f00";
    }

    private loops: Loop[];
}
