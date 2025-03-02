import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncWarehousesComponent } from './sync-warehouses.component';

describe('SyncWarehousesComponent', () => {
  let component: SyncWarehousesComponent;
  let fixture: ComponentFixture<SyncWarehousesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncWarehousesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncWarehousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
