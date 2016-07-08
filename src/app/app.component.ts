import { Component } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { RadialMenuComponent } from './radial-menu.component';
import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `
<h1>
{{title}}
</h1>
<loop></loop>
<radial-menu></radial-menu>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, RadialMenuComponent, LoopComponent]
})
export class AppComponent {
    title = 'app works!';
}
