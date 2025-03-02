import { Component } from '@angular/core';
import { UnderDevelopmentComponent } from '../../../../shared/components/errors/under-development/under-development.component';

@Component({
  selector: 'app-sessions',
  imports: [
    UnderDevelopmentComponent
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {

}
