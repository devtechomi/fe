import { Component } from '@angular/core';
import { UnderDevelopmentComponent } from "../../../../shared/components/errors/under-development/under-development.component";

@Component({
  selector: 'app-profile',
  imports: [
    UnderDevelopmentComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
