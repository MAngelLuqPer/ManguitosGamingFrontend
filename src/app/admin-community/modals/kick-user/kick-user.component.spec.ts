import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickUserComponent } from './kick-user.component';

describe('KickUserComponent', () => {
  let component: KickUserComponent;
  let fixture: ComponentFixture<KickUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KickUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KickUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
