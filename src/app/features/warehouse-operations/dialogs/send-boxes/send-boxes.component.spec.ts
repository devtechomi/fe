import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBoxesComponent } from './send-boxes.component';

describe('SendBoxesComponent', () => {
  let component: SendBoxesComponent;
  let fixture: ComponentFixture<SendBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendBoxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
