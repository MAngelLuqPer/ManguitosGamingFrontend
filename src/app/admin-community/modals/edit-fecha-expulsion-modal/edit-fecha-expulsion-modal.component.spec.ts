import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFechaExpulsionModalComponent } from './edit-fecha-expulsion-modal.component';

describe('EditFechaExpulsionModalComponent', () => {
  let component: EditFechaExpulsionModalComponent;
  let fixture: ComponentFixture<EditFechaExpulsionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFechaExpulsionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFechaExpulsionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
