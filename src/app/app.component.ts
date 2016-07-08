import { Component } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `
<loop></loop>
<radial-menu></radial-menu>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, LoopComponent]
})
export class AppComponent {
}
