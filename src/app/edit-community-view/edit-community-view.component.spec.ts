import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommunityViewComponent } from './edit-community-view.component';

describe('EditCommunityViewComponent', () => {
  let component: EditCommunityViewComponent;
  let fixture: ComponentFixture<EditCommunityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCommunityViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCommunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
