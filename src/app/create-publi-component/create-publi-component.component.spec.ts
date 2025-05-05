import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePubliComponentComponent } from './create-publi-component.component';

describe('CreatePubliComponentComponent', () => {
  let component: CreatePubliComponentComponent;
  let fixture: ComponentFixture<CreatePubliComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePubliComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePubliComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
