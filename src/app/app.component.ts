import { Component, ViewChildren, QueryList } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `
<loop></loop>
<loop></loop>
<loop></loop>
<loop></loop>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, LoopComponent]
})
export class AppComponent {
    @ViewChildren(LoopComponent)
    loopComponents: QueryList<LoopComponent>;

    constructor() {
    }

    ngAfterViewInit() {
        this.loopComponents.forEach(loopComponent => {
            console.log(loopComponent);
        })
    }
}
