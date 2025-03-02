import { Component } from '@angular/core';
import { UnderDevelopmentComponent } from '../../../../shared/components/errors/under-development/under-development.component';

@Component({
  selector: 'app-inventory',
  imports: [
    UnderDevelopmentComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

}
