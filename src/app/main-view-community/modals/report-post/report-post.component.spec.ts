import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPostComponent } from './report-post.component';

describe('ReportPostComponent', () => {
  let component: ReportPostComponent;
  let fixture: ComponentFixture<ReportPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
