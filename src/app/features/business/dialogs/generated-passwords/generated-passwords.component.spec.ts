import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedPasswordsComponent } from './generated-passwords.component';

describe('GeneratedPasswordsComponent', () => {
  let component: GeneratedPasswordsComponent;
  let fixture: ComponentFixture<GeneratedPasswordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedPasswordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
