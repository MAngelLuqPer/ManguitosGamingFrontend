import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainViewCommunityComponent } from './main-view-community.component';

describe('MainViewCommunityComponent', () => {
  let component: MainViewCommunityComponent;
  let fixture: ComponentFixture<MainViewCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainViewCommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainViewCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
