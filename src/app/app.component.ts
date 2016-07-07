import { Component } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { RadialMenuComponent } from './radial-menu.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <h1>
    {{title}}
  </h1>
  <radial-menu></radial-menu>
  `,
  styles: [],
  directives: [APP_SHELL_DIRECTIVES, RadialMenuComponent]
})
export class AppComponent {
  title = 'app works!';
}
