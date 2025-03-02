import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialIntegrationComponent } from './initial-integration.component';

describe('InitialIntegrationComponent', () => {
  let component: InitialIntegrationComponent;
  let fixture: ComponentFixture<InitialIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialIntegrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
